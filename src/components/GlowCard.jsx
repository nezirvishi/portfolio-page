import React from 'react'

const GlowCard = ({ card, children, className = '' }) => {
    const handleMouseMove = (e) => {
        const el = e.currentTarget
        if (!el) return

        const rect = el.getBoundingClientRect()
        const mouseX = e.clientX - rect.left - rect.width / 2
        const mouseY = e.clientY - rect.top - rect.height / 2

        let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI)
        angle = (angle + 360) % 360

        el.style.setProperty('--start', angle + 60)
    }

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