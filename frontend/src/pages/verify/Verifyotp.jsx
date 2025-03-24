/* eslint-disable react/prop-types */
import { useState } from "react";
import { verifyOTP } from "../../slices/user/userApi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "../../slices/user/authSlice";

function OTPVerification({ onVerify, onClose, email }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = { otp, email };
      const { data } = await verifyOTP(formData);
      onVerify(otp);
      dispatch(setCredentials(data));
      toast.success("OTP Verified Successfully");
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      toast.error("Failed to verify OTP");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center md:p-5 p-5">
      <div className="text-white border p-6 rounded-lg shadow-lg w-full max-w-md bg-black">
        <h2 className="text-xl font-bold text-center mb-4 text-white">
          Verify OTP
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-300"
            >
              OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="block text-white w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <button
          className="mt-4 text-center w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default OTPVerification;
