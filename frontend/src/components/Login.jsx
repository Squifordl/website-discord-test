import React, { useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import "../css/Login3D.css";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clientId = "548585716817330189";
  const redirectUri = encodeURIComponent(`https://squifordsexy-60b818587753.herokuapp.com/oauth`);
  const responseType = "code";
  const scope = "identify";

  const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

  const handleLoginClick = useCallback(() => {
    setIsLoading(true);
    try {
      window.location.href = oauthUrl;
    } catch (err) {
      setError("Algo deu errado ao tentar fazer login");
      setIsLoading(false);
    }
  }, [oauthUrl]);

  return (
    <div className="login-container-3d">
      <Helmet>
        <title>Login | Squiford</title>
      </Helmet>
      <video autoPlay muted loop className="background-video">
        <source src="/galaxy.mp4" type="video/mp4" />
      </video>
      <div className="login-box-3d">
        <h1 className="login-title-3d">Bem-vindo</h1>
        <h2 className="login-subtitle-3d">Faça login para começar</h2>
        {isLoading ? (
          <div className="discord-login-btn-3d">Carregando...</div>
        ) : (
          <button onClick={handleLoginClick} className="discord-login-btn-3d">
            Fazer login com Discord
          </button>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
