/* ===== STATE ===== */
const state = {
  nama: "",
  usia: "",
  gender: "",
  likertAnswers: {},
  currentForest: null,
  sessionActive: false,
  sessionTimer: null,
  sessionSeconds: 720, // 12 menit
  affectiveInterval: null,
  currentAffective: "Tenang",
};

/* ===== NAVIGASI SCREEN ===== */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById("screen-" + id);
  if (el) el.classList.add("active");
  window.scrollTo(0, 0);
}

/* ===== ONBOARDING ===== */
function nextStep(step) {
  // Validasi step 1
  if (step === 2) {
    const nama = document.getElementById("input-nama").value.trim();
    const usia = document.getElementById("input-usia").value.trim();
    if (!nama || !usia) { alert("Isi nama dan usia terlebih dahulu."); return; }
    if (usia < 15 || usia > 24) { alert("Usia harus 15–24 tahun."); return; }
    state.nama = nama;
    state.usia = usia;
    state.gender = document.getElementById("input-gender").value;
  }

  // Validasi step 2
  if (step === 3) {
    const answered = document.querySelectorAll(".likert button.selected").length;
    if (answered < 3) { alert("Jawab semua pertanyaan terlebih dahulu."); return; }
  }

  // Update tampilan step
  document.querySelectorAll(".step-content").forEach(c => c.classList.remove("active"));
  const target = document.getElementById("step-" + step);
  if (target) target.classList.add("active");

  document.querySelectorAll(".onboarding-steps .step").forEach(s => {
    s.classList.toggle("active", parseInt(s.dataset.step) <= step);
  });

  // Simulasi kalibrasi sensor
  if (step === 3) {
    simulateSensorCalibration();
  }
}

function selectLikert(btn, value) {
  const parent = btn.parentElement;
  parent.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  const qIndex = Array.from(document.querySelectorAll(".question")).indexOf(parent.closest(".question"));
  state.likertAnswers[qIndex] = value;
}

function simulateSensorCalibration() {
  const status = document.getElementById("sensor-status");
  const messages = ["Menghubungkan sensor...", "Membaca detak jantung...", "Membaca GSR...", "Sensor siap ✓"];
  let i = 0;
  const interval = setInterval(() => {
    status.textContent = messages[i];
    i++;
    if (i >= messages.length) clearInterval(interval);
  }, 800);
}

function startApp() {
  document.getElementById("greeting-name").textContent = "Halo, " + state.nama + "!";
  document.getElementById("settings-nama").textContent = state.nama;
  document.getElementById("settings-usia").textContent = state.usia + " tahun";
  showScreen("dashboard");
}

/* ===== SESI VR ===== */
function startSession(forest) {
  state.currentForest = forest;
  showScreen("session");
  document.getElementById("session-picker").classList.add("hidden");
  document.getElementById("session-active").classList.remove("hidden");
  document.getElementById("session-feedback").classList.add("hidden");
  document.getElementById("session-title").textContent = "Sesi: " + capitalize(forest);