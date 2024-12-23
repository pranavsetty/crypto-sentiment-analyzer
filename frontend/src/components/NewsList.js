import React, { useEffect, useState } from "react";
import { fetchNews } from "../utils/fetchNews";
import SentimentAnalysis from "./SentimentAnalysis";

const NewsList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getNews = async () => {
      const news = await fetchNews();
      setArticles(news);
    };
    getNews();
  }, []);

  return (
    <div>
      <h2>Crypto News</h2>
      {articles.map((article, index) => (
        <div key={index} className="article">
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          <SentimentAnalysis text={article.description} />
        </div>
      ))}
    </div>
  );
};

export default NewsList;
