import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
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

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const navigate = useNavigate();

    const getCaptchaToken = async () => {
        const token = await window.grecaptcha.execute(
            '6LcLAuUqAAAAAPCg15VKsvtbSAsuIIoIRPegWn3R', { action: 'submit' }
        );
        setCaptchaToken(token);
        return token;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = await getCaptchaToken(); 

        if (!token) {
            toast.error("Captcha verification failed. Please try again.");
            return;
        }

        try {
            const response = await axios.post('/login', {
                email,
                password,
                captchaToken: token,
            });
            if (response) {
                toast.success("Login successful");
                navigate('/otp');
                setPassword("");
                setEmail("");
            }
        } catch (error) {
            toast.error("Login failed");
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-[#131313] bg-opacity-90 backdrop-blur-md shadow-2xl rounded-lg border border-[#2a2a2a]">
                <div className="text-center space-y-3">
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="text-gray-400 text-sm">Sign in to continue</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-3 text-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 ease-in-out transform hover:scale-[1.03] shadow-md shadow-cyan-500/50"
                    >
                        Sign In
                    </button>
                </form>

                <div className="text-center text-sm text-gray-400">
                    <p>Not registered yet? <Link className="text-cyan-400 hover:text-cyan-500 font-medium focus:outline-none" to="/register">Register</Link></p>
                    <p>After login, you'll need to set up two-factor authentication</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
