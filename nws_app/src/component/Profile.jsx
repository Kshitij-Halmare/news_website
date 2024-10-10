import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import toast from "react-hot-toast"; // Optionally use toast notifications

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Function to fetch user profile using fetch
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      // Make API call to get profile using fetch
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Send the token in Authorization header
          "Content-Type": "application/json",
        },
      });

      // Check if response is OK (status 200-299)
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Handle unauthorized or forbidden access
          localStorage.removeItem("jwtToken"); // Remove token
          toast.error("Session expired, please log in again."); // Notify user
          navigate("/login"); // Redirect to login page
          return;
        }
        throw new Error("Failed to fetch profile. Please try again.");
      }

      const data = await response.json(); // Parse the response JSON data
      console.log(data);
      setUser(data.data); // Set the user data (Make sure `data.data` structure matches your API response)
      setLoading(false); // Set loading to false
    } catch (err) {
      setError(err.message || "An error occurred while fetching profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile when component mounts
  }, []);

  // Handle loading state
  if (loading) {
    return <div className="text-center mt-10 text-lg font-semibold">Loading profile...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center mt-10 text-red-500 text-lg">{error}</div>;
  }

  // Handle user data not found
  if (!user) {
    return <div className="text-center mt-10 text-gray-500 text-lg">No user data available</div>;
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Clear the correct token from local storage
    setUser(null); // Clear user state on logout
    toast.success("Logged out successfully."); // Notify user
    navigate("/login"); // Redirect to login page
  };

  // Render user profile if data is available
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>
        <div className="text-center">
          <p className="text-lg font-medium mb-2">
            <strong>First Name:</strong> {user.firstName || "N/A"}
          </p>
          <p className="text-lg font-medium mb-2">
            <strong>Last Name:</strong> {user.lastName || "N/A"}
          </p>
          <p className="text-lg font-medium mb-2">
            <strong>Email:</strong> {user.email || "N/A"}
          </p>
          {user.image ? (
            <img
              className="rounded-full w-32 h-32 mx-auto mt-4"
              src={user.image}
              alt="User Profile"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mt-4 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
