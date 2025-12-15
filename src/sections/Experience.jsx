import React, { useRef } from 'react'
import { expCards } from '../constants'
import GlowCard from '../components/GlowCard'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
    const timelineTriggerRef = useRef(null)

    useGSAP(() => {
        const container = timelineTriggerRef.current
        if (!container) return

        gsap.utils.toArray('.timeline-card').forEach((card) => {
            gsap.from(card, {
                xPercent: -100,
                opacity: 0,
                transformOrigin: 'left left',
                duration: 1,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%'
                }
            })
        })

        const syncTimelineLine = () => {
            const line = container.querySelector('.timeline-wrapper')
            const logos = container.querySelectorAll('.timeline-logo')
            if (!line || logos.length === 0) return

            const containerRect = container.getBoundingClientRect()
            const firstRect = logos[0].getBoundingClientRect()
            const lastRect = logos[logos.length - 1].getBoundingClientRect()

            const left = firstRect.left - containerRect.left + firstRect.width / 2
            const top = firstRect.top - containerRect.top + firstRect.height / 2
            const bottom = lastRect.top - containerRect.top + lastRect.height / 2

            gsap.set(line, { left, top, height: Math.max(0, bottom - top), xPercent: -50 })
        }

        const timelineEnd = () => (window.innerWidth < 768 ? 'bottom center' : '77% center')

        syncTimelineLine()

        gsap.fromTo(
            '.timeline',
            { scaleY: 1, transformOrigin: 'bottom bottom' },
            {
                scaleY: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top center',
                    end: timelineEnd,
                    scrub: true,
                    invalidateOnRefresh: true,
                    onRefreshInit: syncTimelineLine,
                },
            },
        )

        gsap.utils.toArray('.expText').forEach((text) => {
            gsap.from(text, {
                xPercent: 0,
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: text,
                    start: 'top 60%'
                }
            })
        })
    }, []);

    return (
        <section id="experience" className='w-full md:mt-40 mt-20 section-padding xl:px-0'>
            <div className='w-full h-full md:px-20 px-5'>
                <div className='font-semibold md:text-5xl text-3xl text-center'>
                    Experience and Services
                </div>
                <div ref={timelineTriggerRef} className='mt-32 relative'>
                    <div className='timeline-wrapper'>
                        <div className='timeline' />
                        <div className='gradient-line w-1 h-full' />
                    </div>
                    <div className='relative z-50 xl:space-y-32 space-y-10'>
                        {expCards.map((card) => (
                            <div key={card.title} className='exp-card-wrapper'>
                                <div className='xl:w-2/6'>
                                    <GlowCard card={card} className='card-border timeline-card rounded-xl p-10'>
                                    </GlowCard>
                                </div>
                                <div className='xl:w-4/6'>
                                    <div className='flex items-start'>
                                        <div className='expText flex xl:gap-20 md:gap-10 gap-5 relative z-20'>
                                            <div className='timeline-logo'>
                                                <img src={card.logoPath} alt="logo" />
                                            </div>
                                            <div className=''>
                                                <h1 className='font-semibold text-3xl'>{card.title}</h1>
                                                <ul className='list-disc ms-5 mt-5 flex flex-col gap-5 text-white-50'>
                                                    {card.deliverables.map((deliverables) => (
                                                        <li key={deliverables} className='text-lg'>
                                                            {deliverables}
                                                        </li>
                                                    ))}
                                                </ul>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Experience