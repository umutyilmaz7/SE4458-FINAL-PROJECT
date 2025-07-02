import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Türkiye');
  const [city, setCity] = useState('');
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setPhoto(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5003/api/auth/register', {
        email,
        password,
        country,
        city,
        photo
      });

      alert(response.data.message);
      navigate('/login'); // Başarıyla kayıt olunca login sayfasına yönlendir
    } catch (error) {
      alert(error.response?.data?.message || "Kayıt sırasında hata oluştu.");
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Kayıt Ol</h2>
          <form onSubmit={handleSubmit} className="card p-3">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Şifre</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <small className="text-muted">En az 8 karakter, 1 sayı ve 1 özel karakter içermelidir.</small>
            </div>
            <div className="mb-3">
              <label className="form-label">Ülke</label>
              <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Şehir</label>
              <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Fotoğraf (opsiyonel)</label>
              <input type="text" className="form-control" accept="image/*" onChange={handlePhotoChange} />
            </div>
            <button className="btn btn-primary">Kayıt Ol</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
