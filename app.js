/**
 * INVITO 18° COMPLEANNO SOFIA — JAVASCRIPT MULTI-PAGINA
 * Pagine: 1. Busta -> 2. Invito & Data -> 3. Location -> 4. Dress Code -> 5. RSVP
 * Nessuna musica, solo Sofia, navigazione interattiva.
 */

const DEFAULT_CONFIG = {
  celebrantName: "Sofia",
  monogram: "S",
  eventType: "Al Mio 18° Compleanno",
  archHeader: "SEI STATO INVITATO",
  envelopeInstruction: "Tocca sulla busta<br>per aprire l'invito",
  heroSubtitle: "Vi Aspetto Con Gioia",
  heroQuote: "Un giorno speciale merita di essere condiviso con le persone che rendono la vita ancora più bella. I miei 18 anni sono un’occasione unica, un ricordo che desidero portare per sempre nel cuore. Vi aspetto per festeggiare insieme una serata piena di emozioni e felicità, che porterò per sempre tra i ricordi più belli della mia vita.",
  eventDateString: "2026-12-29T20:30:00",
  eventDateDisplay: "Martedì 29 Dicembre 2026",
  eventTimeDisplay: "Ore 20:30",
  locationName: "Casa Resta",
  locationAddress: "Superstrada Taranto/Brindisi, SS7, 72021 Francavilla Fontana (BR)",
  locationDescription: "Una splendida ed elegante dimora storica, cornice esclusiva e raffinata per brindare e festeggiare insieme sotto le stelle.",
  mapsUrl: "https://maps.app.goo.gl/pUup5wyynbFS5DEdA?g_st=iw",
  dressCodeTitle: "Dress Code",
  dressCodeText: "È gradito un abbigliamento elegante e raffinato. Per chi desidera, un tocco di colore in armonia con la nostra palette (Bordeaux, Oro, Nero o Argento).",
  rsvpDeadline: "SI PREGA DI DARE GENTILE CONFERMA ENTRO IL 20 NOVEMBRE 2026.",
  googleSheetUrl: "https://script.google.com/macros/s/AKfycbzB3ERwQKiDwcZEijCt7UWPaeF3PKwRSp4RBkeVf3KOotTNBDbnGkc4rgY1eFbSJJFi/exec",
  whatsappNumber: "393401234567",
  closingQuote: "La tua presenza renderà questa serata davvero magica e indimenticabile. Non vedo l'ora di festeggiare con te!"
};

let appConfig = {};

function loadConfig() {
  try {
    localStorage.removeItem("luxury_invitation_config");
    localStorage.removeItem("sofia_18_invitation_config");

    const saved = localStorage.getItem("sofia_18_multipage_config");
    if (saved) {
      appConfig = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      // Aggiorna URL Google Sheet
      appConfig.googleSheetUrl = DEFAULT_CONFIG.googleSheetUrl;
      // Migrazione automatica se erano presenti data o location di prova precedenti
      if (!appConfig.eventDateDisplay || appConfig.eventDateDisplay.includes("Giugno") || appConfig.eventDateDisplay === "Sabato 24 Giugno 2026") {
        appConfig.eventDateString = DEFAULT_CONFIG.eventDateString;
        appConfig.eventDateDisplay = DEFAULT_CONFIG.eventDateDisplay;
        appConfig.eventTimeDisplay = DEFAULT_CONFIG.eventTimeDisplay;
        appConfig.rsvpDeadline = DEFAULT_CONFIG.rsvpDeadline;
      }
      if (appConfig.locationName === "Villa Rosa Ricevimenti") {
        appConfig.locationName = DEFAULT_CONFIG.locationName;
        appConfig.locationAddress = DEFAULT_CONFIG.locationAddress;
        appConfig.locationDescription = DEFAULT_CONFIG.locationDescription;
        appConfig.mapsUrl = DEFAULT_CONFIG.mapsUrl;
      }
      if (!appConfig.heroQuote || appConfig.heroQuote.includes("I miei primi 18 anni")) {
        appConfig.heroQuote = DEFAULT_CONFIG.heroQuote;
      }
      if (!appConfig.rsvpDeadline || !appConfig.rsvpDeadline.startsWith("SI PREGA") || appConfig.rsvpDeadline.includes("25 NOVEMBRE")) {
        appConfig.rsvpDeadline = DEFAULT_CONFIG.rsvpDeadline;
      }
      if (!appConfig.eventType || appConfig.eventType === "Il Mio 18° Compleanno") {
        appConfig.eventType = DEFAULT_CONFIG.eventType;
      }
    } else {
      appConfig = { ...DEFAULT_CONFIG };
    }
  } catch (e) {
    appConfig = { ...DEFAULT_CONFIG };
  }
}

