/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { register } from "../../slices/user/userApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPVerification from "../verify/Verifyotp";
import { toast } from "react-toastify";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = { name, email, username, password };
      const { data } = await register(formData);
      console.log("Register Response:", data);
      setShowOTP(true);
      toast.success("OTP Sent to your email");
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to register:", error);
      toast.error("Failed to register");
      setIsLoading(false);
    }
  };

  const handleVerify = (otp) => {
    console.log("OTP Verified:", otp);
    setShowOTP(false);
    navigate("/dashboard");
  };

  const handleClose = () => {
    setShowOTP(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black md:p-0 p-4">
      <div className="mx-auto w-full max-w-md rounded-lg border p-8 shadow-lg">
        <div>
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold text-white">Sign Up</h1>
            <p className="text-gray-300">
              Create a new account to get started.
            </p>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-blue-500 hover:text-blue-700"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
      {showOTP && (
        <OTPVerification onVerify={handleVerify} onClose={handleClose} />
      )}
    </div>
  );
}

export default RegisterPage;
