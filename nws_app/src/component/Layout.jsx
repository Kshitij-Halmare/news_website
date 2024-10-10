import React from "react"; // Import React
import Header from "./Header"; // Import the Header component
import { Outlet } from "react-router-dom"; // Import Outlet for nested routes
import { Toaster } from "react-hot-toast";
import { useArticles } from "./ArticlesContext";
// Named function component
const Layout = () => {
    const {white}=useArticles;
    return (
        <>
            <Toaster/>
            <Header /> {/* Render the Header component */}
            <main className={`pt-16  bg-slate-100 min-h-[calc(100vh)] ${white ? 'bg-white' : 'bg-gray-700'}`}>
                <Outlet /> {/* Render the child route's component */}
            </main>
        </>
    );
};

export default Layout; // Export the Layout component
