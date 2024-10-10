import React, { useState, useEffect } from 'react';
import { useArticles } from './ArticlesContext';
import SetCard from './SetCard';

const HomePage = () => {
  const { articles, searchResultHeading, white } = useArticles(); // Destructure white
  const [thir, setThir] = useState([]);
  const [art, setArt] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingTopHeadlines, setLoadingTopHeadlines] = useState(true);
  const [loading30, setLoading30] = useState(true);
  const [th, setTh] = useState(true);

  const filteredArticles = articles.filter(
    (article) => article.title !== "[Removed]" && article.urlToImage
  );

  const handle30Search = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/search?query=all`
      );
      if (!response.ok) throw new Error("Failed to fetch articles");

      const data = await response.json();
      const filteredArticles = data.result.articles.filter(
        (article) => article.title !== "[Removed]" && article.urlToImage
      );
      setThir(filteredArticles.slice(0, 30));
      setLoading30(false);
    } catch (error) {
      console.error(error.message);
      setLoading30(false);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/search?query=top-headlines`
      );
      if (!response.ok) throw new Error("Failed to fetch articles");

      const data = await response.json();
      const filteredTopHeadlines = data.result.articles.filter(
        (article) => article.title !== "[Removed]" && article.urlToImage
      );
      setArt(filteredTopHeadlines);
      setLoadingTopHeadlines(false);
    } catch (error) {
      console.error(error.message);
      setLoadingTopHeadlines(false);
    }
  };

  useEffect(() => {
    handle30Search();
  }, []);

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % art.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [art]);

  useEffect(() => {
    if (filteredArticles.length > 0) {
      setTh(false);
    }
  }, [filteredArticles]);

  return (
    <div>
      <div
        className={`${
          white ? 'bg-yellow-400' : 'bg-gray-900'
        } ${white ? 'text-gray-900' : 'text-white'} min-h-100 md:p-6 p-4 flex flex-col md:grid md:grid-flow-col md:grid-cols-2`}
      >
        <div className="flex justify-center p-2 pt-2 md:p-10 md:pt-8 text-slate-95000 font-sans md:text-7xl text-4xl font-extrabold">
          Breaking News, Fresh Perspectives – Every Hour, On the Hour.
        </div>
        <div className="flex items-center justify-center">
          {loadingTopHeadlines ? (
            <div className={`text-lg ${white ? 'text-gray-800' : 'text-white'}`}>
              Loading articles...
            </div>
          ) : (
            art.length > 0 && (
              <SetCard
                className="shadow-lg border-2 border-gray-500 hover:shadow-xl transition-shadow duration-300"
                article={art[currentIndex]}
              />
            )
          )}
        </div>
      </div>

      <div>
        {th ? (
          !loading30 && thir.length > 0 && (
            <div className={`mt-6 ${white?`bg-pink-600`:`bg-gray-900`} rounded-md`}>
              <h1 className="font-serif text-center text-white pt-10 text-5xl font-extrabold p-10">
                Get the Top news of time
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4">
                {thir.map((article, index) => (
                  <SetCard
                    key={index}
                    article={article}
                    className="shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                ))}
              </div>
            </div>
          )
        ) : (
          <div className={`mt-6 ${white ? 'bg-pink-700' : 'bg-gray-700'}`}>
            <h1 className="font-serif text-center pt-10 text-5xl font-extrabold p-10 text-white">
              {searchResultHeading ? `${searchResultHeading} Search Results !!` : "Search Results!!"}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredArticles.length > 0 ? (
                <>
                  {filteredArticles.map((article, index) => (
                    <SetCard
                      key={index}
                      article={article}
                      className="shadow-md hover:shadow-lg transition-shadow duration-300"
                    />
                  ))}
                </>
              ) : (
                <div className="text-lg text-gray-600">No articles available.</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-900 text-white p-4 mt-6">
        <div className="text-center">
          <p className="text-sm">© 2024 Your Company Name. All Rights Reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:underline">About Us</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
