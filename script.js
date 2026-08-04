"const startButton = document.querySelector("#startButton");
const flow = document.querySelector("#flow");
const volume = document.querySelector("#volume");
const flowValue = document.querySelector("#flowValue");
const volumeValue = document.querySelector("#volumeValue");
const statusText = document.querySelector("#status");
const soundCircle = document.querySelector("#soundCircle");

let audioContext;
let oscillator;
let gain;
let filter;
let playing = false;

function startAudio() {
  audioContext = new AudioContext();

  oscillator = audioContext.createOscillator();
  gain = audioContext.createGain();
  filter = audioContext.createBiquadFilter();

  oscillator.type = "sine";
  oscillator.frequency.value = 120;

  filter.type = "lowpass";
  filter.frequency.value = 700;

  gain.gain.value = 0;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
}

function updateSound() {
  flowValue.textContent = flow.value + "%";
  volumeValue.textContent = volume.value + "%";

  const flowAmount = Number(flow.value) / 100;
  const volumeAmount = Number(volume.value) / 100;

  soundCircle.style.transform = `scale(${0.85 + flowAmount * 0.25})`;
  soundCircle.style.opacity = 0.6 + volumeAmount * 0.4;

  if (!audioContext) return;

  const now = audioContext.currentTime;

  oscillator.frequency.setTargetAtTime(
    90 + flowAmount * 100,
    now,
    0.3
  );

  filter.frequency.setTargetAtTime(
    400 + flowAmount * 1200,
    now,
    0.3
  );

  gain.gain.setTargetAtTime(
    playing ? volumeAmount * 0.25 : 0,
    now,
    0.5
  );
}

async function toggleSound() {
  if (!audioContext) {
    startAudio();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  playing = !playing;

  startButton.textContent = playing ? "Stop Sound" : "Start Sound";
  statusText.textContent = playing ? "Sound is playing." : "Sound is stopped.";
  soundCircle.classList.toggle("active", playing);

  updateSound();
}

startButton.addEventListener("click", toggleSound);
flow.addEventListener("input", updateSound);
volume.addEventListener("input", updateSound);

updateSound();
"""

(base / "design.html").write_text(html, encoding="utf-8")
(base / "styles.css").write_text(css, encoding="utf-8")
(base / "script.js").write_text(js, encoding="utf-8")
(base / "images" / "README.txt").write_text(
    "Put these images here:\n"
    "ambient-chaos.png\n"
    "patatap.png\n"
    "tone-matrix.png\n"
    "spectrogram.png\n",
    encoding="utf-8"
)

zip_path = Path("/mnt/data/grainmeditate-simple.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for file in base.rglob("*"):
        if file.is_file():
            z.write(file, file.relative_to(base))

print(zip_path)