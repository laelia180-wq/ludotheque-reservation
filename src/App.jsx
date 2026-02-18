import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

// --- CONFIGURATION À REMPLIR ---
const ADHERENT_CODE = "LUDO2026"; 
const EMAILJS_SERVICE_ID = "service_evl28dp";
const EMAILJS_TEMPLATE_ID = "TON_TEMPLATE_ID"; // Trouvé sur emailjs.com
const EMAILJS_PUBLIC_KEY = "TA_PUBLIC_KEY";   // Trouvé dans Account > Public Key
// -------------------------------

const JEUX_DISPONIBLES = [
  { id: 1, nom: "Catan", categorie: "Stratégie" },
  { id: 2, nom: "Dixit", categorie: "Famille" },
  { id: 3, nom: "7 Wonders", categorie: "Stratégie" },
  { id: 4, nom: "Dobble", categorie: "Ambiance" },
  { id: 5, nom: "Pandemic", categorie: "Coopératif" },
  { id: 6, nom: "Azul", categorie: "Réflexion" }
];

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [jeuSelectionne, setJeuSelectionne] = useState(null);
  const [formData, setFormData] = useState({ nom: '', email: '', dateDebut: '', dateFin: '' });
  const [status, setStatus] = useState(null);

  // Couleurs PEP
  const colors = { primary: '#E30613', secondary: '#0055A4', light: '#f8f9fa' };

  const handleAuth = (e) => {
    e.preventDefault();
    if (authCode.toUpperCase() === ADHERENT_CODE) setIsAuth(true);
    else alert("Code erroné. Réservé aux adhérents.");
  };

  const handleReservation = (e) => {
    e.preventDefault();
    const debut = new Date(formData.dateDebut);
    const fin = new Date(formData.dateFin);
    const diffJours = (fin - debut) / (1000 * 60 * 60 * 24);

    if (diffJours < 0) return alert("Le retour doit être après le début.");
    if (diffJours > 31) return alert("Durée maximum : 31 jours.");

    const fullData = { ...formData, jeu: jeuSelectionne.nom };
    setStatus("envoi");

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, fullData, EMAILJS_PUBLIC_KEY)
      .then(() => setStatus("succes"))
      .catch(() => setStatus("erreur"));
  };

  // 1. ÉCRAN CONNEXION (Sécurité)
  if (!isAuth) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ color: colors.secondary }}>Espace Adhérents PEP</h2>
        <div style={{ maxWidth: '300px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
          <input type="text" placeholder="Code d'accès" value={authCode} 
            onChange={e => setAuthCode(e.target.value)} 
            style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <button onClick={handleAuth} style={{ width: '100%', padding: '10px', background: colors.primary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Entrer</button>
        </div>
      </div>
    );
  }

  // 2. INTERFACE PRINCIPALE
  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: colors.primary, margin: 0 }}>Ma Ludothèque PEP</h1>
        <p style={{ color: colors.secondary }}>Réservez vos jeux en ligne (Max 31 jours)</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        
        {/* LISTE DES JEUX */}
        <div>
          <h3>1. Choisir un jeu</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {JEUX_DISPONIBLES.map(jeu => (
              <div key={jeu.id} 
                onClick={() => setJeuSelectionne(jeu)}
                style={{ 
                  padding: '15px', border: '2px solid', borderRadius: '8px', cursor: 'pointer',
                  borderColor: jeuSelectionne?.id === jeu.id ? colors.primary : '#eee',
                  backgroundColor: jeuSelectionne?.id === jeu.id ? '#fff5f5' : 'white'
                }}>
                <strong>{jeu.nom}</strong> <br/>
                <small style={{ color: '#666' }}>{jeu.categorie}</small>
              </div>
            ))}
          </div>
        </div>

        {/* CALENDRIER ET FORMULAIRE */}
        <div>
          <h3>2. Vos informations</h3>
          {jeuSelectionne ? (
            <form onSubmit={handleReservation} style={{ background: colors.light, padding: '20px', borderRadius: '10px' }}>
              <p>Jeu sélectionné : <strong>{jeuSelectionne.nom}</strong></p>
              
              <label>Votre Nom</label>
              <input type="text" required style={inputStyle} onChange={e => setFormData({...formData, nom: e.target.value})} />
              
              <label>Email</label>
              <input type="email" required style={inputStyle} onChange={e => setFormData({...formData, email: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Début</label>
                  <input type="date" required style={inputStyle} onChange={e => setFormData({...formData, dateDebut: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Retour</label>
                  <input type="date" required style={inputStyle} onChange={e => setFormData({...formData, dateFin: e.target.value})} />
                </div>
              </div>

              <button type="submit" style={{ ...buttonStyle, background: colors.secondary }}>
                {status === "envoi" ? "Envoi..." : "Confirmer la réservation"}
              </button>

              {status === "succes" && <p style={{ color: 'green', textAlign: 'center' }}>✅ Réservation envoyée !</p>}
              {status === "erreur" && <p style={{ color: 'red', textAlign: 'center' }}>❌ Erreur. Vérifiez vos clés EmailJS.</p>}
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', border: '2px dashed #ccc', borderRadius: '10px', color: '#666' }}>
              Sélectionnez un jeu à gauche pour voir le calendrier
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', display: 'block' };
const buttonStyle = { width: '100%', padding: '15px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };
