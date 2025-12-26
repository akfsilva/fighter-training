const treinoSelect = document.getElementById("treinoSelect");
const listaExercicios = document.getElementById("listaExercicios");
const treinoExecucao = document.getElementById("treinoExecucao");

let videos = [];

// ---------- INICIALIZA ----------
initTreinos();
carregarVideos();
renderTreinos();

function initTreinos() {
  if (!localStorage.getItem("treinos")) {
    const treinos = {};
    for (let i = 1; i <= 30; i++) {
      treinos[i] = [];
    }
    localStorage.setItem("treinos", JSON.stringify(treinos));
  }
}

function carregarVideos() {
  fetch("videos/videos.json")
    .then(r => r.json())
    .then(data => videos = data);
}

// ---------- TREINOS ----------
function renderTreinos() {
  treinoSelect.innerHTML = "";
  for (let i = 1; i <= 30; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Treino ${i}`;
    treinoSelect.appendChild(opt);
  }
  treinoSelect.onchange = renderExercicios;
  renderExercicios();
}

function getTreinos() {
  return JSON.parse(localStorage.getItem("treinos"));
}

function salvarTreinos(treinos) {
  localStorage.setItem("treinos", JSON.stringify(treinos));
}

function excluirTreino() {
  if (!confirm("Excluir TODOS os exercícios deste treino?")) return;
  const treinos = getTreinos();
  treinos[treinoSelect.value] = [];
  salvarTreinos(treinos);
  renderExercicios();
}

// ---------- EXERCÍCIOS ----------
function novoExercicio() {
  const treinos = getTreinos();
  treinos[treinoSelect.value].push({
    nome: "",
    series: "",
    reps: "",
    carga: "",
    video: ""
  });
  salvarTreinos(treinos);
  renderExercicios();
}

function renderExercicios() {
  listaExercicios.innerHTML = "";
  treinoExecucao.innerHTML = "";

  const treinos = getTreinos();
  const exercicios = treinos[treinoSelect.value];

  exercicios.forEach((ex, i) => {
    const div = document.createElement("div");
    div.className = "exercise";
    div.innerHTML = `
      <input placeholder="Exercício" value="${ex.nome}" onchange="editar(${i},'nome',this.value)">
      <input placeholder="Séries" value="${ex.series}" onchange="editar(${i},'series',this.value)">
      <input placeholder="Reps" value="${ex.reps}" onchange="editar(${i},'reps',this.value)">
      <input placeholder="Carga" value="${ex.carga}" onchange="editar(${i},'carga',this.value)">
      <select onchange="editar(${i},'video',this.value)">
        <option value="">Vídeo</option>
        ${videos.map(v => `<option ${v===ex.video?"selected":""}>${v}</option>`).join("")}
      </select>
      <button onclick="remover(${i})">🗑️</button>
      ${ex.video ? `<video src="videos/${ex.video}" controls width="200"></video>` : ""}
    `;
    listaExercicios.appendChild(div);

    if (ex.video) {
      treinoExecucao.innerHTML += `
        <h3>${ex.nome}</h3>
        <video src="videos/${ex.video}" controls width="300"></video>
      `;
    }
  });
}

function editar(i, campo, valor) {
  const treinos = getTreinos();
  treinos[treinoSelect.value][i][campo] = valor;
  salvarTreinos(treinos);
  renderExercicios();
}

function remover(i) {
  const treinos = getTreinos();
  treinos[treinoSelect.value].splice(i,1);
  salvarTreinos(treinos);
  renderExercicios();
}

