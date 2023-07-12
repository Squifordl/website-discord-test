import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../css/Callback.css";

const Callback = () => {
  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  const username = params.get("username");
  const avatar = params.get("avatar");
  const discriminator = params.get("discriminator");

  useEffect(() => {
    if (userId && username) {
      localStorage.setItem("userId", `${userId}`);
      localStorage.setItem("username", `${username}`);
      localStorage.setItem("avatar", `${avatar}`);
      localStorage.setItem("discriminator", `${discriminator}`);
      localStorage.removeItem("user");

      try {
        history.push(`/userprofile/${userId}`);
      } catch (error) {
        console.error(error);
      }
    }
  }, [history, userId, username, avatar, discriminator]);

  return (
    <div className="callback-container">
      <h1>Processando login...</h1>
    </div>
  );
};

export default Callback;