function saveConfig(newConfig) {
  appConfig = { ...appConfig, ...newConfig };
  try {
    localStorage.setItem("sofia_18_multipage_config", JSON.stringify(appConfig));
  } catch (e) {
    console.warn("LocalStorage save error", e);
  }
  applyConfigToDOM();
}

function resetConfig() {
  localStorage.removeItem("sofia_18_multipage_config");
  appConfig = { ...DEFAULT_CONFIG };
  applyConfigToDOM();
}

function applyConfigToDOM() {
  // Monogram & Name
  document.querySelectorAll(".dyn-monogram").forEach(el => el.textContent = appConfig.monogram);
  document.querySelectorAll(".dyn-name").forEach(el => el.textContent = appConfig.celebrantName);
  document.querySelectorAll(".dyn-event-type").forEach(el => el.textContent = appConfig.eventType);

  // Arch Header & Envelope Text
  const archHeaderEl = document.getElementById("dynArchHeader");
  if (archHeaderEl) archHeaderEl.textContent = appConfig.archHeader;

  const envInstrEl = document.getElementById("dynEnvelopeInstruction");
  if (envInstrEl) envInstrEl.innerHTML = appConfig.envelopeInstruction;

  // Hero Section
  const heroSubEl = document.getElementById("dynHeroSubtitle");
  if (heroSubEl) heroSubEl.textContent = appConfig.heroSubtitle;

  const heroQuoteEl = document.getElementById("dynHeroQuote");
  if (heroQuoteEl) heroQuoteEl.textContent = appConfig.heroQuote;

  // Date & Time
  const dateEl = document.getElementById("dynDateDisplay");
  if (dateEl) dateEl.textContent = appConfig.eventDateDisplay;

  const timeEl = document.getElementById("dynTimeDisplay");
  if (timeEl) timeEl.textContent = appConfig.eventTimeDisplay;

  // Location
  const locNameEl = document.getElementById("dynLocationName");
  if (locNameEl) locNameEl.textContent = appConfig.locationName;

  const locAddrEl = document.getElementById("dynLocationAddress");
  if (locAddrEl) locAddrEl.textContent = appConfig.locationAddress;

  const locDescEl = document.getElementById("dynLocationDescription");
  if (locDescEl) locDescEl.textContent = appConfig.locationDescription;

  // Google Maps Links
  const mapsLink = appConfig.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${appConfig.locationName}, ${appConfig.locationAddress}`)}`;

  const mapsBtn = document.getElementById("googleMapsLinkBtn");
  if (mapsBtn) mapsBtn.href = mapsLink;

  const locLink = document.getElementById("dynLocationNameLink");
  if (locLink) locLink.href = mapsLink;

  const mapIframe = document.getElementById("googleMapsIframe");
  if (mapIframe) {
    const embedQuery = encodeURIComponent(`${appConfig.locationName}, ${appConfig.locationAddress}`);
    mapIframe.src = `https://maps.google.com/maps?q=${embedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // Dress Code
  const dcTitleEl = document.getElementById("dynDressCodeTitle");
  if (dcTitleEl) dcTitleEl.textContent = appConfig.dressCodeTitle;

  const dcTextEl = document.getElementById("dynDressCodeText");
  if (dcTextEl) dcTextEl.textContent = appConfig.dressCodeText;

  // RSVP WhatsApp
  const rsvpDeadlineEl = document.getElementById("dynRsvpDeadline");
  if (rsvpDeadlineEl) rsvpDeadlineEl.textContent = appConfig.rsvpDeadline;

  // Closing Quote
  const closingEl = document.getElementById("dynClosingQuote");
  if (closingEl) closingEl.textContent = appConfig.closingQuote;
}

// ==========================================================================
// FUNZIONI MODULO DI CONFERMA RSVP INTERATTIVO
// ==========================================================================
function toggleIntoleranceField() {
  const check = document.getElementById("rsvpHasIntolerance");
  const wrapper = document.getElementById("rsvpIntoleranceDetailWrapper");
  const input = document.getElementById("rsvpIntolleranze");
  if (wrapper && check) {
    if (check.checked) {
      wrapper.style.display = "block";
      if (input) input.focus();
    } else {
      wrapper.style.display = "none";
      if (input) input.value = "";
    }
  }
}

function handleAttendanceChange() {
  const attendance = document.querySelector('input[name="rsvpAttendance"]:checked')?.value || "yes";
  const intoleranceBox = document.getElementById("rsvpIntoleranceBox");
  if (intoleranceBox) {
    if (attendance === "no") {
      intoleranceBox.style.opacity = "0.45";
      intoleranceBox.style.pointerEvents = "none";
    } else {
      intoleranceBox.style.opacity = "1";
      intoleranceBox.style.pointerEvents = "auto";
    }
  }
}

// Salva e invia la risposta direttamente nel foglio Excel
async function submitRsvpToExcel() {
  const nomeEl = document.getElementById("rsvpNome");
  const cognomeEl = document.getElementById("rsvpCognome");
  const feedbackEl = document.getElementById("rsvpFormFeedback");
  const submitBtn = document.getElementById("rsvpSubmitBtn");
  const successBox = document.getElementById("rsvpSuccessBox");
  const formEl = document.getElementById("rsvpForm");

  const nome = nomeEl ? nomeEl.value.trim() : "";
  const cognome = cognomeEl ? cognomeEl.value.trim() : "";
  const attendance = document.querySelector('input[name="rsvpAttendance"]:checked')?.value || "yes";
  const hasIntolerance = document.getElementById("rsvpHasIntolerance")?.checked;
  const intolleranze = document.getElementById("rsvpIntolleranze")?.value.trim();

  // Validazione campi obbligatori
  if (!nome || !cognome) {
    if (feedbackEl) {
      feedbackEl.textContent = "⚠️ Per favore, inserisci sia il tuo Nome che il Cognome.";
      feedbackEl.style.display = "block";
    }
    if (!nome && nomeEl) nomeEl.focus();
    else if (!cognome && cognomeEl) cognomeEl.focus();
    return;
  }

  // Se l'ospite ha spuntato di avere intolleranze ma ha lasciato vuoto il campo di specifica
  if (hasIntolerance && !intolleranze) {
    if (feedbackEl) {
      feedbackEl.textContent = "⚠️ Per favore, specifica che tipo di intolleranza hai (es. celiachia, lattosio...).";
      feedbackEl.style.display = "block";
    }
    const intolEl = document.getElementById("rsvpIntolleranze");
    if (intolEl) intolEl.focus();
    return;
  }

  if (feedbackEl) {
    feedbackEl.style.display = "none";
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Registrazione in corso...`;
  }

  // Valore del Tipo di Intolleranza: se ha intolleranze scrive il tipo (es. "Celiachia"), altrimenti "No"
  const tipoIntolleranzaVal = hasIntolerance ? (intolleranze || "Sì") : "No";

  const record = {
    timestamp: new Date().toLocaleString("it-IT"),
    nome: nome,
    cognome: cognome,
    attendance: attendance,
    presenza: attendance === "yes" ? "Sì" : "No",
    intolleranze: tipoIntolleranzaVal,
    intolleranzeSiNo: hasIntolerance ? "Sì" : "No",
    tipoIntolleranza: tipoIntolleranzaVal,
    dettaglioIntolleranze: tipoIntolleranzaVal,
    hasIntolerance: !!hasIntolerance
  };

  // 1. Salva sempre nel localStorage del browser (backup garantito)
  try {
    let savedList = JSON.parse(localStorage.getItem("sofia_rsvp_guests") || "[]");
    savedList.push(record);
    localStorage.setItem("sofia_rsvp_guests", JSON.stringify(savedList));
  } catch (e) {
    console.warn("Errore salvataggio locale", e);
  }

  // 2. Invia al Foglio Google (se configurato)
  const googleSheetUrl = appConfig.googleSheetUrl || "";
  if (googleSheetUrl) {
    try {
      await fetch(googleSheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
      });
      console.log("Invio al Foglio Google completato con successo!");
    } catch (gErr) {
      console.warn("Errore invio Foglio Google", gErr);
    }
  }

  // 3. Invia alla nostra API locale (server.py) che scrive direttamente in conferme_invitati.csv
  try {
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    });
  } catch (err) {
    console.log("Registrazione completata (client-side/server sync)", err);
  }

  // 4. Mostra schermata di conferma con messaggio affettuoso
  if (formEl) formEl.style.display = "none";
  if (successBox) {
    const titleEl = document.getElementById("rsvpSuccessTitle");
    const descEl = document.getElementById("rsvpSuccessDesc");
    if (titleEl) {
      titleEl.textContent = `Grazie, ${nome}! ✨`;
    }
    if (descEl) {
      if (attendance === "yes") {
        descEl.innerHTML = `Non vedo l'ora di festeggiare con te! 🥂🩷`;
      } else {
        descEl.innerHTML = `Grazie di cuore per avermi avvisata! 💖`;
      }
    }
    successBox.style.display = "block";
  }
}

