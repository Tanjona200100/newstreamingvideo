import React, { useState, useRef } from 'react';
import './home.css'; // Import du fichier CSS séparé

const VRDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const users = [
    { id: 1, name: 'John Doe', task: 'Intitulé de la tache confiée à John Doe', score: 14, maxScore: 20, validated: true, checked: true },
    { id: 2, name: 'Thomas A', task: 'Intitulé de la tache confiée à Thomas', score: 11, maxScore: 20, validated: true, checked: true },
    { id: 3, name: 'Joel S. Chatman', task: 'Tache non identifié', score: 0, maxScore: 20, validated: false, checked: true },
    { id: 4, name: 'Stacy D. Kearse', task: 'Tache non identifié', score: 0, maxScore: 20, validated: false, checked: true },
    { id: 5, name: 'Ashley T. Chong', task: 'Tache non identifié', score: 0, maxScore: 20, validated: false, checked: false },
    { id: 6, name: 'Sally J. Hall', task: 'Tache non identifié', score: 0, maxScore: 20, validated: false, checked: false },
  ];

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Utilisez une source vidéo réelle ou supprimez l'élément source
        videoRef.current.play().catch(e => console.log("Erreur de lecture:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const userDetail = selectedUser || users[0];

  return (
    <div className="vr-dashboard-container">
      {/* Header */}
      <header className="vr-header">
        <div className="header-left">
          <img src="logo 1.png" alt="VR Live Logo" className="logo-image" />
        </div>
        <div className="header-right">
          <div className="notification-wrapper">
            <div className="notification-icon">🔔</div>
            <span className="notification-badge">2</span>
          </div>
          <div className="user-info">
            <div className="welcome-text">Bienvenue</div>
            <div className="user-name">Nancy</div>
          </div>
          <div className="user-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </header>

      <div className="main-grid">
        {/* Liste des utilisateurs */}
        <div className="user-list-card">
          <div className="card-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <h2 className="card-title">Liste des utilisateurs VR</h2>
          </div>

          <table className="user-table">
            <thead>
              <tr className="table-header">
                <th className="table-th" style={{ width: '40px' }}></th>
                <th className="table-th" style={{ textAlign: 'left' }}>Utilisateur</th>
                <th className="table-th" style={{ textAlign: 'left' }}>Taches</th>
                <th className="table-th" style={{ textAlign: 'center' }}>Note</th>
                <th className="table-th" style={{ textAlign: 'center' }}>Note validé</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`table-row hover-bg ${selectedUser?.id === user.id ? 'selected-user' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="table-td">
                    <input
                      type="checkbox"
                      checked={user.checked}
                      className="user-checkbox"
                      readOnly
                    />
                  </td>
                  <td className="table-td">
                    <div className="user-cell">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span className="user-name-cell">{user.name}</span>
                    </div>
                  </td>
                  <td className="table-td" style={{ color: '#718096', fontSize: '14px' }}>
                    {user.task}
                  </td>
                  <td className="table-td" style={{ textAlign: 'center' }}>
                    <span className="score" style={{ color: user.validated ? '#ef4444' : '#cbd5e0' }}>
                      {user.score > 0 ? user.score : '00'}
                    </span>
                    <span className="max-score"> / {user.maxScore}</span>
                  </td>
                  <td className="table-td" style={{ textAlign: 'center' }}>
                    {user.validated ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ margin: '0 auto', display: 'block' }}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ margin: '0 auto', display: 'block' }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="button-wrapper">
            <button className="live-button hover-green">
              VOIR EN LIVE
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Détails utilisateur avec vidéo */}
        <div className="detail-card">
          <h2 className="detail-title">{userDetail.name}</h2>
          <div className="member-since">Membre depuis • Date inconnue</div>

          {/* Zone vidéo en direct */}
          <div className="video-wrapper">
            <div className="video-user-badge">
              <span className="video-badge-text">{userDetail.name}</span>
            </div>
            <div className="live-badge-wrapper">
              <span className="live-badge pulse">LIVE</span>
            </div>
            
            {/* Vidéo sans source pour éviter l'erreur */}
            <video
              ref={videoRef}
              className="video-element"
              controls={isPlaying}
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23cbd5e0' width='400' height='300'/%3E%3C/svg%3E"
            >
              {/* Aucune source pour éviter l'erreur, ou utilisez une vidéo réelle */}
              {/* <source src="votre-video.mp4" type="video/mp4" /> */}
              Votre navigateur ne supporte pas la vidéo HTML5.
            </video>

            <div className="time-counter">Gx13500</div>

            {!isPlaying && (
              <div className="play-button-wrapper">
                <button
                  onClick={handleVideoPlay}
                  className="play-button hover-scale"
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">Notes</span>
              <span>
                <span className="score-detail">{userDetail.score}</span>
                <span className="max-score-detail"> / {userDetail.maxScore}</span>
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Temps écoulé</span>
              <span className="time-badge">Gx13500</span>
            </div>

            <div className="info-block">
              <div className="info-label">Taches</div>
              <div className="info-text">{userDetail.task}</div>
            </div>

            <div className="info-block">
              <div className="info-label">Commentaires</div>
              <div className="info-text">2 commentaires</div>
            </div>
          </div>

          <div className="detail-button-wrapper">
            <button className="detail-button hover-cyan">
              VOIR LES DÉTAILS
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRDashboard;