import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function JobDetailPage() {
  const { jobId } = useParams(); // URL'den id al
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [showAllDescription, setShowAllDescription] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const lu = localStorage.getItem('loggedUser');
    if (lu) setUser(JSON.parse(lu));
  }, []);

  useEffect(() => {
    // Seçili ilanı getir
    axios.get(`http://localhost:5003/api/jobs/${jobId}`)
      .then(response => {
        setJob(response.data);
        setEditJob(response.data); // Edit için kopya
        // 🔥 İlgili ilanları getir
        axios.get('http://localhost:5003/api/jobs')
          .then(res => {
            const allJobs = res.data;
            const related = allJobs
              .filter(j => j.id !== response.data.id && j.city === response.data.city)
              .slice(0, 3); // En fazla 3 ilan göster
            setRelatedJobs(related);
          });
      })
      .catch(() => setJob(null));
  }, [jobId]);

  if (!job) {
    return (
      <div className="container py-4">
        <h3>İlan Bulunamadı</h3>
      </div>
    );
  }

  const handleApply = () => {
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
      navigate('/login');
    } else {
      alert('Başvuru yapıldı (mock)!');
    }
  };

  const handleSave = () => {
    alert('İlan kaydedildi (mock)!');
  };

  // Türkçe karakter uyumlu küçük harf dönüştürücü
  function toTrLowerCase(str) {
    return str
      .replace(/İ/g, 'i')
      .replace(/I/g, 'ı')
      .replace(/Ş/g, 'ş')
      .replace(/Ğ/g, 'ğ')
      .replace(/Ü/g, 'ü')
      .replace(/Ö/g, 'ö')
      .replace(/Ç/g, 'ç')
      .toLowerCase();
  }

  // Sadece admin ve İzmir ilanı kontrolü
  const isAdmin =
    user &&
    user.email &&
    user.email.trim().toLowerCase() === 'admin@admin.com' &&
    job.city &&
    toTrLowerCase(job.city.trim()) === 'izmir';

  // Düzenleme formu submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5003/api/jobs/${job._id}`, editJob);
      setJob(response.data); // Güncellenen ilanı göster
      setEditMode(false);
      alert('İlan başarıyla güncellendi!');
    } catch (err) {
      alert('Güncelleme sırasında hata oluştu!');
    }
  };

  // Form alanı değişikliği
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('requirements.')) {
      const reqKey = name.split('.')[1];
      setEditJob({
        ...editJob,
        requirements: { ...editJob.requirements, [reqKey]: value }
      });
    } else {
      setEditJob({ ...editJob, [name]: value });
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* 🔵 SOL TARAF - ANA DETAYLAR */}
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="mb-0">{job.title}</h2>
              <h5 className="text-muted">{job.company}</h5>
              <div className="text-secondary">
                {job.city} ({job.town}) • {job.workPreference}
              </div>
            </div>
            {/* Butonlar */}
            <div>
              {isAdmin && (
                <button className="btn btn-warning me-2" onClick={() => setEditMode(true)}>Düzenle</button>
              )}
              <button onClick={handleApply} className="btn btn-primary me-2">Başvur</button>
              <button onClick={handleSave} className="btn btn-outline-secondary me-2">Kaydet</button>
              <button className="btn btn-light"><i className="bi bi-share" /></button>
            </div>
          </div>

          {/* Düzenleme Formu */}
          {isAdmin && editMode && (
            <form className="card p-3 mb-3" onSubmit={handleEditSubmit}>
              <h5>İlanı Düzenle</h5>
              <div className="mb-2">
                <label>Başlık</label>
                <input className="form-control" name="title" value={editJob.title} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Şirket</label>
                <input className="form-control" name="company" value={editJob.company} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Şehir</label>
                <input className="form-control" name="city" value={editJob.city} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>İlçe</label>
                <input className="form-control" name="town" value={editJob.town} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Çalışma Tercihi</label>
                <input className="form-control" name="workPreference" value={editJob.workPreference} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Pozisyon Seviyesi</label>
                <input className="form-control" name="positionLevel" value={editJob.positionLevel} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Departman</label>
                <input className="form-control" name="department" value={editJob.department} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Çalışma Tipi</label>
                <input className="form-control" name="employmentType" value={editJob.employmentType} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Açıklama</label>
                <textarea className="form-control" name="description" value={editJob.description} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Tecrübe</label>
                <input className="form-control" name="requirements.experience" value={editJob.requirements?.experience || ''} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Eğitim Seviyesi</label>
                <input className="form-control" name="requirements.educationLevel" value={editJob.requirements?.educationLevel || ''} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Askerlik Durumu</label>
                <input className="form-control" name="requirements.militaryStatus" value={editJob.requirements?.militaryStatus || ''} onChange={handleEditChange} />
              </div>
              <button className="btn btn-success me-2" type="submit">Kaydet</button>
              <button className="btn btn-secondary" type="button" onClick={() => setEditMode(false)}>İptal</button>
            </form>
          )}

          {/* Çalışma Bilgileri */}
          <div className="d-flex justify-content-between bg-light p-3 rounded mb-3">
            <div>
              <small className="text-muted">Çalışma Şekli</small><br />
              <strong>{job.employmentType}</strong>
            </div>
            <div>
              <small className="text-muted">Pozisyon Seviyesi</small><br />
              <strong>{job.positionLevel}</strong>
            </div>
            <div>
              <small className="text-muted">Departman</small><br />
              <strong>{job.department}</strong>
            </div>
            <div>
              <small className="text-muted">Başvuru Sayısı</small><br />
              <strong>{job.numberOfApplications} başvuru</strong>
            </div>
          </div>

          {/* Açıklama */}
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="card-title mb-3">{job.title}</h6>
              <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
                {showAllDescription ? job.description : job.description.split('\n').slice(0, 2).join('\n')}
              </p>
              {job.description.split('\n').length > 2 && (
                <button className="btn btn-link p-0" onClick={() => setShowAllDescription(!showAllDescription)}>
                  {showAllDescription ? 'Daha Az Göster' : 'Daha Fazla Gör'}
                </button>
              )}
            </div>
          </div>

          {/* Aday Kriterleri */}
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="card-title mb-3">Aday Kriterleri</h6>
              <p className="mb-1"><strong>Tecrübe:</strong> {job.requirements.experience}</p>
              <p className="mb-1"><strong>Eğitim Seviyesi:</strong> {job.requirements.educationLevel}</p>
              <p className="mb-1"><strong>Askerlik Durumu:</strong> {job.requirements.militaryStatus}</p>
            </div>
          </div>
        </div>

        {/* 🔵 SAĞ TARAF - İLGİNİ ÇEKEBİLECEK İLANLAR */}
        <div className="col-md-4">
          <h5 className="mb-3">İlgini Çekebilecek İlanlar</h5>
          {relatedJobs.length > 0 ? (
            relatedJobs.map(rj => (
              <div key={rj.id} className="card mb-2 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => navigate(`/job/${rj.id}`)}>
                <div className="card-body p-2">
                  <h6 className="card-title mb-1">{rj.title}</h6>
                  <small className="text-muted">{rj.company} | {rj.city} ({rj.town}) • {rj.workPreference}</small><br />
                  <small className="text-muted">{rj.lastUpdated}</small>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">Benzer ilan bulunamadı</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;
