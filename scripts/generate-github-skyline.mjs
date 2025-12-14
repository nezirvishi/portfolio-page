import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DAY_MS = 24 * 60 * 60 * 1000
const SOURCE = 'https://github.com/users/:username/contributions'

function parseUTCDate(ymd) {
    const date = new Date(`${ymd}T00:00:00.000Z`)
    if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${ymd}`)
    return date
}

function formatUTCDate(date) {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function addUTCDays(date, days) {
    return new Date(date.getTime() + days * DAY_MS)
}

function startOfUTCWeekSunday(date) {
    return addUTCDays(date, -date.getUTCDay())
}

function getTagAttribute(tag, attributeName) {
    const match = tag.match(new RegExp(`${attributeName}="([^"]+)"`))
    return match?.[1] ?? null
}

function parseContributionCountFromTooltip(text) {
    const cleaned = String(text ?? '').replace(/\s+/g, ' ').trim()
    if (!cleaned) return null

    if (/^No contributions\b/i.test(cleaned)) return 0

    const match = cleaned.match(/^([\d,]+)\s+contribution/i)
    if (!match) return null

    const count = Number(match[1].replace(/,/g, ''))
    return Number.isFinite(count) && count >= 0 ? count : null
}

async function fetchText(url) {
    const response = await fetch(url, {
        headers: {
            Accept: 'text/html',
            'User-Agent': 'portfolio-page-github-skyline-generator',
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch contributions (${response.status})`)
    }

    return response.text()
}

function parseYearContributionCounts(html) {
    const dateById = new Map()
    const dayTags = [...html.matchAll(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g)].map((m) => m[0])

    for (const tag of dayTags) {
        const id = getTagAttribute(tag, 'id')
        const date = getTagAttribute(tag, 'data-date')
        if (!id || !date) continue
        dateById.set(id, date)
    }

    if (dateById.size === 0) {
        throw new Error('Could not parse ContributionCalendar-day elements')
    }

    const countsByDate = new Map()
    const tooltipMatches = [...html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)]

    for (const match of tooltipMatches) {
        const dayId = match[1]
        const tooltipText = match[2]
        const count = parseContributionCountFromTooltip(tooltipText)
        if (count == null) continue

        const date = dateById.get(dayId)
        if (!date) continue

        countsByDate.set(date, count)
    }

    if (countsByDate.size === 0) {
        throw new Error('Could not parse contribution counts from tooltips')
    }

    return countsByDate
}

async function fetchYearContributionCounts({ username, year }) {
    const from = `${year}-01-01`
    const to = `${year}-12-31`
    const url = `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${from}&to=${to}`
    const html = await fetchText(url)
    return parseYearContributionCounts(html)
}

function buildCalendarFromDaily({ username, daily }) {
    if (!Array.isArray(daily) || daily.length === 0) {
        throw new Error('No daily contributions data available')
    }

    const startDate = daily[0]?.date ?? ''
    const endDate = daily[daily.length - 1]?.date ?? ''
    if (!startDate || !endDate) {
        throw new Error('Invalid daily contributions range')
    }

    const start = parseUTCDate(startDate)
    const startWeek = startOfUTCWeekSunday(start)

    const weeksMap = new Map()
    let totalContributions = 0
    let maxContributionsPerDay = 0

    for (const { date, count } of daily) {
        totalContributions += count
        maxContributionsPerDay = Math.max(maxContributionsPerDay, count)

        const dt = parseUTCDate(date)
        const weekday = dt.getUTCDay()
        const dayIndex = Math.floor((dt.getTime() - startWeek.getTime()) / DAY_MS)
        const weekIndex = Math.floor(dayIndex / 7)

        const weekDays = weeksMap.get(weekIndex) ?? Array(7).fill(null)
        weekDays[weekday] = { date, count, weekday }
        weeksMap.set(weekIndex, weekDays)
    }

    const weeks = [...weeksMap.keys()].sort((a, b) => a - b).map((weekIndex) => {
        const weekStart = addUTCDays(startWeek, weekIndex * 7)
        const days = weeksMap.get(weekIndex) ?? Array(7).fill(null)

        for (let weekday = 0; weekday < 7; weekday += 1) {
            if (days[weekday]) continue
            const date = formatUTCDate(addUTCDays(weekStart, weekday))
            days[weekday] = { date, count: 0, weekday }
        }

        return { weekIndex, days }
    })

    return {
        username,
        startDate,
        endDate,
        totalContributions,
        maxContributionsPerDay,
        weeks,
    }
}

async function fetchLast52WeeksCalendar({ username }) {
    const endDate = parseUTCDate(formatUTCDate(new Date()))
    const start = addUTCDays(startOfUTCWeekSunday(endDate), -52 * 7)

    const years = new Set([start.getUTCFullYear(), endDate.getUTCFullYear()])
    const counts = new Map()

    for (const year of years) {
        const yearCounts = await fetchYearContributionCounts({ username, year })
        for (const [date, count] of yearCounts) {
            counts.set(date, count)
        }
    }

    const totalDays = Math.floor((endDate.getTime() - start.getTime()) / DAY_MS) + 1
    const daily = []

    for (let i = 0; i < totalDays; i += 1) {
        const date = formatUTCDate(addUTCDays(start, i))
        daily.push({ date, count: counts.get(date) ?? 0 })
    }

    return buildCalendarFromDaily({ username, daily })
}

async function main() {
    const username =
        process.env.SKYLINE_USERNAME ||
        process.env.GITHUB_REPOSITORY_OWNER ||
        process.env.GITHUB_USERNAME ||
        'nezirvishi'

    const outputPath = process.env.SKYLINE_OUTPUT_PATH || 'public/data/github-skyline.json'

    const data = await fetchLast52WeeksCalendar({ username })

    const payload = {
        version: 1,
        generatedAt: new Date().toISOString(),
        source: SOURCE,
        ...data,
    }

    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, `${JSON.stringify(payload)}\n`, 'utf8')
    process.stdout.write(`Generated ${outputPath} for ${username}\n`)
}

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
    process.exitCode = 1
})