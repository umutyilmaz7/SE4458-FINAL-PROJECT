import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SearchPage() {
  const [ilanlar, setIlanlar] = useState([]); // Tüm ilanlar (database'den)
  const [filtrelenmisIlanlar, setFiltrelenmisIlanlar] = useState([]); // Filtrelenmiş ilanlar
  const [aramaPozisyon, setAramaPozisyon] = useState('');
  const [aramaSehir, setAramaSehir] = useState('');
  const [aramaIlce, setAramaIlce] = useState('');
  const [calismaTercihi, setCalismaTercihi] = useState('');

  // 🔥 MongoDB Atlas'tan ilanları getir
  useEffect(() => {
    axios.get('http://localhost:5003/api/jobs')
      .then(response => {
        setIlanlar(response.data);
        setFiltrelenmisIlanlar(response.data);
      })
      .catch(error => {
        console.error('İlanlar getirilirken hata oluştu:', error);
      });
  }, []);

  // 🔥 Filtreleri uygula
  useEffect(() => {
    let filtrelenen = ilanlar;

    if (aramaPozisyon) {
      filtrelenen = filtrelenen.filter(ilan =>
        ilan.title.toLowerCase().includes(aramaPozisyon.toLowerCase())
      );
    }
    if (aramaSehir) {
      filtrelenen = filtrelenen.filter(ilan =>
        ilan.city.toLowerCase().includes(aramaSehir.toLowerCase())
      );
    }
    if (aramaIlce) {
      filtrelenen = filtrelenen.filter(ilan =>
        ilan.town.toLowerCase().includes(aramaIlce.toLowerCase())
      );
    }
    if (calismaTercihi) {
      filtrelenen = filtrelenen.filter(ilan =>
        ilan.workPreference.toLowerCase() === calismaTercihi.toLowerCase()
      );
    }

    setFiltrelenmisIlanlar(filtrelenen);
  }, [aramaPozisyon, aramaSehir, aramaIlce, calismaTercihi, ilanlar]);

  // 🔥 Filtreleri kaldırma fonksiyonu
  const filtreyiKaldir = (filtreTuru) => {
    if (filtreTuru === 'pozisyon') setAramaPozisyon('');
    if (filtreTuru === 'sehir') setAramaSehir('');
    if (filtreTuru === 'ilce') setAramaIlce('');
    if (filtreTuru === 'calismaTercihi') setCalismaTercihi('');
  };

  return (
    <div className="container my-4">
      <div className="row">
        {/* SOL TARAF - FİLTRELER */}
        <div className="col-md-3">
          <h4>Filtreler</h4>

          {/* Pozisyon */}
          <div className="mb-3">
            <label className="form-label">Pozisyon</label>
            <input
              type="text"
              className="form-control"
              placeholder="Örn: 'Developer'"
              value={aramaPozisyon}
              onChange={(e) => setAramaPozisyon(e.target.value)}
            />
          </div>

          {/* Şehir */}
          <div className="mb-3">
            <label className="form-label">Şehir</label>
            <select
              className="form-select"
              value={aramaSehir}
              onChange={(e) => setAramaSehir(e.target.value)}
            >
              <option value="">Tümü</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="İzmir">İzmir</option>
            </select>
          </div>

          {/* İlçe */}
          <div className="mb-3">
            <label className="form-label">İlçe</label>
            <input
              type="text"
              className="form-control"
              placeholder="Örn: 'Kadıköy'"
              value={aramaIlce}
              onChange={(e) => setAramaIlce(e.target.value)}
            />
          </div>

          {/* Çalışma Tercihi */}
          <div className="mb-3">
            <label className="form-label">Çalışma Tercihi</label>
            <select
              className="form-select"
              value={calismaTercihi}
              onChange={(e) => setCalismaTercihi(e.target.value)}
            >
              <option value="">Tümü</option>
              <option value="İş Yerinde">İş Yerinde</option>
              <option value="Hibrit">Hibrit</option>
              <option value="Remote">Remote</option>
              <option value="Ofiste">Ofiste</option>
            </select>
          </div>
        </div>

        {/* SAĞ TARAF - İLANLAR */}
        <div className="col-md-9">
          <h4>Arama Sonuçları</h4>

          {/* Seçilen Filtreler (X ile kaldırılabilir) */}
          <div className="mb-3">
            {aramaPozisyon && (
              <span className="badge bg-primary me-2">
                {aramaPozisyon} <button onClick={() => filtreyiKaldir('pozisyon')} className="btn btn-sm btn-close ms-1"></button>
              </span>
            )}
            {aramaSehir && (
              <span className="badge bg-secondary me-2">
                {aramaSehir} <button onClick={() => filtreyiKaldir('sehir')} className="btn btn-sm btn-close ms-1"></button>
              </span>
            )}
            {aramaIlce && (
              <span className="badge bg-success me-2">
                {aramaIlce} <button onClick={() => filtreyiKaldir('ilce')} className="btn btn-sm btn-close ms-1"></button>
              </span>
            )}
            {calismaTercihi && (
              <span className="badge bg-danger me-2">
                {calismaTercihi} <button onClick={() => filtreyiKaldir('calismaTercihi')} className="btn btn-sm btn-close ms-1"></button>
              </span>
            )}
          </div>

          {/* İlan Listesi */}
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {filtrelenmisIlanlar.length > 0 ? (
              filtrelenmisIlanlar.map((ilan) => (
                <div className="col" key={ilan.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{ilan.title}</h5>
                      <p className="card-text">
                        <strong>Şehir:</strong> {ilan.city}<br />
                        <strong>İlçe:</strong> {ilan.town}<br />
                        <strong>Çalışma:</strong> {ilan.workPreference}
                      </p>
                      <Link to={`/job/${ilan.id}`} className="btn btn-primary">
                        Detay
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">İlan bulunamadı.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
