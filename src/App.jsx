import { useState, useEffect } from "react";

const JEUX = {
  "Jeux de stratégie": ["Awale", "Dames", "Échecs tactiles", "Four Senses", "Quarto Access", "Rush Hour", "Solitaire", "Sudoku"],
  "Jeux de cartes": ["7 Familles Braille", "Jeu de 32 cartes Braille", "Jeu de 54 cartes Braille", "Mille Bornes Braille", "MOW Access", "UNO Braille"],
  "Jeux sensoriels / tactiles": ["Barres Tactiles", "Memory tactile tissu", "Memory sons", "Tactilo Loto", "Le Toucher Montessori", "Little Memo", "Loto des 40"],
  "Jeux coopératifs": ["Little Cooperation", "Hop Hop Hop"],
  "Jeux d'adresse": ["Mikado à disques", "SOS Ouistiti", "Tour tombante", "Pic Pirate"],
  "Puzzles / Construction": ["Jeu du Cafard", "Legos Braille", "Puzzle Arc en Ciel", "Puzzle Cœur", "Il était une ferme", "Rubik's Cube tactile"],
  "Autres jeux": ["Bata Waf", "Bogoss", "Branle Bas de Wombat", "Croque Carotte", "Cuisto Dingo", "La Course des Tortues", "Le Renard des Bois", "Les Petites Souris", "Morpion maison", "Perlinpinpin", "Petits Chevaux", "Puissance 4 modifié", "Tic Tac Boum Junior", "Woolfy", "Yams"]
};

const COULEURS = ["#1f94a2","#6dbd69","#e67e22","#8e44ad","#2980b9","#c0392b","#1f94a2","#6dbd69","#e67e22","#8e44ad"];

const today = new Date();
today.setHours(0,0,0,0);

