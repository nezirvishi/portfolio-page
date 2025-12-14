import React, { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'

const COLOR_ZERO = new THREE.Color('#1c1c21')
const COLOR_LOW = new THREE.Color('#2d2d38')
const COLOR_MID = new THREE.Color('#839cb5')
const COLOR_HIGH = new THREE.Color('#d9ecff')

const EMPTY_WEEKS = []

function getBarColor(count, normalized, target) {
    if (count <= 0) {
        target.copy(COLOR_ZERO)
        return target
    }

    if (normalized < 0.45) {
        target.copy(COLOR_LOW).lerp(COLOR_MID, normalized / 0.45)
        return target
    }

    target.copy(COLOR_MID).lerp(COLOR_HIGH, (normalized - 0.45) / 0.55)
    return target
}

const GitHubSkylineMesh = ({
    data,
    barSize = 0.22,
    gap = 0.06,
    maxHeight = 3.2,
    minHeight = 0.025,
}) => {
    const instancedRef = useRef(null)

    const weeks = Array.isArray(data?.weeks) ? data.weeks : EMPTY_WEEKS
    const step = barSize + gap
    const width = Math.max(1, weeks.length) * step
    const depth = 7 * step
    const maxCount = Math.max(1, Number(data?.maxContributionsPerDay ?? 0) || 0)

    useLayoutEffect(() => {
        const mesh = instancedRef.current
        if (!mesh || weeks.length === 0) return

        const dummy = new THREE.Object3D()
        const color = new THREE.Color()

        const weeksCount = weeks.length
        const xOffset = ((weeksCount - 1) * step) / 2
        const zOffset = ((7 - 1) * step) / 2

        let instanceIndex = 0
        for (let weekIndex = 0; weekIndex < weeksCount; weekIndex += 1) {
            const week = weeks[weekIndex]
            const days = Array.isArray(week?.days) ? week.days : []

            for (let weekday = 0; weekday < 7; weekday += 1) {
                const count = Number(days[weekday]?.count ?? 0) || 0
                const normalized = Math.sqrt(count / maxCount)
                const height = minHeight + normalized * maxHeight

                dummy.position.set(weekIndex * step - xOffset, height / 2, weekday * step - zOffset)
                dummy.scale.set(barSize, height, barSize)
                dummy.updateMatrix()

                mesh.setMatrixAt(instanceIndex, dummy.matrix)
                mesh.setColorAt(instanceIndex, getBarColor(count, normalized, color))
                instanceIndex += 1
            }
        }

        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }, [barSize, weeks, maxCount, maxHeight, minHeight, step])

    if (weeks.length === 0) return null

    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[width + 0.6, depth + 0.6]} />
                <meshStandardMaterial color="#0e0e10" roughness={1} metalness={0} />
            </mesh>

            <instancedMesh ref={instancedRef} args={[null, null, weeks.length * 7]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial vertexColors roughness={0.45} metalness={0.1} />
            </instancedMesh>
        </group>
    )
}

export default GitHubSkylineMesh