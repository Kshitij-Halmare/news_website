import React, { useState } from "react";
import signup from "../assets/image_processing20191110-30800-mr2oo2.gif";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Toggle password visibility
  const handlePasswordToggle = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Handle input changes
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    // Check if all required fields are filled
    if (email && password) {
      try {
        // Fetch data from the login API
        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // Send email and password
        });

        const dataRes = await response.json(); // Parse response data
        console.log(dataRes);
        // Handle successful login
        if (response.ok) {
          // Set token in localStorage
          localStorage.setItem("jwtToken", dataRes.token);

          toast.success(dataRes.message || "Login successful!"); // Show success message
          navigate("/"); // Redirect after successful login
        } else {
          // Handle login errors
          toast.error(dataRes.message || "Login failed! Please try again.");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred. Please try again.");
      }
    } else {
      // Handle missing fields
      toast.error("Please fill in both email and password.");
    }
  };

  return (
    <div className="py-2 md:pt-4">
      <div className="shadow drop-shadow-md flex p-4 flex-col w-full max-w-sm bg-white m-auto rounded-2xl">
        <div className="w-full">
          <img
            src={signup}
            alt="signup"
            className="w-20 overflow-hidden rounded-full shadow-md m-auto shadow-slate-500 drop-shadow-sm"
          />
        </div>
        <form className="w-full py-3" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="rounded-md focus-within:outline-orange-200 mb-2 mt-1 w-full bg-slate-300 px-2 py-1 border-none"
            value={data.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <div className="flex px-2 mb-3 mt-1 bg-slate-300 rounded-md focus-within:outline focus-within:outline-orange-200">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              className="outline-none mb-2 mt-1 w-full bg-slate-300 border-none"
              value={data.password}
              onChange={handleChange}
            />
            <span
              className="flex text-xl items-center cursor-pointer"
              onClick={handlePasswordToggle}
            >
              {passwordVisible ? <MdOutlineRemoveRedEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button className="bg-red-500 text-white text-xl p-2 px-6 hover:bg-red-700 rounded-full block m-auto">
            Login
          </button>
        </form>
        <p className="mt-3">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-400 hover:underline">
            Sign-up
          </Link>
        </p>
      </div>
    </div>
  );
}
