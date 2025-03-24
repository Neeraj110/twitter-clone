/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../slices/user/userApi";
import { setCredentials } from "../../slices/user/authSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function LoingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = { email, password };
      const { data } = await login(formData);
      dispatch(setCredentials(data));
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black md:p-0 p-5">
      <div className="mx-auto w-full max-w-md rounded-lg border  p-8 shadow-lg">
        <div>
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold text-white">Log In</h1>
            <p className="text-gray-300">
              Enter your email and password to access your account.
            </p>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
            <Link
              to="/reset-password"
              className="pt-[1rem] text-sm text-blue-500 hover:text-blue-700"
            >
              Forgot your password?
            </Link>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Logging in pls wait" : "Log In"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-300">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="font-medium text-blue-500 hover:text-blue-700"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoingPage;
