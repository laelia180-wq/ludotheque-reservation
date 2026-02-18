import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

// --- CONFIGURATION ---
const ADHERENT_CODE = "LUDO2026"; // Change ce code pour tes adhérents
const EMAILJS_SERVICE_ID = "service_evl28dp";
const EMAILJS_TEMPLATE_ID = "TON_TEMPLATE_ID_ICI"; 
const EMAILJS_PUBLIC_KEY = "TA_PUBLIC_KEY_ICI";
// ---------------------

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [formData, setFormData] = useState({
    nom: '', email: '', jeu: '', dateDebut: '', dateFin: ''
  });
  const [status, setStatus] = useState("");

  // Vérification de l'adhérent
  const handleAuth = (e) => {
    e.preventDefault();
    if (authCode.toUpperCase() === ADHERENT_CODE) {
      setIsAuth(true);
    } else {
      alert("Code erroné. Réservé aux adhérents PEP.");
    }
  };

  // Envoi du mail via EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérification de la durée (Max 31 jours)
    const debut = new Date(formData.dateDebut);
    const fin = new Date(formData.dateFin);
    const diffTemps = fin - debut;
    const diffJours = diffTemps / (1000 * 60 * 60 * 24);

    if (diffJours < 0) return alert("La date de retour doit être après le début !");
    if (diffJours > 31) return alert("La durée maximale est de 31 jours.");

    setStatus("Envoi en cours...");

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setStatus("Succès ! Votre demande est envoyée.");
        setFormData({ nom: '', email: '', jeu: '', dateDebut: '', dateFin: '' });
      })
      .catch((err) => {
        setStatus("Erreur lors de l'envoi. Réessayez.");
        console.error(err);
      });
  };

  // Écran de connexion Adhérent
  if (!isAuth) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Espace Réservation Ludothèque</h2>
        <p>Veuillez entrer le code adhérent fourni par les PEP :</p>
        <form onSubmit={handleAuth}>
          <input 
            type="text" 
            placeholder="Code d'accès"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', cursor: 'pointer' }}>Valider</button>
        </form>
      </div>
    );
  }

  // Formulaire de réservation
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>Réserver un jeu</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Nom complet" required 
          onChange={e => setFormData({...formData, nom: e.target.value})} />
        
        <input type="email" placeholder="Votre email" required 
          onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <input type="text" placeholder="Nom du jeu souhaité" required 
          onChange={e => setFormData({...formData, jeu: e.target.value})} />
        
        <div>
          <label>Date de début :</label>
          <input type="date" required style={{ width: '100%' }}
            onChange={e => setFormData({...formData, dateDebut: e.target.value})} />
        </div>

        <div>
          <label>Date de retour :</label>
          <input type="date" required style={{ width: '100%' }}
            onChange={e => setFormData({...formData, dateFin: e.target.value})} />
        </div>

        <button type="submit" style={{ background: '#007bff', color: 'white', padding: '15px', border: 'none', borderRadius: '5px' }}>
          Confirmer la réservation
        </button>
        
        {status && <p style={{ fontWeight: 'bold' }}>{status}</p>}
      </form>
    </div>
  );
}
