import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory, useParams } from "react-router-dom";
import "../css/UserProfile.css";

function UserProfile() {
  const { userId } = useParams();
  const [userStatus, setUserStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user_id = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar");
  const discriminator = localStorage.getItem("discriminator");
  const avatarUrl = `https://cdn.discordapp.com/avatars/${user_id}/${avatar}.png`;
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const history = useHistory();

  const BASE_URL = "https://squifordsexy-60b818587753.herokuapp.com/";

  useEffect(() => {
    const checkUser = async () => {
      const user_check = localStorage.getItem("userId");
      if (!user_check) {
        setShowMessage(true);
        setTimeout(() => {
          history.push("/");
        }, 3000);
      }
    };
    checkUser();

    const getUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}api/users/${userId}`);
        if (response.data.user) {
          setUserStatus(true);
        } else {
          setShowMessage(true);
          setTimeout(() => {
            history.push("/users");
          }, 3000);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/users/${user_id}/message`);
        const data = await response.json();
        setUserMessages(data.messages);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);

    const storedMessages = JSON.parse(localStorage.getItem("messages"));
    if (storedMessages) {
      setUserMessages(storedMessages);
    }

    return () => clearInterval(interval);
  }, [user_id, userId, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      setShowWarning(true);
      return;
    }

    try {
      await axios.post(`${BASE_URL}api/users/${user_id}/message/`, {
        message
      });
      const response = await axios.get(`${BASE_URL}api/users/${user_id}/message`);
      const data = await response.json();
      setUserMessages(data.messages);
      setShowWarning(false);
      setMessage("");
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    setShowWarning(false);
  };

  const handleFocus = () => {
    setShowWarning(false);
  };

  return (
    <div>
      {isLoading ? (
        <div className="user-profile-container">
          <div className="spinner"></div>
          <div className="loading-message">Carregando perfil...</div>
        </div>
      ) : userStatus ? (
        <div className="user-profile-container">
          {
            <div className="user-profile-container">
              {showMessage ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <div className="redirect-message">Você não está logado, estou lhe redirecionando</div>
                </div>
              ) : (
                <>
                  <img className="user-avatar" src={avatarUrl} alt="User Avatar" />
                  <Link to="/users" className="user-list-link">
                    Usuários
                  </Link>
                  <p className="user-greeting">Bem vindo, {username}!</p>
                  <div className="info-message-container">
                    <div className="user-info">
                      <p className="user-info-title">Informações</p>
                      <p className="user-info-item">ID: {user_id}</p>
                      <p className="user-info-item">
                        Usuário: {username}#{discriminator}
                      </p>
                    </div>
                    <div className="form-container">
                      <h2 className="form-title">Enviar uma mensagem</h2>
                      <form onSubmit={handleSubmit}>
                        <input
                          className="form-input"
                          type="text"
                          id="message"
                          placeholder="Escreva aqui sua mensagem..."
                          value={message}
                          onChange={handleChange}
                          onFocus={handleFocus}
                        />
                        {showWarning && <p className="warning">Por favor, digite uma mensgem válida.</p>}
                        <button className="form-submit" type="submit">
                          Enviar
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="messages-list">
                    <h2 className="messages-list-title">Mensagens</h2>
                    <ul>
                      {userMessages.map((message, index) => (
                        <li key={index} className="message-item">
                          {message.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          }
        </div>
      ) : (
        <div className="user-profile-container">
          <div className="spinner"></div>
          <div className="redirect-message">Usuário não encontrado!</div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
