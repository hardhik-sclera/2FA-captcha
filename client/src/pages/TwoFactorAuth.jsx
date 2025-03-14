import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const TwoFactorAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [secret, setSecret] = useState("");
    const [qrcode, setQrcode] = useState("");
    const [token, setToken] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const { email } = location.state || {};

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                const response = await axios.post('/2fa/setup', { email });

                setSecret(response.data.secret.base32);
                const cleanBase64 = response.data.qrUrlImage.replace(/^data:image\/png;base64,/, '');
                setQrcode(`data:image/png;base64,${cleanBase64}`);
            } catch (error) {
                console.error(error);
                setError("Failed to load 2FA setup. Please try again.");
            }
        };

        fetchData();
    }, []);

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsVerifying(true);
        setError("");

        try {
            const response = await axios.post('/2fa/verify', { token, email });

            if (response.data) {
                toast.success("2FA successful");
                navigate('/login');
            } else {
                setError("Invalid token. Please try again.");
            }
        } catch (error) {
            setError("Verification failed. Please try again.");
            console.error(error);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
            <div className="w-full max-w-md p-8 space-y-6 bg-[#131313] bg-opacity-90 backdrop-blur-md border border-[#2a2a2a] rounded-lg shadow-2xl">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Two-Factor Authentication Setup
                    </h2>
                    <p className="text-gray-400">Scan the QR code with your authenticator app</p>
                </div>

                <div className="space-y-6">
                    {qrcode ? (
                        <div className="flex justify-center">
                            <img 
                                src={qrcode} 
                                alt="2FA QR Code"
                                className="border-4 border-cyan-500 rounded-lg shadow-md w-64 h-64"
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-64 h-64 border-4 border-gray-700 rounded-lg flex items-center justify-center animate-pulse">
                                <p className="text-gray-500">Loading QR Code...</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="token" className="block text-sm font-medium text-gray-300">
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                id="token"
                                value={token}
                                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-4 py-3 text-white bg-[#0a0a0a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ease-in-out"
                                placeholder="Enter 6-digit code"
                                required
                                pattern="[0-9]{6}"
                                inputMode="numeric"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isVerifying || token.length !== 6}
                            className="w-full px-4 py-3 text-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isVerifying ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-400">
                        <p>Please save your backup code in a secure location</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuth;
