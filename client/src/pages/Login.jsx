import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', {
                email,
                password
            });
            
            if(response) {
        
            toast.success("Login successful")
                navigate('/otp');
                setPassword("");
                setEmail("");
            }
        } catch (error) {
                toast.error("Login failed")
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600">Please sign in to continue</p>
                </div>
                
                <form className="space-y-5" onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                    >
                        Sign In
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600">
                    <p>Not registered yet? {<Link className='text-purple-600 hover:text-purple-700 font-medium focus:outline-none' to='/register'>Register</Link>}</p>
                    <p>After login, you'll need to set up two-factor authentication</p>
                </div>
            </div>
        </div>
    );
};

export default Login;