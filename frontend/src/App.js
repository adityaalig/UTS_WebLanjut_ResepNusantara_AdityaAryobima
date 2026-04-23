import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const RecipeCard = ({ recipe }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="recipe-card">
      <div className="badge-row">
        <span className="badge badge-kat">{recipe.kategori}</span>
        <span className="badge badge-diff">{recipe.tingkat_kesulitan}</span>
      </div>
      <h3 style={{fontSize: '1.75rem', fontWeight: 800, margin: '0 0 12px 0'}}>{recipe.nama_resep}</h3>
      <p style={{fontSize: '15px', color: '#64748b', lineHeight: '1.6'}}>{recipe.deskripsi}</p>
      
      <button className="accordion-trigger" onClick={() => setIsActive(!isActive)}>
        <span>{isActive ? 'Simpan Detail' : 'Lihat Resep Lengkap'}</span>
        <span style={{color: '#10b981'}}>{isActive ? '−' : '+'}</span>
      </button>
      
      <div className={`accordion-panel ${isActive ? 'active' : ''}`}>
        <div style={{background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9'}}>
          <h4 style={{fontSize: '14px', color: '#064e3b', marginBottom: '12px'}}>Bahan Dibutuhkan:</h4>
          <ul style={{fontSize: '14px', color: '#475569', paddingLeft: '20px'}}>
            {recipe.bahan.map((b, i) => <li key={i} style={{marginBottom: '6px'}}>{b}</li>)}
          </ul>
          <h4 style={{fontSize: '14px', color: '#064e3b', marginTop: '20px', marginBottom: '12px'}}>Langkah Memasak:</h4>
          <ol style={{fontSize: '14px', color: '#475569', paddingLeft: '20px'}}>
            {recipe.langkah.map((l, i) => <li key={i} style={{marginBottom: '10px'}}>{l}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [recipes, setRecipes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [query, setQuery] = useState({ kategori: '', kesulitan: '' });
  const [form, setForm] = useState({
    nama_resep: '', deskripsi: '', kategori: 'Makanan Utama', tingkat_kesulitan: 'Mudah',
    bahan: [''], langkah: ['']
  });

  const getRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/resep', { params: query });
      setRecipes(res.data);
    } catch (e) { console.error("Error fetching data"); }
  };

  useEffect(() => { getRecipes(); }, [query]);

  const handleDynamicInput = (key, i, val) => {
    const updated = [...form[key]];
    updated[i] = val;
    setForm({...form, [key]: updated});
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (form.bahan.filter(x => x.trim()).length < 1 || form.langkah.filter(x => x.trim()).length < 1) {
      return alert("Wajib isi minimal 1 bahan & 1 langkah!");
    }
    if (window.confirm("Publikasikan resep ini sekarang?")) {
      await axios.post('http://localhost:5000/api/resep', form);
      setOpenModal(false);
      setForm({nama_resep: '', deskripsi: '', kategori: 'Makanan Utama', tingkat_kesulitan: 'Mudah', bahan: [''], langkah: ['']});
      getRecipes();
    }
  };

  return (
    <div className="container">
      <div className="hero-section">
        <h1>RESEP NUSANTARA<span style={{color: '#f59e0b'}}>.</span></h1>
        <p>Eksplorasi Kuliner Tradisional Indonesia melalui Digitalisasi UMKM</p>
      </div>

      <div className="action-bar">
        <div className="filter-group">
          <select className="filter-select" onChange={(e) => setQuery({...query, kategori: e.target.value})}>
            <option value="">Semua Kategori</option>
            <option value="Makanan Utama">Makanan Utama</option>
            <option value="Camilan">Camilan</option>
            <option value="Minuman">Minuman</option>
          </select>
          <select className="filter-select" onChange={(e) => setQuery({...query, kesulitan: e.target.value})}>
            <option value="">Semua Tingkat</option>
            <option value="Mudah">Mudah</option>
            <option value="Sedang">Sedang</option>
            <option value="Sulit">Sulit</option>
          </select>
        </div>
        <button className="btn-add" onClick={() => setOpenModal(true)}>+ Tambah Resep</button>
      </div>

      <div className="recipe-grid">
        {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
      </div>

      {openModal && (
        <div className="modal-backdrop">
          <form className="modal-box" onSubmit={handlePost}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
              <h2 style={{margin:0, fontWeight:800}}>Tambah Karya Kuliner</h2>
              <button type="button" onClick={() => setOpenModal(false)} style={{background:'none', border:'none', fontSize:'24px', cursor:'pointer'}}>✕</button>
            </div>

            <div className="field-group">
              <label>Nama Masakan</label>
              <input required placeholder="Contoh: Sate Maranggi" onChange={e => setForm({...form, nama_resep: e.target.value})} />
            </div>

            <div className="field-group">
              <label>Bahan</label>
              {form.bahan.map((b, i) => (
                <div key={i} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                  <input required placeholder="Nama bahan..." value={b} onChange={e => handleDynamicInput('bahan', i, e.target.value)} />
                  {form.bahan.length > 1 && <button type="button" onClick={() => setForm({...form, bahan: form.bahan.filter((_, idx) => idx !== i)})} style={{padding:'10px', background:'#fee2e2', border:'none', borderRadius:'10px', cursor:'pointer'}}>✕</button>}
                </div>
              ))}
              <button type="button" onClick={() => setForm({...form, bahan: [...form.bahan, '']})} style={{background:'none', border:'none', color:'#10b981', fontWeight:700, cursor:'pointer'}}>+ Tambah Bahan</button>
            </div>

            <div className="field-group" style={{marginTop:'25px'}}>
              <label>Langkah Memasak</label>
              {form.langkah.map((l, i) => (
                <div key={i} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                  <input required placeholder="Instruksi..." value={l} onChange={e => handleDynamicInput('langkah', i, e.target.value)} />
                  {form.langkah.length > 1 && <button type="button" onClick={() => setForm({...form, langkah: form.langkah.filter((_, idx) => idx !== i)})} style={{padding:'10px', background:'#fee2e2', border:'none', borderRadius:'10px', cursor:'pointer'}}>✕</button>}
                </div>
              ))}
              <button type="button" onClick={() => setForm({...form, langkah: [...form.langkah, '']})} style={{background:'none', border:'none', color:'#10b981', fontWeight:700, cursor:'pointer'}}>+ Tambah Langkah</button>
            </div>

            <button type="submit" className="btn-add" style={{width:'100%', marginTop:'30px'}}>Simpan ke Galeri Resep</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;