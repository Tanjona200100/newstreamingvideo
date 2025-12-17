import React, { useState, useRef, useEffect } from 'react';
import './home.css';
import { ArrowLeft, Edit2, User } from 'lucide-react';

const VRDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [videoSrc, setVideoSrc] = useState('/videos/default.mp4');
  const [currentTime, setCurrentTime] = useState('00:15:00');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    nom: '',
    prenom: '',
    titre: '',
    email: '',
    bio: '',
    pseudo: '',
    formateur: 'Nancy R. Waters'
  });
  const videoRef = useRef(null);
  const userMenuRef = useRef(null);

  const users = [
    { 
      id: 1, 
      name: 'John Doe', 
      task: 'Intitulé de la tache confiée à John Doe', 
      score: 14, 
      maxScore: 20, 
      validated: true, 
      checked: true, 
      joinDate: '15/01/2023',
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@mail.com',
      titre: 'Développeur VR',
      bio: 'Développeur expérimenté en réalité virtuelle',
      pseudo: 'johndoe_vr',
      formateur: 'Nancy R. Waters'
    },
    { 
      id: 2, 
      name: 'Thomas A', 
      task: 'Intitulé de la tache confiée à Thomas', 
      score: 11, 
      maxScore: 20, 
      validated: true, 
      checked: true, 
      joinDate: '20/02/2023',
      nom: 'A',
      prenom: 'Thomas',
      email: 'thomas.a@mail.com',
      titre: 'Designer VR',
      bio: 'Designer spécialisé en interfaces VR',
      pseudo: 'thomas_design',
      formateur: 'Nancy R. Waters'
    },
    { 
      id: 3, 
      name: 'Joel S. Chatman', 
      task: 'Tache non identifié', 
      score: 0, 
      maxScore: 20, 
      validated: false, 
      checked: true, 
      joinDate: '05/03/2023',
      nom: 'Chatman',
      prenom: 'Joel S.',
      email: 'joel.chatman@mail.com',
      titre: 'Technicien VR',
      bio: 'Technicien en équipements VR',
      pseudo: 'joel_tech',
      formateur: 'Nancy R. Waters'
    },
    { 
      id: 4, 
      name: 'Stacy D. Kearse', 
      task: 'Tache non identifié', 
      score: 0, 
      maxScore: 20, 
      validated: false, 
      checked: true, 
      joinDate: '12/03/2023',
      nom: 'Kearse',
      prenom: 'Stacy D.',
      email: 'stacy.kearse@mail.com',
      titre: 'Testeur VR',
      bio: 'Testeur d\'applications VR',
      pseudo: 'stacy_tester',
      formateur: 'Nancy R. Waters'
    },
    { 
      id: 5, 
      name: 'Ashley T. Chong', 
      task: 'Tache non identifié', 
      score: 0, 
      maxScore: 20, 
      validated: false, 
      checked: false, 
      joinDate: '18/03/2023',
      nom: 'Chong',
      prenom: 'Ashley T.',
      email: 'ashley.chong@mail.com',
      titre: 'Étudiant VR',
      bio: 'Étudiant en développement VR',
      pseudo: 'ashley_vr',
      formateur: 'Nancy R. Waters'
    },
    { 
      id: 6, 
      name: 'Sally J. Hall', 
      task: 'Tache non identifié', 
      score: 0, 
      maxScore: 20, 
      validated: false, 
      checked: false, 
      joinDate: '22/03/2023',
      nom: 'Hall',
      prenom: 'Sally J.',
      email: 'sally.hall@mail.com',
      titre: 'Chercheur VR',
      bio: 'Chercheur en technologies immersives',
      pseudo: 'sally_research',
      formateur: 'Nancy R. Waters'
    },
  ];

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mettre à jour le temps de la vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      const hours = Math.floor(video.currentTime / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((video.currentTime % 3600) / 60).toString().padStart(2, '0');
      const seconds = Math.floor(video.currentTime % 60).toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    video.addEventListener('timeupdate', updateTime);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fonction pour voir le profil de l'utilisateur connecté
  const handleViewProfile = () => {
    setSelectedUser(null); // Réinitialiser pour montrer le profil admin
    setShowProfilePopup(true);
    // Charger les données du profil de l'utilisateur connecté (administrateur)
    setProfileFormData({
      nom: 'Admin',
      prenom: 'Nancy',
      titre: 'Responsable VR',
      email: 'nancy@admin.com',
      bio: 'Responsable du département réalité virtuelle',
      pseudo: 'nancy_admin',
      formateur: 'Nancy R. Waters'
    });
  };

  // Fonction pour fermer le popup
  const handleCloseProfile = () => {
    setShowProfilePopup(false);
  };

  // Fonction pour voir en live
  const handleViewLive = (user) => {
    if (!user) return;
    setSelectedUser(user);
    setVideoSrc(`/videos/user-${user.id}.mp4`);
  };

  // Fonction pour gérer le clic sur une ligne du tableau
  const handleUserRowClick = (user) => {
    setSelectedUser(user);
    // Ouvrir le popup avec les données de l'utilisateur
    setShowProfilePopup(true);
    
    // Charger les données de l'utilisateur sélectionné dans le formulaire
    setProfileFormData({
      nom: user.nom || user.name.split(' ')[1] || '',
      prenom: user.prenom || user.name.split(' ')[0] || '',
      titre: user.titre || 'Utilisateur VR',
      email: user.email || `${user.name.toLowerCase().replace(/\s+/g, '.')}@mail.com`,
      bio: user.bio || 'À propos de vous',
      pseudo: user.pseudo || user.name.toLowerCase().replace(/\s+/g, '_'),
      formateur: user.formateur || 'Nancy R. Waters'
    });
  };

  // Fonction pour voir les détails (ouvre le popup)
  const handleViewDetails = (user) => {
    if (!user) return;
    setSelectedUser(user);
    setShowProfilePopup(true);
    
    // Charger les données de l'utilisateur sélectionné dans le formulaire
    setProfileFormData({
      nom: user.nom || user.name.split(' ')[1] || '',
      prenom: user.prenom || user.name.split(' ')[0] || '',
      titre: user.titre || 'Utilisateur VR',
      email: user.email || `${user.name.toLowerCase().replace(/\s+/g, '.')}@mail.com`,
      bio: user.bio || 'À propos de vous',
      pseudo: user.pseudo || user.name.toLowerCase().replace(/\s+/g, '_'),
      formateur: user.formateur || 'Nancy R. Waters'
    });
  };

  // Gestion des changements dans le formulaire du profil
  const handleProfileChange = (e) => {
    setProfileFormData({
      ...profileFormData,
      [e.target.name]: e.target.value
    });
  };

  // Sauvegarder le profil
  const handleSaveProfile = () => {
    console.log('Données du formulaire pour', selectedUser?.name || 'Profil:', profileFormData);
    alert(`Profil de ${selectedUser?.name || 'utilisateur'} enregistré avec succès!`);
    setShowProfilePopup(false);
  };

  const userDetail = selectedUser || users[0];

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="headerContainer">
          <div className="headerLeft">
            <img src="/logo 1.png" alt="VR Live Logo" className="logo-image" />
          </div>
          <div className="headerRight">
            <div className="notificationWrapper">
              <div className="notificationIcon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <span className="notificationBadge">2</span>
            </div>
            
            {/* Menu utilisateur avec dropdown */}
            <div className="userMenuContainer" ref={userMenuRef}>
              <div 
                className="userMenuTrigger" 
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="userInfo">
                  <div className="welcomeText">Bienvenue</div>
                  <div className="userName">Nancy</div>
                </div>
                <div className="userAvatar">
                  <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="userDropdown">
                  <button 
                    className="dropdownItem" 
                    onClick={handleViewProfile}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Mon profil</span>
                  </button>
                  
                  <div className="dropdownDivider"></div>
                  
                  <button 
                    className="dropdownItem logout" 
                    onClick={handleLogout}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mainGrid">
        {/* Liste des utilisateurs */}
        <div className="userListCard">
          <div className="cardHeader">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01628F" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <h2 className="cardTitle">Liste des utilisateurs VR</h2>
          </div>

          {/* Popup du profil - se superpose sur la liste */}
          {showProfilePopup && (
            <div className="profile-popup-overlay">
              <div className="profile-popup-container">
                <div className="profile-popup-content">
                  {/* Header du popup */}
                  <div className="profile-popup-header">
                    <button className="profile-popup-back-btn" onClick={handleCloseProfile}>
                      <ArrowLeft size={20} />
                      RETOUR
                    </button>
                    
                    <div className="profile-popup-user-header">
                      <div className="profile-popup-user-left">
                        <div className="profile-popup-avatar">
                          <User size={24} />
                        </div>
                        <h1 className="profile-popup-user-name">
                          {selectedUser ? selectedUser.name : 'Nancy (Admin)'}
                        </h1>
                      </div>
                      <div className="profile-popup-user-right">
                        <span className="profile-popup-member-info">
                          Membre depuis : {selectedUser ? selectedUser.joinDate : 'Date inconnue'}
                        </span>
                        <button className="profile-popup-edit-btn">
                          MODIFIER
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Formulaire */}
                  <div className="profile-popup-form">
                    {/* Nom et Prénom */}
                    <div className="profile-form-row">
                      <div className="profile-form-group">
                        <label>Nom</label>
                        <div className="profile-input-wrapper">
                          <User className="profile-input-icon" size={18} />
                          <input
                            type="text"
                            name="nom"
                            value={profileFormData.nom}
                            onChange={handleProfileChange}
                            placeholder="Votre nom complet"
                            className="profile-popup-input"
                          />
                        </div>
                      </div>
                      <div className="profile-form-group">
                        <label>Prénom</label>
                        <div className="profile-input-wrapper">
                          <User className="profile-input-icon" size={18} />
                          <input
                            type="text"
                            name="prenom"
                            value={profileFormData.prenom}
                            onChange={handleProfileChange}
                            placeholder="Votre nom complet"
                            className="profile-popup-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Titre et E-mail */}
                    <div className="profile-form-row">
                      <div className="profile-form-group">
                        <label>Titre</label>
                        <div className="profile-input-wrapper">
                          <User className="profile-input-icon" size={18} />
                          <input
                            type="text"
                            name="titre"
                            value={profileFormData.titre}
                            onChange={handleProfileChange}
                            placeholder="Votre titre"
                            className="profile-popup-input"
                          />
                        </div>
                      </div>
                      <div className="profile-form-group">
                        <label>E-mail</label>
                        <div className="profile-input-wrapper">
                          <User className="profile-input-icon" size={18} />
                          <input
                            type="email"
                            name="email"
                            value={profileFormData.email}
                            onChange={handleProfileChange}
                            placeholder="Votre email"
                            className="profile-popup-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="profile-form-group profile-full-width">
                      <label>Bio</label>
                      <div className="profile-input-wrapper">
                        <User className="profile-input-icon profile-textarea-icon" size={18} />
                        <textarea
                          name="bio"
                          value={profileFormData.bio}
                          onChange={handleProfileChange}
                          placeholder="À propos de vous"
                          rows="3"
                          className="profile-popup-textarea"
                        />
                      </div>
                    </div>

                    {/* Pseudo et Formateur */}
                    <div className="profile-form-row">
                      <div className="profile-form-group">
                        <label>Pseudo</label>
                        <div className="profile-input-wrapper">
                          <User className="profile-input-icon" size={18} />
                          <input
                            type="text"
                            name="pseudo"
                            value={profileFormData.pseudo}
                            onChange={handleProfileChange}
                            placeholder="Votre pseudo"
                            className="profile-popup-input"
                          />
                        </div>
                      </div>
                      <div className="profile-form-group">
                        <label>Formateur principale</label>
                        <div className="profile-input-wrapper">
                          <User className="profile-input-icon" size={18} />
                          <input
                            type="text"
                            name="formateur"
                            value={profileFormData.formateur}
                            onChange={handleProfileChange}
                            className="profile-popup-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bouton Enregistrer */}
                    <div className="profile-popup-submit-container">
                      <button onClick={handleSaveProfile} className="profile-popup-submit-btn">
                        ENREGISTRER
                        <span className="profile-submit-arrow">»</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <table className="table">
            <thead>
              <tr className="tableHeader">
                <th className="th checkboxColumn"></th>
                <th className="th textLeft">Utilisateur</th>
                <th className="th textLeft">Taches</th>
                <th className="th textCenter">Note</th>
                <th className="th textCenter">Note validé</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`tableRow hover-bg ${selectedUser?.id === user.id ? 'selected-row' : ''}`}
                  onClick={() => handleUserRowClick(user)}
                >
                  <td className="td">
                    <input
                      type="checkbox"
                      checked={user.checked}
                      className="checkbox"
                      readOnly
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="td">
                    <div className="userCell">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#01628F" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span className="userName2">{user.name}</span>
                    </div>
                  </td>
                  <td className="td taskColumn">{user.task}</td>
                  <td className="td textCenter">
                    <span className={`score ${user.validated ? 'score-validated' : 'score-invalid'}`}>
                      {user.score > 0 ? user.score : '00'}
                    </span>
                    <span className="maxScore"> / {user.maxScore}</span>
                  </td>
                  <td className="td textCenter">
                    {user.validated ? (
                       <svg
                          width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                          <circle cx="12" cy="12" r="12" fill="#1E9D0D" />
                          <polyline points="6 12 10 16 18 8" fill="none" stroke="#ffffff" strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round" />
                       </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="#ef4444" />
                        <line x1="9" y1="9" x2="15" y2="15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                     </svg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="buttonWrapper">
            <button 
              className="liveButton hover-green"
              onClick={() => handleViewLive(selectedUser || users[0])}
            >
              VOIR EN LIVE
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Détails utilisateur avec vidéo */}
        <div className="detailCard">
          <center><h2 className="detailTitle">{userDetail.name}</h2>
          <div className="memberSince">Membre depuis • {userDetail.joinDate}</div></center>
          <div className="videoUserBadge">
            <span className="videoBadgeText">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
              {userDetail.name}
            </span>
          </div>
          {/* Zone vidéo en direct */}
          <div className="videoWrapper">
            <div className="liveBadgeWrapper">
              <span className="liveBadge pulse">LIVE</span>
            </div>
            
            <video
              ref={videoRef}
              className="video"
              controls={isPlaying}
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23cbd5e0' width='400' height='300'/%3E%3C/svg%3E"
            >
              <source src={videoSrc} type="video/mp4" />
              Votre navigateur ne supporte pas la vidéo HTML5.
            </video>

            <div className="timeCounter">{currentTime}</div>

            {!isPlaying && (
              <div className="playButtonWrapper">
                <button
                  onClick={handleVideoPlay}
                  className="playButton hover-scale"
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="infoSection">
            <div className="infoRow">
              <span className="infoLabel">Notes</span>
              <span>
                <span className="scoreDetail">{userDetail.score}</span>
                <span className="maxScoreDetail"> / {userDetail.maxScore}</span>
              </span>
            </div>

            <div className="infoRow">
              <span className="infoLabel">Temps écoulé</span>
              <span className="timeBadge">{currentTime}</span>
            </div>

            <div className="infoBlock">
              <div className="infoLabel">Taches</div>
              <div className="infoText">{userDetail.task}</div>
            </div>

            <div className="infoBlock">
              <div className="infoLabel">Commentaires</div>
              <div className="infoText">2 commentaires</div>
            </div>
          </div>

          {/* Bouton qui change selon si le popup est ouvert ou non */}
          <center><div className="detailButtonWrapper">
            <button 
              className="detailButton hover-cyan"
              onClick={() => {
                if (showProfilePopup) {
                  // Si le popup est ouvert, le bouton devient "VOIR EN LIVE"
                  handleViewLive(userDetail);
                } else {
                  // Si le popup n'est pas ouvert, le bouton est "VOIR LES DÉTAILS"
                  handleViewDetails(userDetail);
                }
              }}
            >
              {showProfilePopup ? 'VOIR EN LIVE' : 'VOIR LES DÉTAILS'}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div></center>
        </div>
      </div>
    </div>
  );
};

export default VRDashboard;