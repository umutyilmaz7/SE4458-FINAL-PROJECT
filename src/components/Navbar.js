// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const lu = localStorage.getItem('loggedUser');
      if (lu) {
        setUser(JSON.parse(lu));
      } else {
        setUser(null);
      }
    };

    window.addEventListener('userChanged', handleStorageChange);
    handleStorageChange();
    return () => {
      window.removeEventListener('userChanged', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    window.dispatchEvent(new Event('userChanged'));
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        {/* Burada isim "HASkariyer.net" olarak değişti */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
          kariyer.net
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/search">
              İlan Ara
            </Link>
            
            {!user && (
              <div className="ms-3">
                <Link to="/login" className="btn btn-outline-primary btn-sm me-2">
                  Giriş
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Kayıt Ol
                </Link>
              </div>
            )}
            
            {user && (
              <div className="d-flex align-items-center ms-3">
                <img
                  src={user.photo || 'https://via.placeholder.com/30'}
                  alt="User"
                  className="rounded-circle me-2"
                  style={{ width: 30, height: 30 }}
                />
                <span className="me-3">{user.email}</span>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                  Çıkış
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
