import React, { useState } from "react";
import { toast } from "react-hot-toast";
import signup from "../assets/image_processing20191110-30800-mr2oo2.gif";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ImageToBeUploaded } from "../utility/imageToBeUploaded.js";
import { useArticles } from "./ArticlesContext";
export default function Signup() {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const {setProfilePic}=useArticles();
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: ""
    });

    // Toggle visibility for password
    const handlePasswordToggle = () => setPasswordVisible((prev) => !prev);

    // Toggle visibility for confirm password
    const handleConfirmPasswordToggle = () => setConfirmPasswordVisible((prev) => !prev);

    // Handle image upload
    const handleTheProfileImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const data = await ImageToBeUploaded(file);
            setProfileImage(data); // Store uploaded image in state
            setProfilePic(data);
            setData((prev) => ({ ...prev, image: data }));
        }
    };

    // Handle form field changes
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, email, password, confirmPassword } = data;

        if (firstName && email && password && confirmPassword) {
            if (password.length < 8 || confirmPassword.length < 8) {
                toast.error("Minimum Length of password should be 8 characters.");
            } else if (password !== confirmPassword) {
                toast.error("Passwords do not match.");
            } else {
                try {
                    const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    });

                    const dataRes = await response.json();
                    if (response.ok) {
                        localStorage.setItem("jwtToken",dataRes.token);
                        toast.success(dataRes.message || "Signup successful!");
                        navigate("/");
                    } else {
                        toast.error(dataRes.message || "Signup failed! Please try again.");
                    }
                } catch (error) {
                    toast.error("An error occurred during signup. Please try again.");
                }
            }
        } else {
            toast.error("Please fill out all required fields.");
        }
    };

    return (
        <div className="py-2 md:pt-4">
            <div className="relative shadow drop-shadow-md flex p-4 flex-col w-full max-w-sm bg-white m-auto rounded-2xl">
                <div className="w-24 h-24 rounded-full shadow-md m-auto bg-slate-50 shadow-slate-500 drop-shadow-sm relative">
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-24 h-20 rounded-full object-cover overflow-hidden m-auto" />
                    ) : (
                        <img src={signup} alt="Signup" className="w-24 h-20 rounded-full object-cover overflow-hidden m-auto" />
                    )}
                    <label htmlFor="profileImage" className="absolute inset-x-0 bottom-0 text-center text-sm cursor-pointer">
                        Upload
                        <input type="file" id="profileImage" accept="image/*" className="hidden" onChange={handleTheProfileImage} />
                    </label>
                </div>

                <form className="w-full py-3" onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="rounded-md focus:outline-orange-200 mb-2 mt-1 w-full bg-slate-300 px-2 py-1 border-none"
                        value={data.firstName}
                        onChange={handleChange}
                    />

                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="rounded-md focus:outline-orange-200 mb-2 mt-1 w-full bg-slate-300 px-2 py-1 border-none"
                        value={data.lastName}
                        onChange={handleChange}
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="rounded-md focus:outline-orange-200 mb-2 mt-1 w-full bg-slate-300 px-2 py-1 border-none"
                        value={data.email}
                        onChange={handleChange}
                    />

                    <label htmlFor="password">Password</label>
                    <div className="flex px-2 mb-3 mt-1 bg-slate-300 rounded-md focus:outline-orange-200">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            name="password"
                            className="outline-none mb-2 mt-1 w-full bg-slate-300 border-none"
                            value={data.password}
                            onChange={handleChange}
                        />
                        <span className="flex text-xl items-center cursor-pointer" onClick={handlePasswordToggle}>
                            {passwordVisible ? <MdOutlineRemoveRedEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="flex px-2 mb-3 mt-1 bg-slate-300 rounded-md focus:outline-orange-200">
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            className="outline-none mb-2 mt-1 w-full bg-slate-300 border-none"
                            value={data.confirmPassword}
                            onChange={handleChange}
                        />
                        <span className="flex text-xl items-center cursor-pointer" onClick={handleConfirmPasswordToggle}>
                            {confirmPasswordVisible ? <MdOutlineRemoveRedEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    <button className="bg-red-500 text-white text-xl p-2 px-6 hover:bg-red-700 rounded-full block m-auto">
                        Sign-up
                    </button>
                </form>
                <p className="mt-3">
                    Already have an account? <Link to={"/login"} className="text-blue-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
