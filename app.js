const STORAGE_KEY = "fighterTreinos";

let treinos = JSON.parse(localStorage.getItem(STORAGE_KEY)) ||
Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  nome: `Treino ${i + 1}`,
  exercicios: [
    {
      nome: "Agachamento",
      video: "videos/agachamento.mp4",
      series: 3,
      reps: 12,
      carga: "20kg"
    },
    {
      nome: "Flexão",
      video: "videos/flexao.mp4",
      series: 3,
      reps: 10,
      carga: "Peso corporal"
    }
  ]
}));

const treinoSelect = document.getElementById("treinoSelect");
const treinoAtivo = document.getElementById("treinoAtivo");
const exerciciosDiv = document.getElementById("exercicios");
const progressoDiv = document.getElementById("progresso");
const titulo = document.getElementById("treinoTitulo");

let progresso = {};
let timerInterval = null;

/* ---------- INICIAL ---------- */

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(treinos));
}

function carregarTreinos() {
  treinoSelect.innerHTML = "";
  treinos.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = t.nome;
    treinoSelect.appendChild(opt);
  });
}

carregarTreinos();

/* ---------- TREINO ---------- */

function iniciarTreino() {
  const treino = treinos[treinoSelect.value];
  titulo.textContent = treino.nome;
  exerciciosDiv.innerHTML = "";
  progresso = {};

  treino.exercicios.forEach((ex, i) => {
    progresso[i] = Array(ex.series).fill(false);

    const div = document.createElement("div");
    div.className = "exercise";

    div.innerHTML = `
      <h3>${ex.nome}</h3>

      ${ex.video ? `
        <video src="${ex.video}" controls loop></video>
        <button onclick="removerVideo(${treinoSelect.value}, ${i})">REMOVER VÍDEO</button>
      ` : `<p>📴 Sem vídeo</p>`}

      <p>${ex.series} x ${ex.reps} • ${ex.carga}</p>

      <div class="series">
        ${Array.from({ length: ex.series }, (_, s) => `
          <label>
            <input type="checkbox" onchange="marcarSerie(${i}, ${s})">
            Série ${s + 1}
          </label>
        `).join("")}
      </div>

      <div class="timer">
        <button onclick="iniciarTimer(30)">30s</button>
        <button onclick="iniciarTimer(60)">60s</button>
        <button onclick="iniciarTimer(90)">90s</button>
        <span id="timerDisplay"></span>
      </div>
    `;

    exerciciosDiv.appendChild(div);
  });

  treinoAtivo.classList.remove("hidden");
  atualizarProgresso();
}

function finalizarTreino() {
  alert("🔥 TREINO FINALIZADO 🔥");
  treinoAtivo.classList.add("hidden");
}

/* ---------- PROGRESSO ---------- */

function marcarSerie(ex, s) {
  progresso[ex][s] = !progresso[ex][s];
  atualizarProgresso();
}

function atualizarProgresso() {
  const total = Object.values(progresso).flat().length;
  const feitas = Object.values(progresso).flat().filter(v => v).length;
  progressoDiv.textContent =
    total ? `Progresso: ${Math.round((feitas / total) * 100)}%` : "";
}

/* ---------- TIMER ---------- */

function iniciarTimer(segundos) {
  clearInterval(timerInterval);
  let restante = segundos;
  const display = document.getElementById("timerDisplay");

  timerInterval = setInterval(() => {
    display.textContent = `⏱️ ${restante}s`;
    restante--;

    if (restante < 0) {
      clearInterval(timerInterval);
      display.textContent = "🔥 FIGHT! 🔥";
    }
  }, 1000);
}

/* ---------- REMOÇÕES ---------- */

function removerVideo(treinoIndex, exercicioIndex) {
  treinos[treinoIndex].exercicios[exercicioIndex].video = null;
  salvar();
  iniciarTreino();
}

function excluirTreino() {
  if (!confirm("Excluir este treino permanentemente?")) return;
  treinos.splice(treinoSelect.value, 1);
  salvar();
  carregarTreinos();
  treinoAtivo.classList.add("hidden");
}
