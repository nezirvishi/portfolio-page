import React, { useEffect, useRef } from 'react'

const GlowCard = ({ card, children, className = '' }) => {
    const rafRef = useRef(0)
    const pointerRef = useRef(null)

    const handleMouseMove = (e) => {
        pointerRef.current = {
            el: e.currentTarget,
            clientX: e.clientX,
            clientY: e.clientY,
        }

        if (rafRef.current) return

        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = 0
            const latest = pointerRef.current
            if (!latest?.el) return

            const rect = latest.el.getBoundingClientRect()
            const mouseX = latest.clientX - rect.left - rect.width / 2
            const mouseY = latest.clientY - rect.top - rect.height / 2

            let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI)
            angle = (angle + 360) % 360

            latest.el.style.setProperty('--start', angle + 60)
        })
    }

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    return (
        <div onMouseMove={handleMouseMove} className={`card ${className}`}>
            <div className='glow' />
            {card?.description ? (
                <div className='mb-5'>
                    <p className='text-white-50 text-lg whitespace-pre-line'>
                        {card.description}
                    </p>
                </div>
            ) : null}
            {children}
        </div >
    )
}

export default GlowCard