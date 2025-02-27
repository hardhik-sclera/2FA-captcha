import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const OTPInput = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isValid, setIsValid] = useState(false);
  const inputRefs = useRef([]);
  const navigate=useNavigate();
  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Check if OTP is complete
    setIsValid(newOtp.every(digit => digit !== ''));
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      setIsValid(newOtp.every(digit => digit !== ''));
    }
  };

  const handleSubmit = () => {
    if (isValid) {
      console.log('OTP Submitted:', typeof otp.join(''));
      const token = otp.join('')
      axios.post('/otp',{token}).then((response)=>{
        if(response.data)
        {
            toast.success("2FA Successful");
            navigate('/protected/home')
        }
      }).catch(
        (err)=>{
            console.log("Error: ",err);
            toast.error('Wrong OTP')
            navigate('/login')
        }
      )
      
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Enter OTP
          </h2>
          <p className="text-gray-600">Please enter the 6-digit verification code</p>
        </div>
        
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={el => inputRefs.current[index] = el}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full px-4 py-3 text-lg font-medium text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
            isValid 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Verify Code
        </button>
      </div>
    </div>
  );
};

export default OTPInput;