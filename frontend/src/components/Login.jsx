import React from "react";
import "../css/Login3D.css";

function Login() {
  const clientId = "548585716817330189";
  const redirectUri = encodeURIComponent(`https://website-discord-test.vercel.app/oauth`);
  const responseType = "code";
  const scope = "identify";

  const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

  return (
    <div className="login-container-3d">
      <video autoPlay muted loop className="background-video">
        <source src="/galaxy.mp4" type="video/mp4" />
      </video>
      <div className="login-box-3d">
        <h1 className="login-title-3d">Bem-vindo ao Sexo</h1>
        <h2 className="login-subtitle-3d">Faça login para começar</h2>
        <a href={oauthUrl} className="discord-login-link-3d" rel="noreferrer">
          <button className="discord-login-btn-3d">Fazer login com Discord</button>
        </a>
      </div>
    </div>
  );
}

export default Login;