// Funzione per scaricare il file Excel / CSV con tutte le conferme ricevute
function downloadRsvpExcel() {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem("sofia_rsvp_guests") || "[]");
  } catch (e) {
    list = [];
  }

  if (list.length === 0) {
    window.location.href = "conferme_invitati.csv";
    return;
  }

  // Intestazione CSV formattata con punto e virgola per Microsoft Excel in italiano
  let csvContent = "\uFEFFData Registrazione;Nome;Cognome;Partecipazione;Intolleranze / Allergie\r\n";

  list.forEach(item => {
    const row = [
      `"${item.timestamp || ''}"`,
      `"${item.nome || ''}"`,
      `"${item.cognome || ''}"`,
      `"${item.presenza || ''}"`,
      `"${item.intolleranze || 'Nessuna'}"`
    ].join(";");
    csvContent += row + "\r\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Conferme_Invitati_Sofia_18.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Multi-Page Navigation Engine
function goToPage(targetPageId) {
  const pages = document.querySelectorAll(".page-view");

  pages.forEach(page => {
    if (page.id === targetPageId) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Envelope Interaction on Page 1 (Works reliably on desktop click and mobile touch)
function initEnvelopeOpening() {
  const envelope = document.getElementById("interactiveEnvelope");
  const waxSeal = document.getElementById("waxSeal");
  const instruction = document.getElementById("dynEnvelopeInstruction");

  if (!envelope) return;

  let isOpening = false;

  function triggerOpen(e) {
    if (e) {
      if (e.cancelable && e.type === "touchend") {
        e.preventDefault();
      }
    }
    if (isOpening) return;
    isOpening = true;

    envelope.classList.add("opened");
    if (instruction) instruction.innerHTML = "Apertura invito in corso...";

    // Navigate to Page 2 after 1600ms (dà tempo di ammirare l'apertura della busta)
    setTimeout(() => {
      goToPage("page2Invite");
      isOpening = false;
    }, 1600);
  }

  window.triggerOpen = triggerOpen;

  envelope.addEventListener("click", triggerOpen);
  envelope.addEventListener("touchend", triggerOpen, { passive: false });

  if (waxSeal) {
    waxSeal.addEventListener("click", triggerOpen);
    waxSeal.addEventListener("touchend", triggerOpen, { passive: false });
  }

  if (instruction) {
    instruction.addEventListener("click", triggerOpen);
    instruction.addEventListener("touchend", triggerOpen, { passive: false });
  }
}

// Navigation Buttons Setup
function initPageNavigation() {
  // 3 Piccoli Pulsanti Principali su Pagina 2 (Invito)
  const toLocationBtn = document.getElementById("btnToLocation");
  if (toLocationBtn) {
    toLocationBtn.addEventListener("click", () => goToPage("page3Location"));
  }

  const toDressCodeBtn = document.getElementById("btnToDressCode");
  if (toDressCodeBtn) {
    toDressCodeBtn.addEventListener("click", () => goToPage("page4DressCode"));
  }

  const toRsvpBtn = document.getElementById("btnToRsvp");
  if (toRsvpBtn) {
    toRsvpBtn.addEventListener("click", () => goToPage("page5Rsvp"));
  }

  // Collegamento diretto da Dress Code a RSVP
  const dressCodeToRsvpBtn = document.getElementById("btnDressCodeToRsvp");
  if (dressCodeToRsvpBtn) {
    dressCodeToRsvpBtn.addEventListener("click", () => goToPage("page5Rsvp"));
  }

  // Tutti i pulsanti "Torna all'Invito"
  document.querySelectorAll(".btn-back-to-invite").forEach(btn => {
    btn.addEventListener("click", () => goToPage("page2Invite"));
  });

  // Tasto per riaprire la busta iniziale
  const backToStartBtn = document.getElementById("btnBackToStart");
  if (backToStartBtn) {
    backToStartBtn.addEventListener("click", () => {
      const envelope = document.getElementById("interactiveEnvelope");
      if (envelope) envelope.classList.remove("opened");
      const instruction = document.getElementById("dynEnvelopeInstruction");
      if (instruction) instruction.innerHTML = appConfig.envelopeInstruction || "Tocca sulla busta<br>per aprire l'invito";
      goToPage("page1Envelope");
    });
  }
}

// Customizer Modal Logic
function initCustomizer() {
  const toggleBtn = document.getElementById("settingsToggleBtn");
  const modal = document.getElementById("customizerModal");
  const closeBtn = document.getElementById("customizerCloseBtn");
  const form = document.getElementById("customizerForm");
  const resetBtn = document.getElementById("resetCustomizerBtn");

  if (!toggleBtn || !modal || !form) return;

  function populateForm() {
    const fName = document.getElementById("custName");
    if (fName) fName.value = appConfig.celebrantName || "";

    const fMono = document.getElementById("custMonogram");
    if (fMono) fMono.value = appConfig.monogram || "";

    const fEvent = document.getElementById("custEventType");
    if (fEvent) fEvent.value = appConfig.eventType || "";

    const fDate = document.getElementById("custDateDisplay");
    if (fDate) fDate.value = appConfig.eventDateDisplay || "";

    const fTime = document.getElementById("custTimeDisplay");
    if (fTime) fTime.value = appConfig.eventTimeDisplay || "";

    const fDateISO = document.getElementById("custDateISO");
    if (fDateISO) fDateISO.value = appConfig.eventDateString || "";

    const fLocName = document.getElementById("custLocationName");
    if (fLocName) fLocName.value = appConfig.locationName || "";

    const fLocAddr = document.getElementById("custLocationAddress");
    if (fLocAddr) fLocAddr.value = appConfig.locationAddress || "";

    const fMapsUrl = document.getElementById("custMapsUrl");
    if (fMapsUrl) fMapsUrl.value = appConfig.mapsUrl || "";

    const fLocDesc = document.getElementById("custLocationDesc");
    if (fLocDesc) fLocDesc.value = appConfig.locationDescription || "";

    const fDress = document.getElementById("custDressCode");
    if (fDress) fDress.value = appConfig.dressCodeText || "";

    const fWA = document.getElementById("custWhatsApp");
    if (fWA) fWA.value = appConfig.whatsappNumber || "";

    const fGoogle = document.getElementById("custGoogleSheet");
    if (fGoogle) fGoogle.value = appConfig.googleSheetUrl || "";

    const fQuote = document.getElementById("custClosingQuote");
    if (fQuote) fQuote.value = appConfig.closingQuote || "";
  }

  toggleBtn.addEventListener("click", () => {
    populateForm();
    modal.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const updated = {
      celebrantName: (document.getElementById("custName")?.value || "").trim(),
      monogram: (document.getElementById("custMonogram")?.value || "").trim(),
      eventType: (document.getElementById("custEventType")?.value || "").trim(),
      eventDateDisplay: (document.getElementById("custDateDisplay")?.value || "").trim(),
      eventTimeDisplay: (document.getElementById("custTimeDisplay")?.value || "").trim(),
      eventDateString: (document.getElementById("custDateISO")?.value || "").trim(),
      locationName: (document.getElementById("custLocationName")?.value || "").trim(),
      locationAddress: (document.getElementById("custLocationAddress")?.value || "").trim(),
      mapsUrl: (document.getElementById("custMapsUrl")?.value || "").trim() || DEFAULT_CONFIG.mapsUrl,
      locationDescription: (document.getElementById("custLocationDesc")?.value || "").trim(),
      dressCodeText: (document.getElementById("custDressCode")?.value || "").trim(),
      closingQuote: (document.getElementById("custClosingQuote")?.value || "").trim(),
      googleSheetUrl: (document.getElementById("custGoogleSheet")?.value || "").trim(),
      whatsappNumber: (document.getElementById("custWhatsApp")?.value || "").trim()
    };

    saveConfig(updated);
    modal.classList.remove("active");
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Vuoi ripristinare i dati predefiniti di Sofia?")) {
        resetConfig();
        populateForm();
        modal.classList.remove("active");
      }
    });
  }
}

// Subtle Stardust Particle Canvas
function initParticles() {
  const canvas = document.getElementById("particlesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 45;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: Math.random() * -0.5 - 0.15,
      opacity: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.03 + 0.01
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < 0) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      p.opacity += p.pulse;
      if (p.opacity > 0.85 || p.opacity < 0.2) {
        p.pulse = -p.pulse;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 208, 106, ${Math.max(0, Math.min(1, p.opacity))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(212, 175, 55, 0.7)";
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  loadConfig();
  applyConfigToDOM();
  initParticles();
  initEnvelopeOpening();
  initPageNavigation();
  initCustomizer();
});
