// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import VRLiveLogin from './login/login';
import HomePage from './home/home';
import ProtectedRoute from "./protection/ProtectedRoute";

// Composant pour la redirection racine
function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
}

function AppContent() {
  return (
    <Routes>
      {/* Route racine - redirige selon l'état d'authentification */}
      <Route path="/" element={<RootRedirect />} />
      
      {/* Page de login */}
      <Route path="/" element={<VRLiveLogin />} />
      
      {/* Routes protégées */}
      <Route
        path="/home"
        element={
          // <ProtectedRoute>
            <HomePage />
          // </ProtectedRoute>
        }
      />
      
      {/* Route pour les pages non trouvées */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;