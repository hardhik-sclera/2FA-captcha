import React, {useEffect, useState} from "react"

const RecaptchaComponent = () => {
    const [captchaToken, setCaptchaToken] = useState(null)

    useEffect(() => {
        const loadRecaptcha = () => {
            const script = document.createElement('script')
            script.src = `https://www.google.com/recaptcha/api.js?render=6LcLAuUqAAAAAPCg15VKsvtbSAsuIIoIRPegWn3R`
            script.async = true;
            script.defer = true;
            document.body.appendChild(script)
        }

        loadRecaptcha();
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
    }
}