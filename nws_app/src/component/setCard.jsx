import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useArticles } from "./ArticlesContext";

const SetCard = ({ article }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const { white } = useArticles(); // Destructure white from the context
  console.log(article);
  const handleClick = (e) => {
    if (!token) {
      e.preventDefault();
      toast.error("You must be logged in to access this article.");
      navigate("/login");
    }
  };

  return (
    <div className={`${white ? 'bg-white' : 'bg-gray-700'} rounded-lg shadow-md p-4 ${white? 'shadow-black':`shadow-white`} mb-6 transition-transform transform hover:scale-105`}>
      <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover rounded-lg"
        />
        <h4 className={`text-lg font-bold mt-4 ${white ? 'text-gray-800' : 'text-white'}`}>
          {article.title}
        </h4>
        <div className={`flex ${white ? 'text-gray-800' : 'text-white'} items-center space-x-2 text-sm mt-2`}>
          <p>{article.source.name}</p>
          <span>*</span>
          <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
        </div>
        <div className={`text-sm mt-4 ${white ? 'text-gray-800' : 'text-white'}`}>
          {article.description}
        </div>
      </a>
    </div>
  );
};

export default SetCard;
