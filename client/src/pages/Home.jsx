import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios.get('/protected/home')
      .then((response) => {
        setUsername(response.data);
      })
      .catch((err) => {
        console.log(err);
        navigate('/login');
      });
  }, []);

  const handleLogout = () => {
    axios.get('/logout')
      .then(response => {
        if (response.data) {
          setUsername(response.data);
          console.log("name", response.data);
          toast.success("Logout successful");
          navigate('/login');
        } else {
          toast.error("Logout failed");
        }
      })
      .catch(error => {
        console.error('Logout failed', error);
        toast.error("Logout failed");
      });
  };

  const handleResetTwoFactor = () => {
    axios.post('/2fa/reset')
      .then((response) => {
        if (response.data || response.data.email) {
          console.log(response.data.email);
          const email = response.data.email;
          navigate('/2fa/setup', { state: { qrUrlImage: response.data.qrUrlImage, email } });
        }
      })
      .catch(error => {
        console.error("2FA Reset Error:", error.response?.data || error.message);
        toast.error("2FA reset failed");
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Header with Logout */}
      <div className="w-full bg-[#131313] bg-opacity-90 backdrop-blur-md shadow-md border-b border-[#2a2a2a] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-400">2FA Active</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto mt-20 p-6">
        <div className="bg-[#131313] bg-opacity-90 backdrop-blur-md border border-[#2a2a2a] rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
            Welcome, {username}
          </h1>

          <button
            onClick={handleResetTwoFactor}
            className="px-6 py-3 text-sm font-medium text-cyan-400 border border-cyan-500 rounded-lg hover:bg-cyan-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 shadow-md"
          >
            Reset Two-Factor Authentication
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
