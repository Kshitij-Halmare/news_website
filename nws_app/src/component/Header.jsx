import React, { useEffect, useState } from "react";
import logo from "../assets/newsownload.png";
import image from "../assets/image_processing20191110-30800-mr2oo2.gif";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useArticles } from "./ArticlesContext";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

export default function Header() 
{
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [box, setBox] = useState(false); // Dropdown state
    const { setArticles, profilePic, setSearchResultHeading, setWhite, white,setProfilePic } = useArticles(); // Get profilePic from context

    useEffect(()=>{
        async function name() {
            const token=localStorage.getItem("jwtToken");
            if(token){
                const res = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/profile`, {
                    method: "GET",
                    headers: {
                      "Authorization": `Bearer ${token}`, // Send the token in Authorization header
                      "Content-Type": "application/json",
                    },
                  });
                console.log(res);
                if(res.ok){
                    const data=await res.json();
                    console.log(data.data.image)
                    setProfilePic(data.data.image);
                }

            }else{
                toast.error("You must be logged in to search.");
                return;
            }
        }
        name();
    },[white,setWhite])

    const handleSearch = async (searchQuery) => 
    {
        const token = localStorage.getItem("jwtToken");
        if (!token) 
        {
            toast.error("You must be logged in to search.");
            return;
        }
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery.length === 0) 
        {
            toast.error("Please enter a valid search term.");
            return;
        }
        try 
        {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_DOMAIN}/search?query=${encodeURIComponent(trimmedQuery)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) 
            {
                const data = await response.json();
                setArticles(data.result.articles);
                setSearchResultHeading(trimmedQuery); // Pass the query here
                navigate("/home");
                setQuery(""); // Clear query after search
            } 
            else 
            {
                toast.error("Error retrieving data: " + response.statusText);
            }
        } 
        catch (error) 
        {
            toast.error("Error in fetching data: " + error.message);
        }
    };

    const handleSearchClick = () => 
    {
        if (query.trim().length > 0) 
        {
            handleSearch(query);
        } 
        else 
        {
            toast.error("Please enter a valid search term.");
        }
    };

    const handleOnClick = (category) => 
    {
        setQuery(category);
        handleSearch(category);
    };

    const handleKeyPress = (e) => 
    {
        if (e.key === "Enter") 
        {
            handleSearchClick();
        }
    };

    // Toggle dropdown
    const toggleDropdown = () => 
    {
        setBox(!box);
    };

    // Toggle dark mode
    const handleBlack = () => 
    {
        setWhite((prev) => !prev);
        console.log(white);
    };

    return (
        <nav>
            <header className={`fixed z-10 shadow-lg ${white? ' shadow-yellow-950':`shadow-white`} w-full px-1 md:px-6 py-3 ${white ? 'bg-purple-950' : 'bg-black'} flex justify-between items-center`}>
                <div className="flex justify-between items-center">
                    <Link to="/">
                        <div className="h-12">
                            <img src={logo} alt="Logo" className="h-full w-full rounded-full shadow shadow-white" />
                        </div>
                    </Link>
                </div>

                <div className="flex items-center justify-center">
                    <input
                        type="text"
                        id="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="What you want to read"
                        className="border-0 px-0 md:px-6 py-2 placeholder:hidden rounded-l-xl focus:outline-none"
                    />
                    <button
                        onClick={handleSearchClick}
                        className="bg-blue-500 rounded-r-xl py-2 px-0 md:px-3 hover:bg-slate-100"
                    >
                        Search
                    </button>
                </div>

                <div>
                    <nav className="text-base hidden md:gap-6 md:text-lg md:flex">
                        <ul className="flex gap-4 text-yellow-100">
                            {["Tech", "Food", "Entertainment", "Business", "International"].map((category) => (
                                <li key={category} onClick={() => handleOnClick(category)} className="cursor-pointer">
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <button onClick={handleBlack} className="mt-2 md:text-2xl md:pl-0  text-white  px-0.5 py-1 md:px-2">
                        {white ? <MdOutlineDarkMode /> : <MdDarkMode />}
                    </button>
                <div className="flex flex-col justify-start items-center w-12 h-12 relative">
                    {/* Avatar image with dropdown toggle */}
                    <img
                        src={profilePic ? profilePic : image}
                        alt="User Avatar"
                        className="w-full h-full rounded-full object-cover cursor-pointer"
                        onClick={toggleDropdown}
                    />

                    {/* Dropdown menu */}
                    <div
                        className={`bg-yellow-100 absolute top-full right-0 mt-2 flex flex-col gap-1 p-2 rounded-md shadow-lg ${box ? "block" : "hidden"}`}
                    >
                        <Link to="/login">
                            <p onClick={toggleDropdown} className="cursor-pointer hover:bg-yellow-200 py-2 px-4 rounded-lg transition duration-200 ease-in-out">
                                Login
                            </p>
                        </Link>
                        <Link to="/signup">
                            <p onClick={toggleDropdown} className="cursor-pointer hover:bg-yellow-200 py-2 px-4 rounded-lg transition duration-200 ease-in-out">
                                Sign_Up
                            </p>
                        </Link>
                        <Link to="/profile">
                            <p onClick={toggleDropdown} className="cursor-pointer hover:bg-yellow-200 py-2 px-4 rounded-lg transition duration-200 ease-in-out">
                                Profile
                            </p>
                        </Link>

                        {/* Category List */}
                        <ul className="flex flex-col gap-4 text-black">
                            {["Tech", "Food", "Entertainment", "Business", "International"].map((category) => (
                                <li
                                    key={category}
                                    onClick={() => handleOnClick(category)}
                                    className="cursor-pointer sm:hidden hover:bg-yellow-200 py-1 px-4 rounded-lg transition duration-200 ease-in-out"
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </header>
        </nav>
    );
}
