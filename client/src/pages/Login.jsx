import React, { useState } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [isForget, setIsForget] = useState(false);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const clearForm = () => {
    setOtp("");
    setEmail("");
    setConfirmPassword("");
    setPassword("");
    setName("");
  };

  const signupUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) throw new Error("Signup failed");
      alert("Signup successful! Please log in.");
      setIsOTPOpen(false);
      setIsLogin(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) throw new Error("Invalid OTP");
      isForgetPassword ? setIsForget(true) : await signupUser();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
      setOtp("");
    }
  };

  const forgetPassword = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/auth/forgetPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) throw new Error("Forget Password failed");
      alert("Password Changed Successfully..");
      setIsForget(false)
      setIsForgetPassword(false)
      setIsLogin(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const sendOtp = async () => {
    try {
      const response = await fetch("http://localhost:8080/email/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          verificationType: isForgetPassword
            ? "FORGET_PASSWORD"
            : "EMAIL_VERIFICATION",
        }),
      });

      if (!response.ok) throw new Error("OTP sending failed");
      setIsOTPOpen(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const loginUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");
      const userData = await response.json()
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login">
      {!isForgetPassword ? (
        <div className="container">
          <div className="form-container">
            <div className="form-toggle">
              <button
                className={isLogin ? "active" : ""}
                onClick={() => {
                  setIsLogin(true);
                  clearForm();
                }}
              >
                Login
              </button>
              <button
                className={!isLogin ? "active" : ""}
                onClick={() => {
                  setIsLogin(false);
                  clearForm();
                }}
              >
                SignUp
              </button>
            </div>
            {isLogin ? (
              <div className="form">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span onClick={togglePasswordVisibility} className="eye-icon">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <a href="#" onClick={() => setIsForgetPassword(true)}>
                  Forgot Password?
                </a>
                <button onClick={loginUser}>Login</button>
              </div>
            ) : (
              <div className="form">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span onClick={togglePasswordVisibility} className="eye-icon">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="password-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    className="eye-icon"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button onClick={sendOtp}>SignUp</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="container form">
          <div className="form-container">
            <h2 className="text-xl font-bold ">Forget Password</h2>
            <input
              className="w-full h-8 mb-2"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="forget-password-btn" onClick={sendOtp}>
              Get Password
            </button>
            <p>
              Back to Login?{" "}
              <a
                className="text-blue"
                href="#"
                onClick={() => {
                  setIsLogin(true);
                  setIsForgetPassword(false);
                }}
              >
                click here
              </a>
            </p>
          </div>
        </div>
      )}
      <Modal
        isOpen={isOTPOpen}
        onRequestClose={() => setIsOTPOpen(false)}
        className="otp-modal flex items-center justify-center"
        overlayClassName="otp-overlay"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
            OTP Verification
          </h2>
          <p className="text-sm text-center text-gray-600 mb-3">
            Enter the OTP sent to your email
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between mt-5">
            <button
              className="w-1/2 px-4 py-2 bg-[#033452] text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
              onClick={verifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Verify OTP"
              )}
            </button>
            <button
              className="w-1/3 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
              onClick={() => setIsOTPOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isForget}
        onRequestClose={() => setIsForget(false)}
        className="otp-modal flex items-center justify-center"
        overlayClassName="otp-overlay"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
            Update Password
          </h2>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between mt-5">
            <button
              className="w-1/2 px-4 py-2 bg-[#033452] text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
              onClick={forgetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Update Password"
              )}
            </button>
            <button
              className="w-1/3 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
              onClick={() => setIsForget(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
