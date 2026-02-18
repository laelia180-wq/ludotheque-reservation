import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_xl5olo2";
const EMAILJS_TEMPLATE_ID = "template_taxrkf4";
const EMAILJS_PUBLIC_KEY = "Udr_aDSnSwbJKKghj";

const JEUX = {
  "Jeux de stratégie": ["Awale", "Dames", "Échecs tactiles", "Four Senses", "Quarto Access", "Rush Hour", "Solitaire", "Sudoku"],
  "Jeux de cartes": ["7 Familles Braille", "Jeu de 32 cartes Braille", "Jeu de 54 cartes Braille", "Mille Bornes Braille", "MOW Access", "UNO Braille"],
  "Jeux sensoriels / tactiles": ["Barres Tactiles", "Memory tactile tissu", "Memory sons", "Tactilo Loto", "Le Toucher Montessori", "Little Memo", "Loto des 40"],
  "Jeux coopératifs": ["Little Cooperation", "Hop Hop Hop"],
  "Jeux d'adresse": ["Mikado à disques", "SOS Ouistiti", "Tour tombante", "Pic Pirate"],
  "Puzzles / Construction": ["Jeu du Cafard", "Legos Braille", "Puzzle Arc en Ciel", "Puzzle Cœur", "Il était une ferme", "Rubik's Cube tactile"],
  "Autres jeux": ["Bata Waf", "Bogoss", "Branle Bas de Wombat", "Croque Carotte", "Cuisto Dingo", "La Course des Tortues", "Le Renard des Bois", "Les Petites Souris", "Morpion maison", "Perlinpinpin", "Petits Chevaux", "Puissance 4 modifié", "Tic Tac Boum Junior", "Woolfy", "Yams"]
};

const COULEURS = ["#1f94a2","#6dbd69","#e67e22","#8e44ad","#2980b9","#c0392b","#16a085","#d35400","#1f94a2","#6dbd69"];

const today = new Date();
today.setHours(0,0,0,0);

function formatDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  let startDow = firstDay.getDay();
  if (startDow === 0) startDow = 7;
  for (let i = 1; i < startDow; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

function isBetween(date, start, end) {
  const d = new Date(date); d.setHours(0,0,0,0);
  const s = new Date(start); s.setHours(0,0,0,0);
  const e = new Date(end); e.setHours(0,0,0,0);
  return d >= s && d <= e;
}

const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const JOURS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

export default function App() {
  const [view, setView] = useState("calendrier");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [form, setForm] = useState({ prenom:"", nom:"", email:"", telephone:"", jeu:"", date_retrait:"", date_retour:"", adhesion:"", commentaire:"" });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterJeu, setFilterJeu] = useState("");
  const [emailError, setEmailError] = useState("");
  const [lastEmail, setLastEmail] = useState("");

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    loadReservations();
  }, []);

  async function loadReservations() {
    setLoading(true);
    try {
      const result = await window.storage.get("reservations", true);
      setReservations(result ? JSON.parse(result.value) : []);
    } catch { setReservations([]); }
    setLoading(false);
  }

  async function saveReservations(newList) {
    await window.storage.set("reservations", JSON.stringify(newList), true);
    setReservations(newList);
  }

  function jeuColor(jeu) {
    const all = Object.values(JEUX).flat();
    return COULEURS[all.indexOf(jeu) % COULEURS.length];
  }

  function reservationsForDay(date) {
    return reservations.filter(r => isBetween(date, r.date_retrait, r.date_retour));
  }

  const days = getMonthDays(calYear, calMonth);

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); }
    else setCalMonth(m => m-1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); }
    else setCalMonth(m => m+1);
    setSelectedDay(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setEmailError("");
    setLastEmail(form.email);

    // 1. Sauvegarde dans le calendrier
    const newRes = { ...form, id: Date.now(), created: new Date().toISOString() };
    await saveReservations([...reservations, newRes]);

    // 2. Envoi email via EmailJS
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone || "Non renseigné",
        adhesion: form.adhesion === "oui" ? "Déjà adhérent" : "Souhaite adhérer",
        jeu: form.jeu,
        date_retrait: formatDate(form.date_retrait),
        date_retour: formatDate(form.date_retour),
        commentaire: form.commentaire || "Aucun",
      });
    } catch (err) {
      console.error("Erreur EmailJS:", err);
      setEmailError("⚠️ La réservation a été enregistrée dans le calendrier mais l'email n'a pas pu être envoyé. Contactez-nous directement à ludotheque@pepbretillarmor.org");
    }

    setSaving(false);
    setSubmitted(true);
    setForm({ prenom:"", nom:"", email:"", telephone:"", jeu:"", date_retrait:"", date_retour:"", adhesion:"", commentaire:"" });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "date_retrait") {
      setForm(f => ({ ...f, date_retrait: value, date_retour: "" }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  const maxRetour = form.date_retrait ? (() => {
    const d = new Date(form.date_retrait);
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  })() : "";

  const selectedDayRes = selectedDay ? reservationsForDay(selectedDay) : [];
  const filteredRes = filterJeu ? reservations.filter(r => r.jeu === filterJeu) : reservations;

  const S = {
    app: { fontFamily: "'DM Sans', sans-serif", background: "#f0ede6", minHeight: "100vh", color: "#1a1a1a" },
    header: { background: "#1f94a2", color: "#fff", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" },
    headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700 },
    headerSub: { fontSize: "0.8rem", opacity: 0.7, marginTop: "0.2rem" },
    nav: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
    navBtn: (active) => ({ padding: "0.5rem 1.1rem", borderRadius: "20px", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 500, background: active ? "#6dbd69" : "rgba(255,255,255,0.2)", color: "#fff" }),
    main: { maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" },
    card: { background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginBottom: "1.5rem" },
    calHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" },
    calTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#1f94a2" },
    arrowBtn: { background: "none", border: "1.5px solid #ddd", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer", fontSize: "1.1rem" },
    grid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" },
    dayHeader: { textAlign: "center", fontSize: "0.7rem", fontWeight: 600, color: "#999", padding: "0.4rem 0" },
    dayCell: (isToday, isSelected, hasRes) => ({
      minHeight: "62px", borderRadius: "10px", padding: "0.3rem", cursor: "pointer",
      background: isSelected ? "#1f94a2" : isToday ? "#e8f7f8" : hasRes ? "#f0faf0" : "#fff",
      border: isSelected ? "2px solid #1f94a2" : isToday ? "2px solid #1f94a2" : "1.5px solid #eee",
    }),
    dayNum: (isSelected, isToday) => ({ fontSize: "0.8rem", fontWeight: 700, color: isSelected ? "#fff" : isToday ? "#1f94a2" : "#333", marginBottom: "3px" }),
    resTag: (color) => ({ background: color, color: "#fff", borderRadius: "4px", fontSize: "0.62rem", padding: "1px 4px", marginBottom: "2px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }),
    secTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#1f94a2", borderBottom: "2px solid #6dbd69", paddingBottom: "0.4rem", marginBottom: "1rem", display: "inline-block" },
    field: { marginBottom: "1rem" },
    label: { display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#1f94a2", marginBottom: "0.3rem" },
    input: { width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid #ddd", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", background: "#fafafa" },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
    btn: { width: "100%", padding: "0.9rem", background: "#1f94a2", color: "#fff", border: "none", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", marginTop: "0.5rem" },
    badge: (color) => ({ background: color, color: "#fff", borderRadius: "20px", padding: "0.2rem 0.7rem", fontSize: "0.78rem", fontWeight: 600, display: "inline-block" }),
    resCard: (color) => ({ borderLeft: `4px solid ${color}`, borderRadius: "8px", padding: "0.9rem 1rem", marginBottom: "0.75rem", background: "#fafafa" }),
    errorBox: { background: "#fff3f3", border: "1.5px solid #c0392b", borderRadius: "8px", padding: "0.75rem 1rem", color: "#c0392b", fontSize: "0.85rem", marginTop: "1rem" },
  };

  if (loading) return (
    <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ textAlign: "center", color: "#1f94a2", fontFamily: "'Playfair Display', serif" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎲</div>
        Chargement…
      </div>
    </div>
  );

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <header style={S.header}>
        <div>
          <div style={S.headerTitle}>🎲 Ludothèque – Les PEP Brétill'Armor</div>
          <div style={S.headerSub}>Jeux adaptés pour déficients visuels</div>
        </div>
        <nav style={S.nav}>
          <button style={S.navBtn(view === "calendrier")} onClick={() => setView("calendrier")}>📅 Calendrier</button>
          <button style={S.navBtn(view === "reserver")} onClick={() => { setView("reserver"); setSubmitted(false); }}>✏️ Réserver</button>
          <button style={S.navBtn(view === "liste")} onClick={() => setView("liste")}>📋 Réservations</button>
        </nav>
      </header>

      <div style={S.main}>

        {/* CALENDRIER */}
        {view === "calendrier" && <>
          <div style={S.card}>
            <div style={S.calHeader}>
              <button style={S.arrowBtn} onClick={prevMonth}>‹</button>
              <span style={S.calTitle}>{MOIS[calMonth]} {calYear}</span>
              <button style={S.arrowBtn} onClick={nextMonth}>›</button>
            </div>
            <div style={S.grid}>
              {JOURS.map(j => <div key={j} style={S.dayHeader}>{j}</div>)}
              {days.map((date, i) => {
                if (!date) return <div key={i} />;
                const isToday = date.toDateString() === today.toDateString();
                const isSelected = selectedDay && date.toDateString() === selectedDay.toDateString();
                const res = reservationsForDay(date);
                return (
                  <div key={i} style={S.dayCell(isToday, isSelected, res.length > 0)} onClick={() => setSelectedDay(isSelected ? null : date)}>
                    <div style={S.dayNum(isSelected, isToday)}>{date.getDate()}</div>
                    {res.slice(0,2).map(r => <span key={r.id} style={S.resTag(jeuColor(r.jeu))}>{r.jeu}</span>)}
                    {res.length > 2 && <span style={{ fontSize: "0.6rem", color: isSelected ? "#fff" : "#888" }}>+{res.length-2}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedDay && (
            <div style={S.card}>
              <div style={S.secTitle}>
                {selectedDay.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
              {selectedDayRes.length === 0
                ? <p style={{ color: "#888", fontSize: "0.9rem" }}>Aucune réservation ce jour-là. <button style={{ background: "none", border: "none", color: "#1f94a2", cursor: "pointer", fontWeight: 600 }} onClick={() => { setView("reserver"); setSubmitted(false); }}>Réserver un jeu →</button></p>
                : selectedDayRes.map(r => (
                  <div key={r.id} style={S.resCard(jeuColor(r.jeu))}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div>
                        <span style={S.badge(jeuColor(r.jeu))}>{r.jeu}</span>
                        <div style={{ marginTop: "0.4rem", fontWeight: 600 }}>{r.prenom} {r.nom}</div>
                        <div style={{ fontSize: "0.8rem", color: "#666" }}>{formatDate(r.date_retrait)} → {formatDate(r.date_retour)}</div>
                        {r.adhesion && <div style={{ fontSize: "0.78rem", color: "#888" }}>{r.adhesion === "oui" ? "✅ Adhérent" : "🆕 Souhaite adhérer"}</div>}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#888", textAlign: "right" }}>
                        {r.email}<br />{r.telephone}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </>}

        {/* FORMULAIRE */}
        {view === "reserver" && (
          <div style={S.card}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1f94a2", marginBottom: "0.75rem" }}>Demande envoyée !</h2>
                <p style={{ color: "#555", marginBottom: "0.5rem" }}>Votre réservation est visible dans le calendrier.</p>
                <p style={{ color: "#555", marginBottom: "1.5rem" }}>Un email a été transmis à notre équipe. Vous recevrez une confirmation sous 48h.</p>
                {emailError && <div style={S.errorBox}>{emailError}</div>}
                <button style={{ ...S.btn, maxWidth: "220px", margin: "1rem auto 0" }} onClick={() => setView("calendrier")}>Voir le calendrier</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1f94a2", marginBottom: "1.5rem" }}>Réserver un jeu</h2>

                <div style={S.secTitle}>Vos coordonnées</div>
                <div style={{ ...S.row2, marginTop: "1rem" }}>
                  <div style={S.field}><label style={S.label}>Prénom *</label><input style={S.input} name="prenom" required value={form.prenom} onChange={handleChange} placeholder="Marie" /></div>
                  <div style={S.field}><label style={S.label}>Nom *</label><input style={S.input} name="nom" required value={form.nom} onChange={handleChange} placeholder="Dupont" /></div>
                </div>
                <div style={S.field}><label style={S.label}>Email *</label><input style={S.input} type="email" name="email" required value={form.email} onChange={handleChange} placeholder="marie.dupont@email.fr" /></div>
                <div style={S.field}><label style={S.label}>Téléphone</label><input style={S.input} type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="06 12 34 56 78" /></div>

                <div style={{ marginTop: "1.5rem" }}><div style={S.secTitle}>Adhésion</div></div>
                <div style={{ ...S.field, marginTop: "1rem" }}>
                  <label style={S.label}>Êtes-vous adhérent ? *</label>
                  <select style={S.input} name="adhesion" required value={form.adhesion} onChange={handleChange}>
                    <option value="">-- Choisissez --</option>
                    <option value="oui">Je suis déjà adhérent</option>
                    <option value="non">Je souhaite adhérer</option>
                  </select>
                </div>

                <div style={{ marginTop: "1.5rem" }}><div style={S.secTitle}>Le jeu souhaité</div></div>
                <div style={{ ...S.field, marginTop: "1rem" }}>
                  <label style={S.label}>Jeu à emprunter *</label>
                  <select style={S.input} name="jeu" required value={form.jeu} onChange={handleChange}>
                    <option value="">-- Choisissez un jeu --</option>
                    {Object.entries(JEUX).map(([cat, jeux]) => (
                      <optgroup key={cat} label={cat}>{jeux.map(j => <option key={j}>{j}</option>)}</optgroup>
                    ))}
                  </select>
                </div>

                <div style={{ marginTop: "1.5rem" }}><div style={S.secTitle}>Dates souhaitées</div></div>
                <div style={{ ...S.row2, marginTop: "1rem" }}>
                  <div style={S.field}>
                    <label style={S.label}>Date de retrait *</label>
                    <input style={S.input} type="date" name="date_retrait" required value={form.date_retrait} min={today.toISOString().split("T")[0]} onChange={handleChange} />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Date de retour *</label>
                    <input style={S.input} type="date" name="date_retour" required value={form.date_retour} min={form.date_retrait} max={maxRetour} onChange={handleChange} disabled={!form.date_retrait} />
                    <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.2rem" }}>Maximum 2 semaines</p>
                  </div>
                </div>

                <div style={S.field}>
                  <label style={S.label}>Commentaire (facultatif)</label>
                  <textarea style={{ ...S.input, minHeight: "80px", resize: "vertical" }} name="commentaire" value={form.commentaire} onChange={handleChange} placeholder="Besoin particulier, question sur le jeu…" />
                </div>

                <button type="submit" style={{ ...S.btn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  {saving ? "⏳ Envoi en cours…" : "✉️  Envoyer ma demande de réservation"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* LISTE */}
        {view === "liste" && (
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1f94a2" }}>
                Réservations <span style={{ fontSize: "0.9rem", color: "#888", fontWeight: 400 }}>({filteredRes.length})</span>
              </h2>
              <select style={{ ...S.input, width: "auto", minWidth: "200px" }} value={filterJeu} onChange={e => setFilterJeu(e.target.value)}>
                <option value="">Tous les jeux</option>
                {Object.values(JEUX).flat().map(j => <option key={j}>{j}</option>)}
              </select>
            </div>
            {filteredRes.length === 0
              ? <p style={{ color: "#888", textAlign: "center", padding: "2rem" }}>Aucune réservation pour l'instant.</p>
              : [...filteredRes].sort((a,b) => new Date(a.date_retrait) - new Date(b.date_retrait)).map(r => (
                <div key={r.id} style={S.resCard(jeuColor(r.jeu))}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <span style={S.badge(jeuColor(r.jeu))}>{r.jeu}</span>
                      <div style={{ marginTop: "0.4rem", fontWeight: 600 }}>{r.prenom} {r.nom}</div>
                      <div style={{ fontSize: "0.82rem", color: "#555" }}>📅 {formatDate(r.date_retrait)} → {formatDate(r.date_retour)}</div>
                      {r.adhesion && <div style={{ fontSize: "0.78rem", color: "#888" }}>{r.adhesion === "oui" ? "✅ Adhérent" : "🆕 Souhaite adhérer"}</div>}
                      {r.commentaire && <div style={{ fontSize: "0.8rem", color: "#666", fontStyle: "italic" }}>"{r.commentaire}"</div>}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#888", textAlign: "right" }}>
                      {r.email}<br />{r.telephone}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}
