import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Türkçe karakter uyumlu küçük harf dönüştürücü
function toTrLowerCase(str) {
  return str
    .replace(/Ğ/g, 'ğ')
    .replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase();
}

function HomePage() {
  const [language, setLanguage] = useState('TR');

  // Arama inputları (autocomplete + text)
  const [position, setPosition] = useState('');
  const [searchCity, setSearchCity] = useState('');

  // Dropdown görünür mü?
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // "Ara" butonuna basıldı mı?
  const [hasSearched, setHasSearched] = useState(false);

  // Arama sonuçları
  const [searchedJobs, setSearchedJobs] = useState([]);
  const [jobs, setJobs] = useState([]); // MongoDB'den çekilecek iş ilanları

  // MongoDB'den ilanları çekme
  useEffect(() => {
    axios.get('http://localhost:5003/api/jobs') // Backend'den veri çekiyoruz (5003 portu)
      .then(response => setJobs(response.data))
      .catch(error => console.error('Veri çekme hatası:', error));
  }, []);

  // Autocomplete için konfig:
  const positionList = [
    'Yazılım Uzmanı',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Project Manager'
  ];
  const cityList = [
    'İstanbul',
    'İstanbul(Avr.)',
    'İstanbul(Asya)',
    'Ankara',
    'İzmir'
  ];

  // Filtreli autocomplete verileri
  const filteredPositionList = positionList.filter((p) =>
    toTrLowerCase(p).includes(toTrLowerCase(position))
  );
  const filteredCityList = cityList.filter((c) =>
    toTrLowerCase(c).includes(toTrLowerCase(searchCity))
  );

  // Anasayfa "default" 5 ilan (mevcut şehirde + 5 den fazla varsa, yoksa tüm liste)
  const cityJobs = jobs.filter((job) => toTrLowerCase(job.city).includes('istanbul'));
  const defaultJobs = cityJobs.length >= 5 ? cityJobs.slice(0, 5) : jobs.slice(0, 5);

  // Dil değiştir
  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'TR' ? 'EN' : 'TR'));
  };

  // Arama butonu: Pozisyona veya şehre kısmi eşleşme (includes)
  const handleSearch = () => {
    setHasSearched(true);

    // Kullanıcının girdiği metinler (kısmi arama)
    const matched = jobs.filter((job) => {
      // Pozisyon araması
      if (position) {
        const jobTitleLower = toTrLowerCase(job.title);
        const positionLower = toTrLowerCase(position);
        if (!jobTitleLower.includes(positionLower)) {
          return false;
        }
      }
      // Şehir araması
      if (searchCity) {
        const jobCityLower = toTrLowerCase(job.city);
        const searchCityLower = toTrLowerCase(searchCity);
        if (!jobCityLower.includes(searchCityLower)) {
          return false;
        }
      }
      return true;
    });

    setSearchedJobs(matched);
  };

  // Gösterilecek ilanlar: arama yapıldıysa searchedJobs, yoksa default
  const jobsToDisplay = hasSearched ? searchedJobs : defaultJobs;

  // Dropdown seçim fonksiyonları
  const handleSelectPosition = (p) => {
    setPosition(p);
    setShowPositionDropdown(false);
  };
  const handleSelectCity = (c) => {
    setSearchCity(c);
    setShowCityDropdown(false);
  };

  return (
    <>
      {/* Üst Mavi Alan */}
      <div className="py-5" style={{ backgroundColor: '#007BFF' }}>
        <div className="container text-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold">
              {language === 'TR' ? 'Kariyer Fırsatlarını Keşfet' : 'Discover Career Opportunities'}
            </h1>
            <button onClick={handleLanguageToggle} className="btn btn-light">
              {language === 'TR' ? 'Switch to EN' : 'Türkçe\'ye Geç'}
            </button>
          </div>

          {/* Pozisyon & Şehir input */}
          <div className="row g-2 position-relative">
            {/* POZİSYON */}
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder={language === 'TR' ? 'Pozisyon Ara...' : 'Search Position...'}
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value);
                  setShowPositionDropdown(true);
                }}
              />
              {position && showPositionDropdown && (
                <div className="bg-white border position-absolute w-100 text-dark" style={{ zIndex: 999 }}>
                  {filteredPositionList.map((item, idx) => (
                    <div key={idx} className="px-2 py-1" style={{ cursor: 'pointer' }} onClick={() => handleSelectPosition(item)}>
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ŞEHİR */}
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder={language === 'TR' ? 'Şehir Ara...' : 'Search City...'}
                value={searchCity}
                onChange={(e) => {
                  setSearchCity(e.target.value);
                  setShowCityDropdown(true);
                }}
              />
              {searchCity && showCityDropdown && (
                <div className="bg-white border position-absolute w-100 text-dark" style={{ zIndex: 999 }}>
                  {filteredCityList.map((city, idx) => (
                    <div key={idx} className="px-2 py-1" style={{ cursor: 'pointer' }} onClick={() => handleSelectCity(city)}>
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ARA BUTONU */}
            <div className="col-md-2">
              <button onClick={handleSearch} className="btn btn-dark w-100">
                {language === 'TR' ? 'Ara' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Bölüm - İlan Listesi */}
      <div className="container my-5">
        <h2 className="mb-4">{hasSearched ? (language === 'TR' ? 'Arama Sonuçları' : 'Search Results') : (language === 'TR' ? 'Öne Çıkan İlanlar' : 'Featured Jobs')}</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {jobsToDisplay.map((job) => (
            <div className="col" key={job.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <p className="card-text"><strong>{language === 'TR' ? 'Şehir:' : 'City:'}</strong> {job.city}</p>
                  <Link to={`/job/${job.id}`} className="btn btn-primary">{language === 'TR' ? 'Detay' : 'Details'}</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;
