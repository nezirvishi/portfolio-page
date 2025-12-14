import React, { useEffect, useRef, useState } from 'react'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_CLIENT_SCRIPT = 'https://web3forms.com/client/script.js'
const WEB3FORMS_ACCESS_KEY = '795a2265-2c27-4fbb-abf2-11b6c506990b'

const Contact = () => {
    const cardRef = useRef(null)

    const [status, setStatus] = useState('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const isSending = status === 'sending'

    useEffect(() => {
        const script = document.createElement('script')
        script.id = 'web3forms-client-script'
        script.src = WEB3FORMS_CLIENT_SCRIPT
        script.async = true
        script.defer = true
        document.body.appendChild(script)

        return () => {
            script.remove()
            document
                .querySelectorAll('script[src*="js.hcaptcha.com/1/api.js"]')
                .forEach((hcaptchaScript) => hcaptchaScript.remove())
        }
    }, [])

    const handleGlowMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return

        const rect = card.getBoundingClientRect()
        const mouseX = e.clientX - rect.left - rect.width / 2
        const mouseY = e.clientY - rect.top - rect.height / 2

        let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI)
        angle = (angle + 360) % 360

        card.style.setProperty('--start', angle + 60)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!WEB3FORMS_ACCESS_KEY) {
            setErrorMessage('Contact form is not configured.')
            setStatus('error')
            return
        }

        const form = e.currentTarget

        setStatus('sending')
        setErrorMessage('')

        try {
            const formData = new FormData(form)
            formData.set('access_key', WEB3FORMS_ACCESS_KEY)

            const response = await fetch(WEB3FORMS_ENDPOINT, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData,
            })

            const result = await response.json().catch(() => null)

            if (!response.ok || !result?.success) {
                const message =
                    result?.message ||
                    (response.ok
                        ? 'Something went wrong. Please try again.'
                        : `Request failed (${response.status}). Please try again.`)
                throw new Error(message)
            }

            setStatus('success')
            form.reset()

            window?.hcaptcha?.reset?.()
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
            setStatus('error')
        }
    }

    return (
        <section id="contact" className="w-full md:mt-40 mt-20 section-padding xl:px-0">
            <div className="w-full h-full md:px-20 px-5">
                <div className="font-semibold md:text-5xl text-3xl text-center">
                    Contact
                </div>
                <p className="text-white-50 text-center mt-4 max-w-2xl mx-auto md:text-lg">
                    Got a project in mind or want to collaborate? Send a message and I'll get back to you.
                </p>

                <div className="mt-12 md:mt-16 max-w-2xl mx-auto">


                    <div ref={cardRef} onMouseMove={handleGlowMouseMove} className="card card-border rounded-xl p-5 sm:p-6 md:p-8">
                        <div className="glow" />
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
                            <div>
                                <label htmlFor="name" className="block text-sm md:text-base text-white-50 mb-2">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    disabled={isSending}
                                    className="w-full rounded-lg bg-black-100 border border-black-50 px-4 py-3 text-white placeholder:text-blue-50/70 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-70"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm md:text-base text-white-50 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    disabled={isSending}
                                    className="w-full rounded-lg bg-black-100 border border-black-50 px-4 py-3 text-white placeholder:text-blue-50/70 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-70"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm md:text-base text-white-50 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    required
                                    disabled={isSending}
                                    className="w-full rounded-lg bg-black-100 border border-black-50 px-4 py-3 text-white placeholder:text-blue-50/70 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-70 resize-y"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            <div className="pt-1">
                                <div className="overflow-x-auto">
                                    <div className="inline-block origin-top-left scale-90 sm:scale-100">
                                        <div className="h-captcha" data-captcha="true" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full rounded-lg bg-white text-black font-semibold py-3 transition-colors duration-300 hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSending ? 'Sending...' : 'Send message'}
                            </button>

                            <div aria-live="polite" className="min-h-6">
                                {status === 'success' ? (
                                    <p className="text-sm md:text-base text-emerald-300">
                                        Message sent! Thanks for reaching out.
                                    </p>
                                ) : null}
                                {status === 'error' ? (
                                    <p className="text-sm md:text-base text-rose-300">
                                        {errorMessage || 'Something went wrong. Please try again.'}
                                    </p>
                                ) : null}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact