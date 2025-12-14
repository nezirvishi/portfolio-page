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

## GitHub Skyline (3D)
The GitHub Skyline section renders the last 52 weeks of contributions as a 3D skyline (react-three/fiber).

Skyline data is generated during the GitHub Pages workflow (daily + on push) into `public/data/github-skyline.json` and fetched by the site at runtime. No GitHub tokens are shipped to the browser.

To refresh the JSON locally (optional): `npm run generate:skyline`