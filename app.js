let exercises = [];
let seconds = 0;
let timerInterval = null;

// carregar vídeos do JSON
fetch('videos/videos.json')
  .then(res => res.json())
  .then(videos => {
    const select = document.getElementById('videoSelect');
    videos.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  });

function addExercise() {
  const name = exName.value;
  const series = exSeries.value;
  const reps = exReps.value;
  const load = exLoad.value;
  const video = videoSelect.value;

  if (!name) return;

  exercises.push({ name, series, reps, load, video });
  renderExercises();

  exName.value = '';
  exSeries.value = '';
  exReps.value = '';
  exLoad.value = '';
}

function renderExercises() {
  const list = document.getElementById('exerciseList');
  list.innerHTML = '';

  exercises.forEach((ex, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${ex.name}</strong><br>
      ${ex.series}x${ex.reps} | ${ex.load}<br>
      <button onclick="playVideo('${ex.video}')">▶️ Ver exercício</button>
      <button onclick="removeExercise(${i})">❌</button>
    `;
    list.appendChild(li);
  });
}

function playVideo(file) {
  const player = document.getElementById('player');
  player.src = `videos/${file}`;
  player.play();
}

function removeExercise(index) {
  exercises.splice(index, 1);
  renderExercises();
}

// cronômetro
function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    return;
  }

  timerInterval = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    timer.textContent = `${m}:${s}`;
  }, 1000);
}

