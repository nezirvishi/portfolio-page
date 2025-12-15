import React from 'react'

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className='footer'>
            <div className='footer-container'>
                <p className='text-sm md:text-base'>
                    © {year} Nezir Vishi. All rights reserved.
                </p>
                <div className='flex justify-center md:justify-end'>
                    <a className='text-sm md:text-base hover:text-white transition-colors duration-300' href="#hero">
                        Back to top
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer