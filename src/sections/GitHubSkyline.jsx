import React, { useEffect, useState } from 'react'
import GitHubSkylineCanvas from '../components/GitHubSkyline/GitHubSkylineCanvas'

const CARD_HEIGHT_CLASS = 'h-[300px] sm:h-[320px] md:h-[340px] lg:h-[360px]'

function pad2(value) {
    return String(value).padStart(2, '0')
}

function formatDateDDMMYYYY(date, { utc = false } = {}) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''

    const day = utc ? date.getUTCDate() : date.getDate()
    const month = utc ? date.getUTCMonth() + 1 : date.getMonth() + 1
    const year = utc ? date.getUTCFullYear() : date.getFullYear()

    return `${pad2(day)}.${pad2(month)}.${year}`
}

function formatYMDDateDDMMYYYY(dateString) {
    if (!dateString) return ''
    return formatDateDDMMYYYY(new Date(`${dateString}T00:00:00.000Z`), { utc: true })
}

function updateCardGlowAngle(event) {
    const element = event.currentTarget
    if (!element) return

    const rect = element.getBoundingClientRect()
    const mouseX = event.clientX - rect.left - rect.width / 2
    const mouseY = event.clientY - rect.top - rect.height / 2

    const angle = (Math.atan2(mouseY, mouseX) * (180 / Math.PI) + 360) % 360
    element.style.setProperty('--start', angle + 60)
}

const GitHubSkyline = () => {
    const [data, setData] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const controller = new AbortController()
        const url = `${import.meta.env.BASE_URL}data/github-skyline.json`

        const loadSkyline = async () => {
            setErrorMessage('')

            try {
                const response = await fetch(url, { signal: controller.signal })

                if (!response.ok) {
                    throw new Error(`Failed to load skyline data (${response.status})`)
                }

                const payload = await response.json()
                setData(payload)
            } catch (error) {
                if (controller.signal.aborted) return

                setData(null)
                setErrorMessage(error instanceof Error ? error.message : 'Failed to load skyline data.')
            }
        }

        loadSkyline()

        return () => controller.abort()
    }, [])

    const username = data?.username ?? ''
    const total = Number(data?.totalContributions ?? 0) || 0
    const max = Number(data?.maxContributionsPerDay ?? 0) || 0
    const startDate = data?.startDate ?? ''
    const endDate = data?.endDate ?? ''
    const generatedAt = data?.generatedAt ?? ''

    const githubUrl = username ? `https://github.com/${username}` : 'https://github.com'
    const rangeText =
        startDate && endDate ? `${formatYMDDateDDMMYYYY(startDate)} - ${formatYMDDateDDMMYYYY(endDate)}` : '--'
    const updatedText = formatDateDDMMYYYY(new Date(generatedAt)) || '--'

    const rows = [
        { label: 'User', value: username || '--' },
        { label: 'Contributions', value: total.toLocaleString() },
        { label: 'Max/day', value: max.toLocaleString() },
        { label: 'Timeline', value: rangeText },
        { label: 'Updated', value: updatedText },
    ]

    return (
        <section id="github" className="w-full md:mt-40 mt-20 section-padding xl:px-0">
            <div className="w-full h-full md:px-20 px-5">
                <div className="font-semibold md:text-5xl text-3xl text-center">GitHub Skyline</div>
                <p className="text-white-50 text-center mt-4 max-w-2xl mx-auto md:text-lg">
                    Here are my contributions to public GitHub repositories over the past 52 weeks
                </p>

                <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-10 gap-10 items-stretch">
                    <div className="lg:col-span-3">
                        <div
                            onMouseMove={updateCardGlowAngle}
                            className={`card card-border rounded-xl p-5 sm:p-6 flex flex-col justify-between ${CARD_HEIGHT_CLASS}`}
                        >
                            <div className="glow" />

                            <div className="space-y-3">
                                {rows.map((row) => (
                                    <div key={row.label} className="flex items-center justify-between gap-6">
                                        <p className="text-white-50">{row.label}</p>
                                        <p className="font-semibold text-right">{row.value}</p>
                                    </div>
                                ))}
                            </div>

                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-lg bg-white text-black font-semibold px-5 py-3 transition-colors duration-300 hover:bg-white/90"
                            >
                                View on GitHub
                            </a>
                        </div>
                    </div>

                    <div
                        onMouseMove={updateCardGlowAngle}
                        className={`card card-border rounded-xl p-3 sm:p-4 lg:col-span-7 ${CARD_HEIGHT_CLASS}`}
                    >
                        <div className="glow" />
                        <div className="w-full h-full rounded-lg overflow-hidden">
                            {errorMessage ? (
                                <div className="w-full h-full flex items-center justify-center text-rose-300 px-5 text-center">
                                    {errorMessage || 'Failed to load skyline data.'}
                                </div>
                            ) : data ? (
                                <GitHubSkylineCanvas data={data} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white-50">
                                    Loading skyline...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GitHubSkyline