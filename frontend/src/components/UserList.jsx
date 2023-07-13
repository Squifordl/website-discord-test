import React, { useState, useEffect, useCallback, memo } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "../css/UserList.css";
import "../css/UserListRedirectMessage.css";
import "../css/LoadingSpinner.css";

function UserList() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const history = useHistory();
  const BASE_URL = "https://squifordsexy-60b818587753.herokuapp.com/";

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}api/users`);
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
          console.log("Usuários buscados:", response.data);
        } else {
          console.error("A resposta da API está invalida:", response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if(searchTerm === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [searchTerm, users]);

  const handleAvatarClick = useCallback((userId) => {
    setSelectedUserId(userId);
    setShowPopup(true);
  }, []);

  const handleUserProfileClick = useCallback((userId) => {
    history.push(`/userprofile/${userId}`);
  }, [history]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">Usuários cadastrados</h2>
      <input 
        type="text" 
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="user-search-input"
      />
      <div className="user-list">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-message">Carregando usuários...</div>
          </div>
        ) : error ? (
          <div className="error-message">Erro ao carregar usuários: {error}</div>
        ) : (
          filteredUsers.map((user, index) => (
            <div key={index} className="user-list-item">
              <div
                className="user-avatar-container"
                onClick={() => handleAvatarClick(user.userId)}
                role="button"
                aria-label="Abrir perfil de usuário"
              >
                <img
                  src={user.avatarUrl}
                  alt={`Avatar do usuário ${user.username}`}
                  className="user-avatar"
                />
                <i className="fas fa-eye icon-eye"></i>
              </div>
              <p className="user-name">{user.username}</p>
              <button
                className="user-profile-btn"
                onClick={() => handleUserProfileClick(user.userId)}
                aria-label="Abrir perfil de usuário"
              >
                Ver perfil
              </button>
            </div>
          ))
        )}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h3>Deseja ser redirecionado para o perfil do usuário?</h3>
              <button onClick={() => setShowPopup(false)}>Cancelar</button>
              <button onClick={() => (window.location.href = `https://discord.com/users/${selectedUserId}`)}>
                Ir para o perfil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(UserList);
