Personal portfolio built with Vite, React, Tailwind CSS v4, GSAP, and Three.js.

## Tech Stack
- Vite + React
- Tailwind CSS v4 (@tailwindcss/vite)
- GSAP
- three / @react-three/fiber / drei / postprocessing

## Contact Form (Web3Forms)
The Contact section submits to Web3Forms (`https://api.web3forms.com/submit`) and uses hCaptcha. The receiver email is configured in Web3Forms (no email address is stored in this repo).

The Web3Forms Form Access Key is configured in `src/sections/Contact.jsx` and is intended to be used client-side (not a secret) and will be visible in the built site. 
Uses hCaptcha to protect against spam/abuse.