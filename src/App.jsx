import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

// --- CONFIGURATION (À remplir avec tes infos EmailJS) ---
const ADHERENT_CODE = "LUDO2026"; 
const EMAILJS_SERVICE_ID = "service_evl28dp";
const EMAILJS_TEMPLATE_ID = "TON_TEMPLATE_ID"; 
const EMAILJS_PUBLIC_KEY = "TA_PUBLIC_KEY";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [formData, setFormData] = useState({
    nom: '', email: '', jeu: '', dateDebut: '', dateFin: ''
  });
  const [status, setStatus] = useState("");

  const handleAuth = (e) => {
    e.preventDefault();
    if (authCode.toUpperCase() === ADHERENT_CODE) {
      setIsAuth(true);
    } else {
      alert("Code erroné. Réservé aux adhérents PEP.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const debut = new Date(formData.dateDebut);
    const fin = new Date(formData.dateFin);
    const diffJours = (fin - debut) / (1000 * 60 * 60 * 24);

    if (diffJours < 0) return alert("La date de retour doit être après le début !");
    if (diffJours > 31) return alert("La durée maximale est de 31 jours.");

    setStatus("Chargement...");

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setStatus("success");
        setFormData({ nom: '', email: '', jeu: '', dateDebut: '', dateFin: '' });
      })
      .catch(() => setStatus("error"));
  };

  // Styles communs
  const cardStyle = {
    maxWidth: '450px', margin: '40px auto', padding: '30px',
    borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff', fontFamily: '"Segoe UI", Roboto, sans-serif',
    color: '#333'
  };

  const inputStyle = {
    width: '100%', padding: '12px', marginBottom: '15px',
    borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
    backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold',
    fontSize: '16px', cursor: 'pointer', transition: 'background 0.3s'
  };

  // ÉCRAN CONNEXION
  if (!isAuth) {
    return (
      <div style={cardStyle}>
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
            <h2 style={{margin: '0 0 10px 0', color: '#1e40af'}}>Accès Adhérent</h2>
            <p style={{color: '#666', fontSize: '14px'}}>Veuillez saisir le code pour réserver vos jeux.</p>
        </div>
        <form onSubmit={handleAuth}>
          <input 
            type="text" placeholder="Entrez le code" style={inputStyle}
            onChange={(e) => setAuthCode(e.target.value)}
          />
          <button type="submit" style={buttonStyle}>Accéder au catalogue</button>
        </form>
      </div>
    );
  }

  // ÉCRAN RÉSERVATION
  return (
    <div style={cardStyle}>
      <h2 style={{marginTop: 0, color: '#1e40af', textAlign: 'center'}}>Réserver un jeu</h2>
      <p style={{textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '25px'}}>
        Durée maximum : 31 jours
      </p>

      <form onSubmit={handleSubmit}>
        <label style={{fontSize: '14px', fontWeight: '600'}}>Nom & Prénom</label>
        <input type="text" placeholder="Ex: Jean Dupont" required style={inputStyle}
          onChange={e => setFormData({...formData, nom: e.target.value})} />
        
        <label style={{fontSize: '14px', fontWeight: '600'}}>Email</label>
        <input type="email" placeholder="votre@email.com" required style={inputStyle}
          onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <label style={{fontSize: '14px', fontWeight: '600'}}>Nom du jeu</label>
        <input type="text" placeholder="Ex: Catan, Dixit..." required style={inputStyle}
          onChange={e => setFormData({...formData, jeu: e.target.value})} />
        
        <div style={{display: 'flex', gap: '10px'}}>
            <div style={{flex: 1}}>
                <label style={{fontSize: '12px', fontWeight: '600'}}>Début</label>
                <input type="date" required style={inputStyle}
                    onChange={e => setFormData({...formData, dateDebut: e.target.value})} />
            </div>
            <div style={{flex: 1}}>
                <label style={{fontSize: '12px', fontWeight: '600'}}>Retour</label>
                <input type="date" required style={inputStyle}
                    onChange={e => setFormData({...formData, dateFin: e.target.value})} />
            </div>
        </div>

        <button type="submit" style={buttonStyle}>
            {status === "Chargement..." ? "Envoi..." : "Envoyer la demande"}
        </button>
        
        {status === "success" && (
            <p style={{color: '#059669', textAlign: 'center', marginTop: '15px', fontWeight: '500'}}>
                ✅ Demande envoyée avec succès !
            </p>
        )}
        {status === "error" && (
            <p style={{color: '#dc2626', textAlign: 'center', marginTop: '15px'}}>
                ❌ Erreur d'envoi. Vérifiez vos paramètres.
            </p>
        )}
      </form>
    </div>
  );
}
