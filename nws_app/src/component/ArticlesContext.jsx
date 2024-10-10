import React, { createContext, useContext, useState } from 'react';

// Create Context
const ArticlesContext = createContext();

// Create a provider component
export const ArticlesProvider = ({ children }) => {
    const [articles, setArticles] = useState([]); // Default state for articles
    const [profilePic, setProfilePic] = useState(null); // State for profile picture
    const [searchResultHeading, setSearchResultHeading] = useState(""); // State for search result heading
    const [white,setWhite]=useState(true);
    return (
        <ArticlesContext.Provider value={{ articles,white,setWhite, setArticles, profilePic, setProfilePic, searchResultHeading, setSearchResultHeading }}>
            {children}
        </ArticlesContext.Provider>
    );
};

export const useArticles = () => {
    return useContext(ArticlesContext);
};