function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
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

  useEffect(() => { loadReservations(); }, []);

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
    const idx = all.indexOf(jeu);
    return COULEURS[idx % COULEURS.length];
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
    const newRes = { ...form, id: Date.now(), created: new Date().toISOString() };
    const updated = [...reservations, newRes];
    await saveReservations(updated);
    setSaving(false);
    setSubmitted(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === "date_retrait") {
      const d = new Date(value);
      d.setDate(d.getDate() + 14);
      setForm(f => ({ ...f, date_retrait: value, date_retour: "" }));
    }
  }

  const maxRetour = form.date_retrait ? (() => { const d = new Date(form.date_retrait); d.setDate(d.getDate()+14); return d.toISOString().split("T")[0]; })() : "";

  const selectedDayRes = selectedDay ? reservationsForDay(selectedDay) : [];
  const filteredRes = filterJeu ? reservations.filter(r => r.jeu === filterJeu) : reservations;

  const styles = {
    app: { fontFamily: "'DM Sans', sans-serif", background: "#f0ede6", minHeight: "100vh", color: "#1a1a1a" },
    header: { background: "#1f94a2", color: "#fff", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" },
    headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700 },
    headerSub: { fontSize: "0.8rem", opacity: 0.7, marginTop: "0.2rem" },
    nav: { display: "flex", gap: "0.5rem" },
    navBtn: (active) => ({ padding: "0.5rem 1.1rem", borderRadius: "20px", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 500, background: active ? "#6dbd69" : "rgba(255,255,255,0.15)", color: "#fff", transition: "all 0.2s" }),
    main: { maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" },
    card: { background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginBottom: "1.5rem" },
    calHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" },
    calTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#1f94a2" },
    arrowBtn: { background: "none", border: "1.5px solid #ddd", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" },
    grid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" },
    dayHeader: { textAlign: "center", fontSize: "0.7rem", fontWeight: 600, color: "#888", padding: "0.4rem 0", textTransform: "uppercase" },
    dayCell: (date, isToday, isSelected, hasRes) => ({
      minHeight: "60px", borderRadius: "10px", padding: "0.3rem", cursor: date ? "pointer" : "default",
      background: isSelected ? "#1f94a2" : isToday ? "#e8f7f8" : hasRes ? "#f0faf0" : "#fff",
      border: isSelected ? "2px solid #1f94a2" : isToday ? "2px solid #1f94a2" : "1.5px solid #eee",
      transition: "all 0.15s",
    }),
    dayNum: (isSelected, isToday) => ({ fontSize: "0.8rem", fontWeight: 600, color: isSelected ? "#fff" : isToday ? "#1f94a2" : "#333", marginBottom: "3px" }),
    dot: (color) => ({ width: "8px", height: "8px", borderRadius: "50%", background: color, display: "inline-block", margin: "1px" }),
    resTag: (color) => ({ background: color, color: "#fff", borderRadius: "4px", fontSize: "0.65rem", padding: "1px 4px", marginBottom: "2px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }),
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#1f94a2", borderBottom: "2px solid #6dbd69", paddingBottom: "0.4rem", marginBottom: "1rem", display: "inline-block" },
    field: { marginBottom: "1rem" },
    label: { display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#1f94a2", marginBottom: "0.3rem" },
    input: { width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid #ddd", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
    submitBtn: { width: "100%", padding: "0.9rem", background: "#1f94a2", color: "#fff", border: "none", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", marginTop: "0.5rem" },
    badge: (color) => ({ background: color, color: "#fff", borderRadius: "20px", padding: "0.2rem 0.7rem", fontSize: "0.78rem", fontWeight: 600, display: "inline-block" }),
    resCard: { borderLeft: "4px solid", borderRadius: "8px", padding: "0.9rem 1rem", marginBottom: "0.75rem", background: "#fafafa" },
  };

  if (loading) return (
    <div style={{ ...styles.app, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎲</div>
        <p style={{ color: "#1a3a5c", fontFamily: "'Playfair Display', serif" }}>Chargement…</p>
      </div>
    </div>
  );

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <header style={styles.header}>
        <div>
          <div style={styles.headerTitle}>🎲 Ludothèque – Les PEP Brétill'Armor</div>
          <div style={styles.headerSub}>Jeux adaptés pour déficients visuels</div>
        </div>
        <nav style={styles.nav}>
          <button style={styles.navBtn(view === "calendrier")} onClick={() => setView("calendrier")}>📅 Calendrier</button>
          <button style={styles.navBtn(view === "reserver")} onClick={() => { setView("reserver"); setSubmitted(false); }}>✏️ Réserver</button>
          <button style={styles.navBtn(view === "liste")} onClick={() => setView("liste")}>📋 Réservations</button>
        </nav>
      </header>

      <div style={styles.main}>

        {/* ===== CALENDRIER ===== */}
        {view === "calendrier" && (
          <>
            <div style={styles.card}>
              <div style={styles.calHeader}>
                <button style={styles.arrowBtn} onClick={prevMonth}>‹</button>
                <span style={styles.calTitle}>{MOIS[calMonth]} {calYear}</span>
                <button style={styles.arrowBtn} onClick={nextMonth}>›</button>
              </div>
              <div style={styles.grid}>
                {JOURS.map(j => <div key={j} style={styles.dayHeader}>{j}</div>)}
                {days.map((date, i) => {
                  if (!date) return <div key={i} />;
                  const isToday = date.toDateString() === today.toDateString();
                  const isSelected = selectedDay && date.toDateString() === selectedDay.toDateString();
                  const res = reservationsForDay(date);
                  return (
                    <div key={i} style={styles.dayCell(date, isToday, isSelected, res.length > 0)} onClick={() => setSelectedDay(isSelected ? null : date)}>
                      <div style={styles.dayNum(isSelected, isToday)}>{date.getDate()}</div>
                      {res.slice(0, 2).map(r => (
                        <span key={r.id} style={styles.resTag(jeuColor(r.jeu))}>{r.jeu}</span>
                      ))}
                      {res.length > 2 && <span style={{ fontSize: "0.6rem", color: "#888" }}>+{res.length - 2}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedDay && (
              <div style={styles.card}>
                <div style={styles.sectionTitle}>
                  {selectedDay.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </div>
                {selectedDayRes.length === 0 ? (
                  <p style={{ color: "#888", fontSize: "0.9rem" }}>Aucune réservation ce jour-là. <button style={{ background: "none", border: "none", color: "#1f94a2", cursor: "pointer", fontWeight: 600 }} onClick={() => { setView("reserver"); setSubmitted(false); }}>Réserver un jeu →</button></p>
                ) : selectedDayRes.map(r => (
                  <div key={r.id} style={{ ...styles.resCard, borderColor: jeuColor(r.jeu) }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div>
                        <span style={styles.badge(jeuColor(r.jeu))}>{r.jeu}</span>
                        <div style={{ marginTop: "0.4rem", fontWeight: 600, fontSize: "0.9rem" }}>{r.prenom} {r.nom}</div>
                        <div style={{ fontSize: "0.8rem", color: "#666" }}>{formatDate(r.date_retrait)} → {formatDate(r.date_retour)}</div>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#888", textAlign: "right" }}>
                        {r.email}<br/>{r.telephone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== FORMULAIRE ===== */}
        {view === "reserver" && (
          <div style={styles.card}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1a3a5c", marginBottom: "0.75rem" }}>Demande envoyée !</h2>
                <p style={{ color: "#555", marginBottom: "1.5rem" }}>Votre réservation est visible dans le calendrier. Vous recevrez une confirmation sous 48h.</p>
                <button style={{ ...styles.submitBtn, maxWidth: "220px", margin: "0 auto" }} onClick={() => { setView("calendrier"); setForm({ prenom:"",nom:"",email:"",telephone:"",jeu:"",date_retrait:"",date_retour:"",adhesion:"",commentaire:"" }); }}>
                  Voir le calendrier
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1f94a2", marginBottom: "1.5rem" }}>Réserver un jeu</h2>

                <div style={styles.sectionTitle}>Vos coordonnées</div>
                <div style={{ ...styles.row2, marginTop: "1rem" }}>
                  <div style={styles.field}>
                    <label style={styles.label}>Prénom *</label>
                    <input style={styles.input} name="prenom" required value={form.prenom} onChange={handleChange} placeholder="Marie" />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Nom *</label>
                    <input style={styles.input} name="nom" required value={form.nom} onChange={handleChange} placeholder="Dupont" />
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email *</label>
                  <input style={styles.input} type="email" name="email" required value={form.email} onChange={handleChange} placeholder="marie.dupont@email.fr" />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Téléphone</label>
                  <input style={styles.input} type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="06 12 34 56 78" />
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <div style={styles.sectionTitle}>Adhésion</div>
                </div>
                <div style={{ ...styles.field, marginTop: "1rem" }}>
                  <label style={styles.label}>Êtes-vous adhérent ? *</label>
                  <select style={styles.input} name="adhesion" required value={form.adhesion} onChange={handleChange}>
                    <option value="">-- Choisissez --</option>
                    <option value="oui">Je suis déjà adhérent</option>
                    <option value="non">Je souhaite adhérer</option>
                  </select>
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <div style={styles.sectionTitle}>Le jeu souhaité</div>
                </div>
                <div style={{ ...styles.field, marginTop: "1rem" }}>
                  <label style={styles.label}>Jeu à emprunter *</label>
                  <select style={styles.input} name="jeu" required value={form.jeu} onChange={handleChange}>
                    <option value="">-- Choisissez un jeu --</option>
                    {Object.entries(JEUX).map(([cat, jeux]) => (
                      <optgroup key={cat} label={cat}>
                        {jeux.map(j => <option key={j}>{j}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <div style={styles.sectionTitle}>Dates souhaitées</div>
                </div>
                <div style={{ ...styles.row2, marginTop: "1rem" }}>
                  <div style={styles.field}>
                    <label style={styles.label}>Date de retrait *</label>
                    <input style={styles.input} type="date" name="date_retrait" required value={form.date_retrait} min={today.toISOString().split("T")[0]} onChange={handleChange} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Date de retour *</label>
                    <input style={styles.input} type="date" name="date_retour" required value={form.date_retour} min={form.date_retrait} max={maxRetour} onChange={handleChange} disabled={!form.date_retrait} />
                    <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.2rem" }}>Maximum 2 semaines</p>
                  </div>
                </div>

                <div style={{ ...styles.field, marginTop: "0.5rem" }}>
                  <label style={styles.label}>Commentaire (facultatif)</label>
                  <textarea style={{ ...styles.input, minHeight: "80px", resize: "vertical" }} name="commentaire" value={form.commentaire} onChange={handleChange} placeholder="Besoin particulier, question sur le jeu…" />
                </div>

                <button type="submit" style={styles.submitBtn} disabled={saving}>
                  {saving ? "Enregistrement…" : "✉️  Envoyer ma demande de réservation"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ===== LISTE ===== */}
        {view === "liste" && (
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1f94a2" }}>
                Toutes les réservations <span style={{ fontSize: "0.9rem", color: "#888", fontWeight: 400 }}>({reservations.length})</span>
              </h2>
              <select style={{ ...styles.input, width: "auto", minWidth: "200px" }} value={filterJeu} onChange={e => setFilterJeu(e.target.value)}>
                <option value="">Tous les jeux</option>
                {Object.values(JEUX).flat().map(j => <option key={j}>{j}</option>)}
              </select>
            </div>
            {filteredRes.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center", padding: "2rem" }}>Aucune réservation pour l'instant.</p>
            ) : [...filteredRes].sort((a,b) => new Date(a.date_retrait) - new Date(b.date_retrait)).map(r => (
              <div key={r.id} style={{ ...styles.resCard, borderColor: jeuColor(r.jeu) }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <span style={styles.badge(jeuColor(r.jeu))}>{r.jeu}</span>
                    <div style={{ marginTop: "0.4rem", fontWeight: 600 }}>{r.prenom} {r.nom}</div>
                    <div style={{ fontSize: "0.82rem", color: "#555" }}>📅 {formatDate(r.date_retrait)} → {formatDate(r.date_retour)}</div>
                    {r.adhesion && <div style={{ fontSize: "0.78rem", color: "#888", marginTop: "0.2rem" }}>{r.adhesion === "oui" ? "✅ Adhérent" : "🆕 Souhaite adhérer"}</div>}
                    {r.commentaire && <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.3rem", fontStyle: "italic" }}>"{r.commentaire}"</div>}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#888", textAlign: "right" }}>
                    <div>{r.email}</div>
                    <div>{r.telephone}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
