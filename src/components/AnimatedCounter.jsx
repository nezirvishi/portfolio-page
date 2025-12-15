import React from 'react'
import { counterItems } from '../constants/index.js'
import CountUp from 'react-countup'
import GlowCard from './GlowCard'

const AnimatedCounter = () => {
    return (
        <div id='counter' className='padding-x-lg xl:mt-0 md:mt-32 mt-24'>
            <div className='mx-auto grid-3-cols'>
                {counterItems.map((item) => (
                    <GlowCard key={item.label} className='bg-zinc-900 rounded-lg p-10 flex flex-col justify-center'>
                        <div className='counter-number text-white text-5xl font-bold mb-2'>
                            <CountUp suffix={item.suffix} end={item.value} />
                        </div>
                        <div className='text-white-50 text-lg'>{item.label}</div>
                    </GlowCard>
                ))}
            </div>
        </div>
    )
}

export default AnimatedCounter