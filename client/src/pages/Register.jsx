import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleRegister = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/register', {
                username,
                password,
                email
            });
            if(response) {
                toast.success("Registration successful");
                navigate('/2fa/setup',{ state: { email } });
            }
        } catch (error) {
            toast.error("User already exists");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Create Account
                    </h2>
                    <p className="text-gray-600">Please fill in your details to register</p>
                </div>
                
                <form className="space-y-5" onSubmit={handleRegister}>
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                    >
                        Create Account
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-purple-600 hover:text-purple-700 font-medium focus:outline-none"
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