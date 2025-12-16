import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { User, Lock } from 'lucide-react';
import "./login.css";

export default function VRLiveLogin() {
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;
  const BLOCK_TIME = 15 * 60 * 1000;

  const [email, setEmail] = useState('votreemail@mail.com');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // États pour la popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');

  const [isBlocked, setIsBlocked] = useState(false);
  const [timer, setTimer] = useState(0);

  // Vérifier et restaurer l'état de blocage
  useEffect(() => {
    const checkBlockStatus = () => {
      const blockedUntil = localStorage.getItem("blockedUntil");
      if (blockedUntil) {
        const remaining = parseInt(blockedUntil) - Date.now();
        if (remaining > 0) {
          setIsBlocked(true);
          setTimer(Math.floor(remaining / 1000));
          showPopupMessage(
            "Compte bloqué",
            `Trop de tentatives échouées. Veuillez patienter ${formatTime(Math.floor(remaining / 1000))} avant de réessayer.`
          );
        } else {
          localStorage.removeItem("blockedUntil");
          localStorage.removeItem("loginAttempts");
          setIsBlocked(false);
          setTimer(0);
        }
      }
    };

    checkBlockStatus();
    const interval = setInterval(checkBlockStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Timer pour le blocage
  useEffect(() => {
    let interval;
    if (isBlocked && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsBlocked(false);
            localStorage.removeItem("blockedUntil");
            localStorage.removeItem("loginAttempts");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBlocked]);

  // Formater le temps
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  // Fonction pour afficher les popups
  const showPopupMessage = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setShowPopup(true);
  };

  // Fonction pour fermer la popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Validation des champs
  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      showPopupMessage("Erreur", "L'email est requis");
      return false;
    }
    
    if (!emailRegex.test(email)) {
      showPopupMessage("Erreur", "Veuillez entrer un email valide");
      return false;
    }
    
    if (!password.trim()) {
      showPopupMessage("Erreur", "Le mot de passe est requis");
      return false;
    }
    
    if (password.length < 6) {
      showPopupMessage("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    
    return true;
  };

  // Fonction de redirection
  const redirectToHome = useCallback(() => {
    console.log("Redirection vers /home...");
    navigate("/home", { replace: true });
  }, [navigate]);

  // Gestion de la connexion
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Vérifier si bloqué
    if (isBlocked) {
      showPopupMessage(
        "Compte bloqué",
        `Veuillez patienter ${formatTime(timer)} avant de réessayer`
      );
      return;
    }
    
    // Valider les champs
    if (!validateFields()) {
      return;
    }
    
    setIsLoading(true);
    
    let attempts = parseInt(localStorage.getItem("loginAttempts") || "0");
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`http://192.168.2.161:5000/api/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password, 
          remember: rememberMe 
        }),
      });

      const responseText = await response.text();
      console.log("Réponse serveur:", responseText);
      console.log("Statut HTTP:", response.status);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        showPopupMessage("Erreur", "Format de réponse invalide du serveur");
        setIsLoading(false);
        return;
      }

      // Gestion des erreurs HTTP
      if (!response.ok) {
        if (response.status === 429) {
          showPopupMessage("Limite dépassée", "Trop de tentatives. Veuillez réessayer plus tard.");
        } else if (response.status === 401 || response.status === 400) {
          attempts++;
          localStorage.setItem("loginAttempts", attempts.toString());
          
          if (attempts >= MAX_ATTEMPTS) {
            const blockEnd = Date.now() + BLOCK_TIME;
            localStorage.setItem("blockedUntil", blockEnd.toString());
            setIsBlocked(true);
            setTimer(Math.floor(BLOCK_TIME / 1000));
            showPopupMessage(
              "Compte bloqué",
              "Trop de tentatives échouées. Vous êtes bloqué pour 15 minutes."
            );
          } else {
            showPopupMessage("Erreur de connexion", data.message || "Identifiants incorrects");
          }
        } else if (response.status === 404) {
          showPopupMessage("Service indisponible", "Service temporairement indisponible");
        } else if (response.status === 403) {
          // Erreur spécifique pour la limite de live VR
          showPopupMessage(
            "Limite atteinte",
            data.message || "Vous ne pouvez pas visionner plus de 4 live VR en simultané"
          );
        } else {
          showPopupMessage(
            `Erreur ${response.status}`,
            data.message || "Une erreur est survenue lors de la connexion"
          );
        }
        
        setIsLoading(false);
        return;
      }

      // SUCCÈS
      console.log("Connexion réussie! Données reçues:", data);
      
      if (data.message && data.message.includes("Connexion réussie")) {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        } else {
          const mockToken = `dev-token-${Date.now()}`;
          localStorage.setItem("authToken", mockToken);
          localStorage.setItem("isDevMode", "true");
        }
        
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedEmail");
        }
        
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.setItem("user", JSON.stringify({
            email: email,
            name: email.split('@')[0],
            isAuthenticated: true
          }));
        }
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("blockedUntil");
        
        // Afficher la popup de succès
        showPopupMessage("Connexion réussie", "Vous êtes maintenant connecté. Redirection en cours...");
        
        // Rediriger après 2 secondes pour laisser voir la popup
        setTimeout(() => {
          setIsLoading(false);
          closePopup();
          redirectToHome();
        }, 2000);
        
      } else {
        showPopupMessage("Erreur", "Réponse du serveur inattendue");
        setIsLoading(false);
      }

    } catch (err) {
      console.error("Erreur de connexion:", err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        showPopupMessage("Erreur réseau", "Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
      } else {
        showPopupMessage("Erreur", "Une erreur inattendue est survenue. Veuillez réessayer.");
      }
      
      setIsLoading(false);
    }
  };

  // Charger l'email sauvegardé si "Se souvenir de moi" était coché
  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe");
    const savedEmail = localStorage.getItem("savedEmail");
    
    if (savedRememberMe === "true" && savedEmail) {
      setRememberMe(true);
      setEmail(savedEmail);
    }
  }, []);

  // Vérifier si déjà connecté
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const authToken = localStorage.getItem("authToken");
    
    if (isLoggedIn === "true" && authToken) {
      console.log("Déjà connecté, redirection vers /home");
      setTimeout(() => {
        redirectToHome();
      }, 100);
    }
  }, [redirectToHome]);

  // Gestion de la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && !isBlocked) {
      handleSubmit(e);
    }
  };

  // Pour le lien "Mot de passe oublié"
  const handleForgotPassword = (e) => {
    e.preventDefault();
    showPopupMessage(
      "Mot de passe oublié",
      "Fonctionnalité de réinitialisation de mot de passe à implémenter"
    );
  };

  // Pour le lien "Créer votre compte"
  const handleSignup = (e) => {
    e.preventDefault();
    showPopupMessage(
      "Création de compte",
      "Fonctionnalité d'inscription à implémenter"
    );
  };

  return (
    <>
      <div className="login-container" onKeyPress={handleKeyPress}>
        <div className="login-card">
          {/* Logo */}
          <div className="logo-container">
            <img src="logo 1.png" alt="VR Live Logo" className="logo-image" />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="form-input"
                placeholder="votreemail@mail.com"
                disabled={isLoading || isBlocked}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="form-input"
                placeholder="••••••••••••••••"
                disabled={isLoading || isBlocked}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading || isBlocked}
              />
              <span>Se souvenir de moi</span>
            </label>
            <a href="#" className="forgot-link" onClick={handleForgotPassword}>
              Mot de passe oublié
            </a>
          </div>

          {/* Create Account Link */}
          <div className="signup-text">
            <span>Nouveau? </span>
            <a href="#" className="signup-link" onClick={handleSignup}>
              Créer votre compte
            </a>
          </div>

          {/* Submit Button */}
          <div className="button-container">
            <button 
              onClick={handleSubmit} 
              className="submit-button"
              disabled={isLoading || isBlocked || !email.trim() || !password.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  CONNEXION...
                </>
              ) : (
                <>
                  SE CONNECTER
                  <svg className="arrow-icon" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{popupTitle}</h2>
            <p className="modal-text">{popupMessage}</p>
            
            {popupTitle === "Compte bloqué" && isBlocked && (
              <div className="timer-display">
                <div className="timer">{formatTime(timer)}</div>
              </div>
            )}
            
            <button onClick={closePopup} className="modal-button">
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}