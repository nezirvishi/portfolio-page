import React, { useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
    const sectionRef = useRef(null);
    const project1Ref = useRef(null);
    const project2Ref = useRef(null);
    const project3Ref = useRef(null);

    useGSAP(() => {
        const projects = [project1Ref.current, project2Ref.current, project3Ref.current];
        projects.forEach((card, index) => {
            gsap.fromTo(
                card, { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, delay: 0.3 * (index + 1),
                    scrollTrigger: { trigger: card, start: 'top bottom-=100', }
                }
            )
        })
        gsap.fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 })
    }, []);

    return (
        <section id='work' ref={sectionRef} className='app-work'>
            <div className='w-full'>
                <div className='worklayout'>
                    {/*LEFT SIDE */}
                    <div ref={project1Ref} className='first-project-wrapper'>
                        <div className='image-wrapper'>
                            <img src="images/project_onecanvas.png" alt="onecanvas" />
                        </div>
                        <div className='text-content'>
                            <h2>OneCanvas Website</h2>
                            <h3>2022</h3>
                            <p className='text-white-50 md:text-xl'>
                                Modern Website for Digital Agency
                            </p>
                        </div>
                    </div>
                    {/*RIGHT SIDE */}
                    <div className='project-list-wrapper overflow-hidden'>
                        <div ref={project2Ref} className='project'>
                            <div className='image-wrapper'>
                                <img src="images/project_pitaya.png" alt="Pitaya" />
                            </div>
                            <h2>Pitaya Webshop</h2>
                            <h3>2020</h3>
                        </div>
                        <div ref={project3Ref} className='project'>
                            <div className='image-wrapper'>
                                <img src="images/project_case.png" alt="Case" />
                            </div>
                            <h2>ERP Case Study</h2>
                            <h3>2021</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>)
}

export default Work