const button = document.querySelector("#playButton");
const flow = document.querySelector("#flow");
const volume = document.querySelector("#volume");
const circle = document.querySelector("#circle");
const statusText = document.querySelector("#status");
const flowValue = document.querySelector("#flowValue");
const volumeValue = document.querySelector("#volumeValue");

let audio;
let oscillator;
let gain;
let playing = false;

function createSound() {
  audio = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audio.createOscillator();
  gain = audio.createGain();

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.connect(audio.destination);
  gain.gain.value = 0;
  oscillator.start();
}

function updateSound() {
  flowValue.textContent = flow.value + "%";
  volumeValue.textContent = volume.value + "%";

  if (!audio) return;

  oscillator.frequency.value = 120 + Number(flow.value) * 2;
  gain.gain.value = playing ? Number(volume.value) / 220 : 0;
}

async function toggleSound() {
  if (!audio) createSound();
  if (audio.state === "suspended") await audio.resume();

  playing = !playing;
  button.textContent = playing ? "Stop Sound" : "Start Sound";
  statusText.textContent = playing ? "Sound is playing." : "Sound is stopped.";
  circle.classList.toggle("playing", playing);
  updateSound();
}

button.addEventListener("click", toggleSound);
flow.addEventListener("input", updateSound);
volume.addEventListener("input", updateSound);

updateSound();
"""

(base / "design.html").write_text(html, encoding="utf-8")
(base / "styles.css").write_text(css, encoding="utf-8")
(base / "script.js").write_text(js, encoding="utf-8")
(base / "images" / "README.txt").write_text(
    "Add these screenshots:\n"
    "ambient-chaos.png\n"
    "patatap.png\n"
    "tone-matrix.png\n"
    "spectrogram.png\n",
    encoding="utf-8"
)

zip_path = Path("/mnt/data/grainmeditate-rewritten.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for file in base.rglob("*"):
        if file.is_file():
            z.write(file, file.relative_to(base))

print(zip_path)