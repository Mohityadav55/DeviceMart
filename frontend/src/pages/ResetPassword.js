import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁 Import eye icons
import SummaryApi from "../common";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ State for new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ✅ State for confirm password visibility

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);

    try {
      // console.log("token ",token);
      
      // console.log("token in reset password",SummaryApi.resetPassword.url(token));
      const response = await axios.post(SummaryApi.resetPassword.url(token), { newPassword, confirmPassword });
      
      // const response = await axios.post(SummaryApi.resetPassword.url(token), { newPassword, confirmPassword });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }finally {
      setLoading(false); //  Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
        <p className="text-gray-600 text-sm text-center mb-4">
          Enter and confirm your new password.
        </p>

        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // 👁 Toggle visibility
              placeholder="New Password"
              className="w-full p-2 border rounded pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)} // ✅ Toggle state
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* 👁 Icon changes */}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"} // 👁 Toggle visibility
              placeholder="Confirm Password"
              className="w-full p-2 border rounded pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // ✅ Toggle state
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* 👁 Icon changes */}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            disabled={loading} //  Disable button
          >
            {loading ? "Processing..." : "Reset Password"} {/*  Show loading text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;