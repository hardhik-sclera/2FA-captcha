import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OTPInput = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isValid, setIsValid] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    setIsValid(newOtp.every(digit => digit !== ''));
  };

  const handleKeyDown = (e, index) => {
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
      console.log('OTP Submitted:', otp.join(''));
      const token = otp.join('');
      
      axios.post('/otp', { token })
        .then(response => {
          console.log(response);
          if (response.data) {
            toast.success("2FA Successful");
            navigate('/protected/home');
          }
        })
        .catch(err => {
          console.log("Error: ", err);
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#131313] bg-opacity-90 backdrop-blur-md shadow-2xl rounded-lg border border-[#2a2a2a]">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Enter OTP
          </h2>
          <p className="text-gray-400 text-sm">Please enter the 6-digit verification code</p>
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
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-700 rounded-lg bg-[#1a1a1a] text-cyan-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ease-in-out shadow-md shadow-cyan-500/50"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full px-4 py-3 text-lg font-medium text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.03] shadow-md ${
            isValid 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500' 
              : 'bg-gray-700 cursor-not-allowed'
          }`}
        >
          Verify Code
        </button>
      </div>
    </div>
  );
};

export default OTPInput;
