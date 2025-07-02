import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5003/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); // JWT Token'ı sakla
      localStorage.setItem('loggedUser', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('userChanged'));
      alert('Giriş başarılı!');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Giriş hatası');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Giriş Yap</h2>
          <form onSubmit={handleSubmit} className="card p-3">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Şifre</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary">Giriş</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
