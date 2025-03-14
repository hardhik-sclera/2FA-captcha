import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadRecaptcha = () => {
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=6LcLAuUqAAAAAPCg15VKsvtbSAsuIIoIRPegWn3R`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        };
        loadRecaptcha();
    }, []);
const handleRegister = async (e) => {
    e.preventDefault();
    const captchaToken = await getCaptchaToken();
    // await sleep(5000);
    
    if (!captchaToken) {
        toast.error("Please complete the captcha");
        return;
    }

    try {
        const response = await axios.post('/register', {
            username,
            password,
            email,
            captchaToken
        });
        console.log(response)
        if (response) {
            toast.success("Registration successful");
            navigate('/2fa/setup', { state: { email } });
        }
    } catch (error) {
        toast.error("User already exists");
        console.error(error);
    }
};

const getCaptchaToken = async () => {
    try {
        const token = await window.grecaptcha.execute('6LcLAuUqAAAAAPCg15VKsvtbSAsuIIoIRPegWn3R', { action: 'submit' });
        console.log("Captcha token: ", token);
        setCaptchaToken(token);
        return token; // Return the token after it's received
    } catch (error) {
        console.error("Captcha error:", error);
        throw error; // Throw error so it can be handled in handleRegister
    }
};


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-[#131313] bg-opacity-90 backdrop-blur-md shadow-2xl rounded-lg border border-[#2a2a2a]">
                <div className="text-center space-y-3">
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Create Account
                    </h2>
                    <p className="text-gray-400 text-sm">Fill in your details to register</p>
                </div>

                <form className="space-y-6" onSubmit={handleRegister}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-700 bg-[#1a1a1a] text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 transition-all"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-700 bg-[#1a1a1a] text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 transition-all"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-700 bg-[#1a1a1a] text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 transition-all"
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-3 text-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 ease-in-out transform hover:scale-[1.03] shadow-md shadow-cyan-500/50"
                    >
                        Create Account
                    </button>

                    <div className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-cyan-400 hover:text-cyan-500 font-medium focus:outline-none"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;