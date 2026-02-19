import { useState, useEffect } from "react";

// ==================== CONFIGURATION SUPABASE ====================
const SUPABASE_URL = "https://yaxreebfvmmqahmtdunf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheHJlZWJmdm1tcWFobXRkdW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDE5MzUsImV4cCI6MjA4NzA3NzkzNX0.R_t1CVaYsA9Uz_l-qMwH6O7V17P5n5hIGBlBlitegLg";

async function supabaseFetch(path, options = {}) {
  const res = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

async function getReservations() {
  return supabaseFetch("reservations?select=*&order=created.desc");
}

async function insertReservation(data) {
  return supabaseFetch("reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function deleteReservation(code) {
  return supabaseFetch("reservations?code=eq." + code, {
    method: "DELETE",
    prefer: "return=minimal",
  });
}
// ================================================================

const LOGO = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/wAARCAXcBdwDASIAAhEBAxEB/8QAHQABAAEFAQEBAAAAAAAAAAAAAAcDBAUGCAIBCf/EAFUQAAIBAwIDBAYGBwYFAQYBDQABAgMEBQYREiExB0FRYRMiMnGBkQgUQqGxwRUjM1JictGCkrLC4fAWJENTonMXJTREY9LxJoOjdBg1NkVUZJPD4v/EABwBAQABBQEBAAAAAAAAAAAAAAAFAQIDBAYHCP/EAD0RAQACAQIEAwYFAwIGAgMBAQABAgMEEQUSITEGQVETImFxkdEygaGxwRTh8CNCFTNDUmLxFnIkNIJTov/aAAwDAQACEQMRAD8A7LAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHivWo0IcdarTpR8ZySX3mMuNS6fobqpmrBNdVGvGT+SMd82PH+O0R85ZKYcmT8FZn5QywNar684rS3Tyim/CFGb+/h2LZ9oumN//ia7/wDzEjVtxPR175a/WG1Xhmst2xW+ktuBrFDX2larS/STpt/v0Zr79jL2Gcw9+0rPJ2laT+zGquL5dTLj1unyztTJE/KYYsmi1GKN744j5xLIAA2WsAAAAAAB8nLghKWzey32XVgfQRDkO0/M1asvqdpaW1Pf1eKLnL4vdL7ixfaJqh9LqgvdQic7fxPoaztG8/l95h0VPDGutG87R+f2iU2AhWHaNqaL51raXvoL8i5pdp2oIe3b4+ovOnJP7pCvifQz33j8v7lvDGujttP5/wBkwgiqh2qXqf67E281/BVcfxTMjb9qljLb6xibin4+jqxn+KRuU8QcPv8A9Tb5xP2a9/D/ABCn/T3+Ux90iA0217SdNVtvSSu7f/1KO/8AhbMra6w0zc7ejzNtHf8A7jdP/EkbuPiWkyfhy1+sNLJw3V4/xYrfSWdBQtb2zu1va3dCuvGnUUvwK5uVtFo3iWnas1naYAAVUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANQ1B2g4PGVJ0KDnf14vZqjtwJ+Dk/wAtzbpxU4ShJbqS2ZBOs9J32nrmU3GVaxlLalXS+Sl4P8SD45rNVpMMX09ennPfZOcD0el1eaaai3XyjtuzGS7Ts1X3jZW1raRfRtOpJfF8vuNevtVaivd/T5i72fVU5+jXyjsYYHB5uJ6vP+PJP12j6Q7zDwzSYPwY4+m8/Wer1VqVKs3OrUnUk+rk92eQDRmd29EbK9hZXd/cxtrK2q3FaXSFOO728fcZa70dqa1oOtVxFfgS3fA4za+EW2b52JWtKOEvb3hXpalz6Jy7+GMYtL5yZIB13DfDeLU6auXJeYm3ps5HiXiTLptTbFjpExX13czNNNprZoEu9pukKN/Z1cvjqKhe0k5VYQX7aK6vb95ff8iIiA4jw7JoMvs79Y8p9U/w3iOPX4vaU6T5x6M5hNWZ7ESira/qTpL/AKVZ8cNvDZ9PhsSPpXtDx2TlC1yUVYXUuSk3+qm/J/Z+PzIcBm0PGdVo5jltvX0nt/Zh13BtLrInmrtb1jv/AHdMgiHs81vVxtSni8tVc7F+rTqy5uj4f2fwJei1JJppp8013noPDuI4tfi58feO8ejz7iPDsugy8l+09p9QAEgjwAAQ/wBqmyli7v8AS1jDazuJ7VIL/pVHz+T+5/A0Yn7XlGnX0dlIVFulbymvfH1l96RAJ5v4i0VNLqt8fSLRvt8fN6R4d1t9VpdsnWaztv8ADyAAQKeC+w+IyWXrSpY2zq3Eo+1wrZR97fJFidAaLxNPDactLSMFGo4KpWe3Nza3e/u6e5Evwbhf/EMs1tO1Y7ojjPFP+H4otWN7T2RBX0Tqmit54iq/5Jwn+DZjbvCZi0i5XOKvaMV1lOhJL57bHRQOkv4T08/gyTHz2n7Obp4s1EfjxxPy3j7uZotxkpRbTXRoy2P1Nn7Br6tlrqKXSMp8cflLdEidqGk7a5x1XM4+3jTuqC464YLZVYd718V138N/IiU5fW6TUcLz8nNt5xMdN3UaLV6fieDn5d/KYnrsmHs51pWzleeNyUKcbuMOOnUgtlUS6pruffy/I3ggvsvclrrHcO/N1N/d6OROh23h7WZdVpObLO8xO2/5RP8ALifEOjxaXV8uKNomN9vrH8AAJ1BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSu7ehd21S2uaUatGrFxnCS5NFUFJiJjaVYmYneHPWrMV+hdQ3eOTcoU5700++DW8fuZizee2mh6PU9vWS5VbWO/vUpL8NjRjyfiOCNPqsmOvaJnb5PWOHZ51Glx5Ld5iN/mAA0m6lnsRrcWDvqG/sXKn/eil/lJAIt7Dq+13lLff26dOa+Dkv8xKR6dwC/Pw/H8N4/WXmPH6cnEMnx2n9ICCO0TDrDaouKNKHDb1v11FLooy6r4NNe7Incj7tssFVxNnkYx9ahVdOT/hkt/xj95g8R6WM+jm/nXr9/8APgz+HNVODWRTyt0+3+fFE4APOHo4S12Q6hle2U8Ld1HKvbR4qDfWVPpt8H9zXgRKZPS2SliNQWd+pNRp1V6Tzg+Ul8myS4Trp0eprffpPSfl/bujeLaGNZprU26x1j5/37OhgE01unumD1R5WAADXu0it6DROSnvzlTjD+9JL8yByZ+2Kt6LR/Bv+2uYQ/GX+Uhg8+8U35tZFfSsfvL0HwtTl0c29bT+0AAOadKucVQ+s5S0tmt/S1oQ298kjpAgDQlH0+sMVDbfa4jP+7635E/nc+EqbYcl/WYj6R/dw3i2++XHT0iZ+s/2AYPWOo7XTmOVxWj6WvUbjRop7Ob72/BLvZh9C64eoMhPH3VnC3rcDnTlCTcZJdVs+j/1OgycR02PPGntb358nP4+HanJp51Fa+5Hm3OcYzhKE4qUZLZp9GjnXUNg8ZnLywe+1CtKMd++O/qv5bHRZGnappTIXuUhlsXbSuPSQUK8Ie0pLkpbd622XwIjxLorajT1vjjeaz+k/wCQl/DWtrp9RamSdotH6x/ksD2QUHW1lColuqFCpNvw3Sj/AJiaTSOyvTN3hba4vcjT9Fc3CUY0293CC58/Nvu8kbubPh/S302iiLxtMzM7f58mt4g1VNTrZmk7xERG/wDnzAATaEADVO0XVP8Aw9YQo2vDK/uE/R7rdU498mvw/wBDBqdTj02KcuSdohn02myanLGLHG8yymodSYjBU97+6SqNbxow9apL4d3veyNHyXapU43HHYqKj3SuJ7t/2Y9PmRzdV611cTuLirOrVqPinOb3bZTOD1niXVZbTGL3I+s/X7O80fhrS4qx7X35+kfT7t1n2m6ilLeNKwgvBUpfnIr27JyxS2fNKI2Tn7HdVyqKntVubnR4dWJf1aVW3VVL+jLk1+Pzoa1qbCqy2XwjpjMxR6Mv08+qqFZaeoY3dajM0dS6PqpuMtqMlua8eSfVm16TsOGrmpSJt5bfGXSY4TyN7V4qzuiJXwAK2ugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8V6tKhTlVrVIU6cVu5Sk1FfFge90J01N7Yf1O+mXXepYVoS+9Jf4Ee4PExcuvbWe1Hn7fHyN5NxVoqN7d3L14qkKEOCjSXRd78d+8mrS2ksZiV9Hh7Shb0+cpS3cvOct/iQdLo1vKCb0/FGfNxjUaue02n9I+H+ZAArW0GX0frXN6UueXF35bePsXNXhkn/F/D/AC+R0vprtHxOrHRta0VYXm21Crl6Ka8eHvXwIn+jHjfpe0nV4mfRXiTXgpdfky3KNOdJ8Mddt9mJwtXpamX3sE7a+HXb8uo+yf2A1Lk47CXs1LZKjbycvhxQcvkXVa4hfW6uaBq9pFuFhBVJJctpPnH7yh+nNdaM0bpfJYnTWErYDISr0XStq9lQdGorS5vi9eKlFpPfjsttzZCMG9A3WT09Y5fHaqq28J4y2w9epKzipKfFsouSl12bW3g+QHbpHTm6K1Hb39aVOlXilHiqUoxjOnKlLbl1fKLK4h1Z2cZHAtxVXIupLvaozmpR8llWdyiCdO9lmW0NnqE66ksddy3tbn7O/wBlx8F8eTW/PxJBAVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//2Q==";

const JEUX = {
  "Jeux de strategie": ["Awale","Dames","Echecs tactiles","Four Senses","Quarto Access","Rush Hour","Solitaire","Sudoku"],
  "Jeux de cartes": ["7 Familles Braille","Jeu de 32 cartes Braille","Jeu de 54 cartes Braille","Mille Bornes Braille","MOW Access","UNO Braille"],
  "Jeux sensoriels": ["Barres Tactiles","Memory tactile tissu","Memory sons","Tactilo Loto","Le Toucher Montessori","Little Memo","Loto des 40"],
  "Jeux cooperatifs": ["Little Cooperation","Hop Hop Hop"],
  "Jeux d adresse": ["Mikado a disques","SOS Ouistiti","Tour tombante","Pic Pirate"],
  "Puzzles Construction": ["Jeu du Cafard","Legos Braille","Puzzle Arc en Ciel","Puzzle Coeur","Il etait une ferme","Rubiks Cube tactile"],
  "Autres jeux": ["Bata Waf","Bogoss","Branle Bas de Wombat","Croque Carotte","Cuisto Dingo","La Course des Tortues","Le Renard des Bois","Les Petites Souris","Morpion maison","Perlinpinpin","Petits Chevaux","Puissance 4 modifie","Tic Tac Boum Junior","Woolfy","Yams"]
};

const COULEURS = ["#1f94a2","#6dbd69","#e67e22","#8e44ad","#2980b9","#c0392b","#1f94a2","#6dbd69","#e67e22","#8e44ad"];
const MOIS = ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];
const JOURS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const today = new Date(); today.setHours(0,0,0,0);
const todayStr = today.toISOString().split("T")[0];
const C = "#1f94a2";

function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getMonthDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];
  let dow = first.getDay(); if (dow === 0) dow = 7;
  for (let i = 1; i < dow; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

function isBetween(date, start, end) {
  const d = new Date(date); d.setHours(0,0,0,0);
  const s = new Date(start); s.setHours(0,0,0,0);
  const e = new Date(end); e.setHours(0,0,0,0);
  return d >= s && d <= e;
}

function chevauchement(r, dateDebut, dateFin) {
  const s1 = new Date(r.date_retrait); s1.setHours(0,0,0,0);
  const e1 = new Date(r.date_retour); e1.setHours(0,0,0,0);
  const s2 = new Date(dateDebut); s2.setHours(0,0,0,0);
  const e2 = new Date(dateFin); e2.setHours(0,0,0,0);
  return s1 <= e2 && e1 >= s2;
}

function jeuColor(jeu) {
  const all = Object.values(JEUX).flat();
  const idx = all.indexOf(jeu);
  return COULEURS[Math.max(0, idx) % COULEURS.length];
}

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function genCode() {
  return "RES-" + Math.floor(1000 + Math.random() * 9000);
}

export default function App() {
  const [view, setView] = useState("calendrier");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [form, setForm] = useState({ prenom:"", nom:"", email:"", telephone:"", jeu:"", date_retrait:"", date_retour:"", adhesion:"", commentaire:"" });
  const [submitted, setSubmitted] = useState(false);
  const [submittedCode, setSubmittedCode] = useState("");
  const [filterJeu, setFilterJeu] = useState("");
  const [cancelCode, setCancelCode] = useState("");
  const [cancelMsg, setCancelMsg] = useState("");
  const [erreurDoublon, setErreurDoublon] = useState("");

  async function refreshReservations() {
    try {
      const data = await getReservations();
      setReservations(data);
      setError("");
    } catch (e) {
      setError("Erreur de connexion à la base de données. Verifiez votre connexion.");
    }
  }

  useEffect(() => {
    refreshReservations().then(() => setLoading(false));
    const interval = setInterval(refreshReservations, 30000);
    return () => clearInterval(interval);
  }, []);

  function resForDay(date) {
    return reservations.filter(r => isBetween(date, r.date_retrait, r.date_retour));
  }

  const days = getMonthDays(calYear, calMonth);
  const selectedDayRes = selectedDay ? resForDay(selectedDay) : [];
  const filteredRes = filterJeu ? reservations.filter(r => r.jeu === filterJeu) : reservations;
  const maxRetour = form.date_retrait ? addDays(form.date_retrait, 31) : "";

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setErreurDoublon("");
    if (name === "date_retrait") {
      setForm(f => ({ ...f, date_retrait: value, date_retour: "" }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.adhesion.toUpperCase() !== "LUDO2026") {
      alert("Code adherent invalide.");
      return;
    }

    // Verification doublon
    const conflit = reservations.find(r => r.jeu === form.jeu && chevauchement(r, form.date_retrait, form.date_retour));
    if (conflit) {
      setErreurDoublon("Ce jeu est deja reserve du " + formatDate(conflit.date_retrait) + " au " + formatDate(conflit.date_retour) + ". Veuillez choisir d autres dates.");
      return;
    }

    const code = genCode();
    setSaving(true);
    try {
      await insertReservation({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone || null,
        jeu: form.jeu,
        date_retrait: form.date_retrait,
        date_retour: form.date_retour,
        commentaire: form.commentaire || null,
        code: code,
      });
      await refreshReservations();

      // Email notification via Web3Forms
      const sujetConfirm = encodeURIComponent("Confirmation reservation - " + form.jeu);
      const corpsConfirm = "Bonjour " + form.prenom + ",%0A%0AVotre reservation du jeu " + form.jeu + " du " + formatDate(form.date_retrait) + " au " + formatDate(form.date_retour) + " est confirmee.%0A%0ACode annulation : " + code + "%0A%0AA bientot !%0A%0AL equipe PEP Bretill Armor";
      const lienConfirm = "mailto:" + form.email + "?subject=" + sujetConfirm + "&body=" + corpsConfirm;
      const sujetRefus = encodeURIComponent("Reservation refusee - " + form.jeu);
      const corpsRefus = "Bonjour " + form.prenom + ",%0A%0ANous sommes desoles, votre demande pour le jeu " + form.jeu + " du " + formatDate(form.date_retrait) + " au " + formatDate(form.date_retour) + " ne peut pas etre acceptee.%0A%0APour annuler, entrez le code " + code + " sur le site dans l onglet Annuler.%0A%0AN hesitez pas a nous recontacter.%0A%0AL equipe PEP Bretill Armor";
      const lienRefus = "mailto:" + form.email + "?subject=" + sujetRefus + "&body=" + corpsRefus;

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: "a64bb057-88b9-42ee-a773-3dd1a0a0a443",
          subject: "Nouvelle reservation - " + form.jeu + " (" + code + ")",
          from_name: form.prenom + " " + form.nom,
          replyto: form.email,
          Code: code,
          Prenom: form.prenom,
          Nom: form.nom,
          Email: form.email,
          Telephone: form.telephone || "Non renseigne",
          Jeu: form.jeu,
          Date_retrait: formatDate(form.date_retrait),
          Date_retour: formatDate(form.date_retour),
          Commentaire: form.commentaire || "Aucun",
          Actions: "CONFIRMER : " + lienConfirm + " | REFUSER : " + lienRefus,
        })
      }).catch(() => {});

      setSubmittedCode(code);
      setSubmitted(true);
      setForm({ prenom:"", nom:"", email:"", telephone:"", jeu:"", date_retrait:"", date_retour:"", adhesion:"", commentaire:"" });
    } catch (err) {
      alert("Erreur lors de la reservation : " + err.message);
    }
    setSaving(false);
  }

  async function handleCancel(e) {
    e.preventDefault();
    const code = cancelCode.trim().toUpperCase();
    setSaving(true);
    try {
      // Vérifier que la réservation existe
      const exists = reservations.find(r => r.code && r.code.toUpperCase() === code);
      if (!exists) {
        setCancelMsg("error");
        setSaving(false);
        return;
      }
      await deleteReservation(code);
      await refreshReservations();
      setCancelMsg("ok");
      setCancelCode("");
    } catch (err) {
      setCancelMsg("error");
    }
    setSaving(false);
  }

  const S = {
    app: { fontFamily: "sans-serif", background: "#ffffff", minHeight: "100vh" },
    header: { background: "#fff", padding: "0.75rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", borderBottom: "3px solid " + C, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
    nav: { display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" },
    navBtn: (a) => ({ padding: "0.5rem 1rem", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, background: a ? C : "#eee", color: a ? "#fff" : C }),
    main: { maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" },
    card: { background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginBottom: "1.5rem" },
    calHdr: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" },
    calTitle: { fontSize: "1.2rem", fontWeight: 700, color: C },
    arrowBtn: { background: "none", border: "1.5px solid #ddd", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer", fontSize: "1.1rem" },
    grid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "3px" },
    dayHdr: { textAlign: "center", fontSize: "0.7rem", fontWeight: 700, color: "#999", padding: "0.4rem 0", textTransform: "uppercase" },
    dayCell: (isTd, isSel, hasRes) => ({ minHeight: "60px", borderRadius: "10px", padding: "0.3rem", cursor: "pointer", background: isSel ? C : isTd ? "#e8f7f8" : hasRes ? "#fff0f0" : "#fff", border: isSel ? "2px solid " + C : isTd ? "2px solid " + C : "1.5px solid #eee" }),
    dayNum: (isSel, isTd) => ({ fontSize: "0.8rem", fontWeight: 700, color: isSel ? "#fff" : isTd ? C : "#333", marginBottom: "3px" }),
    tag: (col) => ({ background: col, color: "#fff", borderRadius: "4px", fontSize: "0.62rem", padding: "1px 4px", marginBottom: "2px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }),
    secTitle: { fontSize: "1rem", fontWeight: 700, color: C, borderBottom: "2px solid #6dbd69", paddingBottom: "0.3rem", marginBottom: "1rem", display: "inline-block" },
    field: { marginBottom: "1rem" },
    lbl: { display: "block", fontSize: "0.82rem", fontWeight: 600, color: C, marginBottom: "0.3rem" },
    inp: { width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", background: "#fafafa" },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
    btn: { width: "100%", padding: "0.9rem", background: C, color: "#fff", border: "none", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", marginTop: "0.5rem" },
    badge: (col) => ({ background: col, color: "#fff", borderRadius: "20px", padding: "0.2rem 0.7rem", fontSize: "0.78rem", fontWeight: 600 }),
    resCard: (col) => ({ borderLeft: "4px solid " + col, borderRadius: "8px", padding: "0.9rem", marginBottom: "0.75rem", background: "#fafafa" }),
    alertRed: { background: "#fff3f3", border: "1.5px solid #c0392b", borderRadius: "8px", padding: "0.75rem", color: "#c0392b", fontSize: "0.85rem", marginTop: "0.5rem" },
    alertGreen: { background: "#f0faf0", border: "1.5px solid #27ae60", borderRadius: "8px", padding: "0.75rem", color: "#27ae60", fontSize: "0.85rem", marginTop: "0.5rem" },
    alertYellow: { background: "#fffbf0", border: "1.5px solid #e67e22", borderRadius: "8px", padding: "0.75rem", color: "#e67e22", fontSize: "0.85rem", marginBottom: "1rem" },
    codeBox: { background: "#eef7f8", border: "2px dashed " + C, borderRadius: "10px", padding: "1rem", textAlign: "center", margin: "1rem 0", fontSize: "1.3rem", fontWeight: 700, color: C, letterSpacing: "0.1em" },
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#fff" }}>
      <div style={{ textAlign:"center", color:C }}>
        <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>🎲</div>
        <div>Chargement des reservations...</div>
      </div>
    </div>
  );

  return (
    <div style={S.app}>
      <header style={S.header}>
        <img src={LOGO} alt="Du Bout des Doigts" style={{ height:"70px", width:"70px", objectFit:"contain" }} />
        <nav style={S.nav}>
          <button style={S.navBtn(view==="calendrier")} onClick={() => setView("calendrier")}>📅 Calendrier</button>
          <button style={S.navBtn(view==="reserver")} onClick={() => { setView("reserver"); setSubmitted(false); setErreurDoublon(""); }}>✏️ Reserver</button>
          <button style={S.navBtn(view==="liste")} onClick={() => setView("liste")}>📋 Reservations</button>
          <button style={S.navBtn(view==="annuler")} onClick={() => { setView("annuler"); setCancelMsg(""); }}>❌ Annuler</button>
          <button
            onClick={refreshReservations}
            title="Rafraichir"
            style={{ padding:"0.5rem 0.8rem", borderRadius:"20px", border:"1.5px solid #ddd", cursor:"pointer", fontSize:"0.82rem", fontWeight:600, background:"#fff", color:"#555" }}
          >🔄</button>
        </nav>
      </header>

      <div style={S.main}>
        {error && <div style={S.alertYellow}>⚠️ {error}</div>}

        {/* ── CALENDRIER ── */}
        {view === "calendrier" && <>
          <div style={S.card}>
            <div style={S.calHdr}>
              <button style={S.arrowBtn} onClick={prevMonth}>&#8249;</button>
              <span style={S.calTitle}>{MOIS[calMonth]} {calYear}</span>
              <button style={S.arrowBtn} onClick={nextMonth}>&#8250;</button>
            </div>
            <div style={S.grid}>
              {JOURS.map(j => <div key={j} style={S.dayHdr}>{j}</div>)}
              {days.map((date, i) => {
                if (!date) return <div key={i} />;
                const isTd = date.toDateString() === today.toDateString();
                const isSel = selectedDay && date.toDateString() === selectedDay.toDateString();
                const res = resForDay(date);
                return (
                  <div key={i} style={S.dayCell(isTd, isSel, res.length > 0)} onClick={() => setSelectedDay(isSel ? null : date)}>
                    <div style={S.dayNum(isSel, isTd)}>{date.getDate()}</div>
                    {res.slice(0,2).map(r => <span key={r.id} style={S.tag(jeuColor(r.jeu))}>{r.jeu}</span>)}
                    {res.length > 2 && <span style={{ fontSize:"0.6rem", color: isSel ? "#fff" : "#888" }}>+{res.length-2}</span>}
                  </div>
                );
              })}
            </div>
          </div>
          {selectedDay && (
            <div style={S.card}>
              <div style={S.secTitle}>{selectedDay.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
              {selectedDayRes.length === 0
                ? <p style={{ color:"#888" }}>Aucune reservation ce jour. <button style={{ background:"none", border:"none", color:C, cursor:"pointer", fontWeight:600 }} onClick={() => { setView("reserver"); setSubmitted(false); }}>Reserver un jeu</button></p>
                : selectedDayRes.map(r => (
                  <div key={r.id} style={S.resCard(jeuColor(r.jeu))}>
                    <span style={S.badge(jeuColor(r.jeu))}>{r.jeu}</span>
                    <div style={{ marginTop:"0.4rem", fontSize:"0.85rem", color:"#555" }}>📅 {formatDate(r.date_retrait)} → {formatDate(r.date_retour)}</div>
                    <div style={{ fontSize:"0.78rem", color:"#c0392b", marginTop:"0.3rem" }}>🔒 Non disponible</div>
                  </div>
                ))
              }
            </div>
          )}
        </>}

        {/* ── FORMULAIRE RESERVATION ── */}
        {view === "reserver" && (
          <div style={S.card}>
            {submitted ? (
              <div style={{ textAlign:"center", padding:"2rem" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
                <h2 style={{ color:C, marginBottom:"0.75rem" }}>Demande envoyee !</h2>
                <p style={{ color:"#555", marginBottom:"0.5rem" }}>Votre reservation est visible dans le calendrier.</p>
                <p style={{ color:"#555", marginBottom:"1rem" }}>Vous recevrez une confirmation sous 48h.</p>
                <p style={{ color:"#555", fontSize:"0.9rem", marginBottom:"0.5rem" }}>Votre code d annulation :</p>
                <div style={S.codeBox}>{submittedCode}</div>
                <p style={{ color:"#888", fontSize:"0.8rem", marginBottom:"1.5rem" }}>Conservez ce code pour annuler si besoin.</p>
                <button style={{ ...S.btn, maxWidth:"220px", margin:"0 auto" }} onClick={() => setView("calendrier")}>Voir le calendrier</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ color:C, marginBottom:"1.5rem" }}>Reserver un jeu</h2>

                <div style={S.secTitle}>Vos coordonnees</div>
                <div style={{ ...S.row2, marginTop:"1rem" }}>
                  <div style={S.field}><label style={S.lbl}>Prenom *</label><input style={S.inp} name="prenom" required value={form.prenom} onChange={handleChange} /></div>
                  <div style={S.field}><label style={S.lbl}>Nom *</label><input style={S.inp} name="nom" required value={form.nom} onChange={handleChange} /></div>
                </div>
                <div style={S.field}><label style={S.lbl}>Email *</label><input style={S.inp} type="email" name="email" required value={form.email} onChange={handleChange} /></div>
                <div style={S.field}><label style={S.lbl}>Telephone</label><input style={S.inp} type="tel" name="telephone" value={form.telephone} onChange={handleChange} /></div>

                <div style={{ marginTop:"1.5rem" }}><div style={S.secTitle}>Adhesion</div></div>
                <div style={{ ...S.field, marginTop:"1rem" }}>
                  <label style={S.lbl}>Code adherent *</label>
                  <input style={{ ...S.inp, letterSpacing:"0.1em" }} name="adhesion" required value={form.adhesion} onChange={handleChange} placeholder="Entrez votre code adherent" />
                  {form.adhesion !== "" && form.adhesion.toUpperCase() !== "LUDO2026" && (
                    <div style={S.alertRed}>Code invalide. Pour adherer : ludotheque@pepbretillarmor.org</div>
                  )}
                  {form.adhesion.toUpperCase() === "LUDO2026" && <div style={S.alertGreen}>✓ Code adherent valide !</div>}
                </div>

                <div style={{ marginTop:"1.5rem" }}><div style={S.secTitle}>Le jeu souhaite</div></div>
                <div style={{ ...S.field, marginTop:"1rem" }}>
                  <label style={S.lbl}>Jeu a emprunter *</label>
                  <select style={S.inp} name="jeu" required value={form.jeu} onChange={handleChange}>
                    <option value="">-- Choisissez un jeu --</option>
                    {Object.entries(JEUX).map(([cat, jeux]) => (
                      <optgroup key={cat} label={cat}>{jeux.map(j => <option key={j}>{j}</option>)}</optgroup>
                    ))}
                  </select>
                </div>

                <div style={{ marginTop:"1.5rem" }}><div style={S.secTitle}>Dates souhaitees</div></div>
                <div style={{ ...S.row2, marginTop:"1rem" }}>
                  <div style={S.field}>
                    <label style={S.lbl}>Date de retrait *</label>
                    <input style={S.inp} type="date" name="date_retrait" required value={form.date_retrait} min={todayStr} onChange={handleChange} />
                  </div>
                  <div style={S.field}>
                    <label style={S.lbl}>Date de retour *</label>
                    <input style={S.inp} type="date" name="date_retour" required value={form.date_retour} min={form.date_retrait} max={maxRetour} onChange={handleChange} disabled={!form.date_retrait} />
                    <p style={{ fontSize:"0.75rem", color:"#888", marginTop:"0.2rem" }}>Maximum 31 jours</p>
                  </div>
                </div>

                {erreurDoublon && <div style={S.alertRed}>⚠️ {erreurDoublon}</div>}

                <div style={{ ...S.field, marginTop:"1rem" }}>
                  <label style={S.lbl}>Commentaire (facultatif)</label>
                  <textarea style={{ ...S.inp, minHeight:"80px", resize:"vertical" }} name="commentaire" value={form.commentaire} onChange={handleChange} />
                </div>

                {saving && <div style={{ ...S.alertGreen, textAlign:"center", marginBottom:"0.5rem" }}>⏳ Enregistrement en cours...</div>}
                <button type="submit" style={{ ...S.btn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Envoi..." : "Envoyer ma demande de reservation"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── LISTE ── */}
        {view === "liste" && (
          <div style={S.card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem", marginBottom:"1.25rem" }}>
              <h2 style={{ color:C }}>Reservations ({filteredRes.length})</h2>
              <select style={{ ...S.inp, width:"auto", minWidth:"200px" }} value={filterJeu} onChange={e => setFilterJeu(e.target.value)}>
                <option value="">Tous les jeux</option>
                {Object.values(JEUX).flat().map(j => <option key={j}>{j}</option>)}
              </select>
            </div>
            {filteredRes.length === 0
              ? <p style={{ color:"#888", textAlign:"center", padding:"2rem" }}>Aucune reservation pour l instant.</p>
              : [...filteredRes].sort((a,b) => new Date(a.date_retrait)-new Date(b.date_retrait)).map(r => (
                <div key={r.id} style={S.resCard(jeuColor(r.jeu))}>
                  <span style={S.badge(jeuColor(r.jeu))}>{r.jeu}</span>
                  <div style={{ marginTop:"0.4rem", fontSize:"0.85rem", color:"#555" }}>📅 {formatDate(r.date_retrait)} → {formatDate(r.date_retour)}</div>
                  <div style={{ fontSize:"0.78rem", color:"#c0392b", marginTop:"0.3rem" }}>🔒 Non disponible</div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── ANNULATION ── */}
        {view === "annuler" && (
          <div style={S.card}>
            <h2 style={{ color:C, marginBottom:"1rem" }}>Annuler une reservation</h2>
            <p style={{ color:"#555", marginBottom:"1.5rem", fontSize:"0.9rem" }}>Entrez le code d annulation recu lors de votre reservation.</p>
            {cancelMsg === "ok" && <div style={S.alertGreen}>✅ Votre reservation a bien ete annulee.</div>}
            {cancelMsg === "error" && <div style={S.alertRed}>❌ Code invalide. Verifiez votre code et reessayez.</div>}
            {cancelMsg !== "ok" && (
              <form onSubmit={handleCancel}>
                <div style={S.field}>
                  <label style={S.lbl}>Code d annulation</label>
                  <input style={{ ...S.inp, letterSpacing:"0.15em", textTransform:"uppercase", fontSize:"1.1rem" }} value={cancelCode} onChange={e => { setCancelCode(e.target.value); setCancelMsg(""); }} placeholder="RES-XXXX" required />
                </div>
                {saving && <div style={{ ...S.alertGreen, textAlign:"center", marginBottom:"0.5rem" }}>⏳ Annulation en cours...</div>}
                <button type="submit" style={{ ...S.btn, background:"#c0392b", opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "Annulation..." : "Annuler ma reservation"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
