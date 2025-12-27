// ===== BASE EXISTENTE =====
const treinoSelect = document.getElementById("treinoSelect");
const listaExercicios = document.getElementById("listaExercicios");
const treinoExecucao = document.getElementById("treinoExecucao");
let videos = [];
let treinoAtual = null;

// ===== INICIALIZA =====
initTreinos();
carregarVideos();
renderTreinos();
initHistorico();

function initTreinos() {
  if (!localStorage.getItem("treinos")) {
    const treinos = {};
    for (let i = 1; i <= 30; i++) treinos[i] = [];
    localStorage.setItem("treinos", JSON.stringify(treinos));
  }
}

function initHistorico() {
  if (!localStorage.getItem("historicoTreinos")) {
    localStorage.setItem("historicoTreinos", JSON.stringify([]));
  }
}

function carregarVideos() {
  fetch("videos/videos.json")
    .then(r => r.json())
    .then(d => videos = d);
}

function getTreinos() {
  return JSON.parse(localStorage.getItem("treinos"));
}
function salvarTreinos(t) {
  localStorage.setItem("treinos", JSON.stringify(t));
}

// ===== TREINOS =====
function renderTreinos() {
  treinoSelect.innerHTML = "";
  for (let i = 1; i <= 30; i++) {
    treinoSelect.innerHTML += `<option value="${i}">Treino ${i}</option>`;
  }
  treinoSelect.onchange = renderExercicios;
  renderExercicios();
}

function excluirTreino() {
  if (!confirm("Limpar este treino?")) return;
  const t = getTreinos();
  t[treinoSelect.value] = [];
  salvarTreinos(t);
  renderExercicios();
}

// ===== EXERCÍCIOS =====
function novoExercicio() {
  const t = getTreinos();
  t[treinoSelect.value].push({ nome:"", series:"", reps:"", carga:"", video:"" });
  salvarTreinos(t);
  renderExercicios();
}

function editar(i, campo, val) {
  const t = getTreinos();
  t[treinoSelect.value][i][campo] = val;
  salvarTreinos(t);
  renderExercicios();
}

function remover(i) {
  const t = getTreinos();
  t[treinoSelect.value].splice(i,1);
  salvarTreinos(t);
  renderExercicios();
}

function renderExercicios() {
  listaExercicios.innerHTML = "";
  treinoExecucao.innerHTML = "";
  const exs = getTreinos()[treinoSelect.value];

  exs.forEach((ex,i)=>{
    listaExercicios.innerHTML += `
      <div class="exercise">
        <input value="${ex.nome}" placeholder="Exercício" onchange="editar(${i},'nome',this.value)">
        <input value="${ex.series}" placeholder="Séries" onchange="editar(${i},'series',this.value)">
        <input value="${ex.reps}" placeholder="Reps" onchange="editar(${i},'reps',this.value)">
        <input value="${ex.carga}" placeholder="Carga" onchange="editar(${i},'carga',this.value)">
        <select onchange="editar(${i},'video',this.value)">
          <option value="">Vídeo</option>
          ${videos.map(v=>`<option ${v===ex.video?"selected":""}>${v}</option>`).join("")}
        </select>
        <button onclick="remover(${i})">🗑️</button>
      </div>
    `;
  });
}

// ===== TREINO ATIVO =====
function iniciarTreino() {
  treinoAtual = {
    treino: treinoSelect.value,
    data: new Date().toISOString(),
    exercicios: getTreinos()[treinoSelect.value]
  };
  treinoExecucao.innerHTML = treinoAtual.exercicios.map(e =>
    `<h3>${e.nome}</h3>${e.video?`<video src="videos/${e.video}" controls width="300"></video>`:""}`
  ).join("");
}

// ===== FINALIZAR / HISTÓRICO =====
function finalizarTreino() {
  if (!treinoAtual) return;
  const hist = JSON.parse(localStorage.getItem("historicoTreinos"));
  const calorias = treinoAtual.exercicios.length * 50;
  hist.push({...treinoAtual, calorias});
  localStorage.setItem("historicoTreinos", JSON.stringify(hist));
  alert("Treino salvo!");
  renderGraficos();
}

// ===== CRONÔMETRO =====
let timer, segundos=0;
function startTimer(){
  timer=setInterval(()=>{segundos++;document.getElementById("tempo").innerText=format(segundos)},1000);
}
function pauseTimer(){clearInterval(timer);}
function resetTimer(){segundos=0;document.getElementById("tempo").innerText="00:00";}
function format(s){return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`}

// ===== GRÁFICOS =====
function renderGraficos() {
  const hist = JSON.parse(localStorage.getItem("historicoTreinos"));
  const dias = {};
  hist.forEach(h=>{
    const d=h.data.split("T")[0];
    dias[d]=(dias[d]||0)+1;
  });

  new Chart(document.getElementById("grafTreinos"),{
    type:"bar",
    data:{labels:Object.keys(dias),datasets:[{label:"Treinos",data:Object.values(dias)}]}
  });

  new Chart(document.getElementById("grafCalorias"),{
    type:"line",
    data:{labels:hist.map(h=>h.data.split("T")[0]),
      datasets:[{label:"Calorias",data:hist.map(h=>h.calorias)}]}
  });
}
