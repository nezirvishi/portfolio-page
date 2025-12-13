import React from 'react'
import { logoIconsList } from '../constants'

const LogoIcon = ({ icon }) => {
    return (
        <div className="flex-none flex flex-col items-center justify-center gap-2 select-none">
            <span
                aria-label={icon.name}
                className="skill-logo size-14 md:size-16"
                style={{
                    WebkitMaskImage: `url(${icon.imgPath})`,
                    maskImage: `url(${icon.imgPath})`,
                }}
            />
            <p className="text-sm md:text-base tracking-wide" style={{ color: '#858FAD' }}>
                {icon.name}
            </p>
        </div>
    )
}

const loopIcons = (items) => [...items, ...items]

const Skills = () => {
    const desktopIcons = loopIcons(logoIconsList)
    const mobileIconsRowOne = loopIcons(logoIconsList.filter((_, index) => index % 2 === 0))
    const mobileIconsRowTwo = loopIcons(logoIconsList.filter((_, index) => index % 2 === 1))

    return (
        <section id="skills" className="w-full md:mt-40 mt-20 section-padding xl:px-0">
            <div className="w-full h-full md:px-20 px-5">
                <div className="font-semibold md:text-5xl text-3xl text-center">
                    Skills & Tools
                </div>
                <p className="text-white-50 text-center mt-4 max-w-2xl mx-auto md:text-lg">
                    Some of my favorite tools that I use to design, build, animate and much more.
                </p>

                <div className="md:my-20 my-10 relative">
                    <div className="marquee marquee-fade py-6 md:py-8 hidden md:block" style={{ '--marquee-duration': '85s' }}>
                        <div className="marquee-box md:gap-18 gap-14">
                            {desktopIcons.map((icon, index) => (
                                <LogoIcon key={`${icon.name}-${index}`} icon={icon} />
                            ))}
                        </div>
                    </div>

                    <div className="md:hidden space-y-4">
                        <div className="marquee marquee-fade py-4" style={{ '--marquee-duration': '55s' }}>
                            <div className="marquee-box gap-14">
                                {mobileIconsRowOne.map((icon, index) => (
                                    <LogoIcon key={`${icon.name}-${index}`} icon={icon} />
                                ))}
                            </div>
                        </div>

                        <div className="marquee marquee-fade py-4" style={{ '--marquee-duration': '55s' }}>
                            <div className="marquee-box gap-14 marquee-box-reverse">
                                {mobileIconsRowTwo.map((icon, index) => (
                                    <LogoIcon key={`${icon.name}-${index}`} icon={icon} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills