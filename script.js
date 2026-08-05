const testButton = document.querySelector("#testButton");
const playButton = document.querySelector("#playButton");
const flow = document.querySelector("#flow");
const volume = document.querySelector("#volume");
const circle = document.querySelector("#circle");
const statusText = document.querySelector("#status");
const flowValue = document.querySelector("#flowValue");
const volumeValue = document.querySelector("#volumeValue");

let audioContext;
let masterGain;
let oscillators = [];
let playing = false;

function getAudioContext() {
  if (!audioContext) {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioClass();
  }

  return audioContext;
}

async function resumeAudio() {
  const context = getAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }

  return context;
}

async function playTestSound() {
  try {
    const context = await resumeAudio();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.frequency.value = 440;
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.6);

    statusText.textContent = "Test sound played.";
  } catch (error) {
    statusText.textContent = "Audio could not start. Check browser sound settings.";
  }
}

function createAmbientSound(context) {
  masterGain = context.createGain();
  masterGain.gain.value = 0;

  [110, 165, 220].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = index === 1 ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = [0.5, 0.18, 0.08][index];

    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start();

    oscillators.push(oscillator);
  });

  masterGain.connect(context.destination);
}

function updateSound() {
  flowValue.textContent = flow.value + "%";
  volumeValue.textContent = volume.value + "%";

  if (!audioContext || oscillators.length === 0) return;

  const flowAmount = Number(flow.value) / 100;
  const volumeAmount = Number(volume.value) / 100;
  const frequencies = [
    90 + flowAmount * 100,
    135 + flowAmount * 140,
    180 + flowAmount * 180
  ];

  oscillators.forEach((oscillator, index) => {
    oscillator.frequency.setTargetAtTime(
      frequencies[index],
      audioContext.currentTime,
      0.1
    );
  });

  masterGain.gain.setTargetAtTime(
    playing ? volumeAmount * 0.3 : 0,
    audioContext.currentTime,
    0.1
  );
}

async function toggleAmbientSound() {
  try {
    const context = await resumeAudio();

    if (oscillators.length === 0) {
      createAmbientSound(context);
    }

    playing = !playing;
    playButton.textContent = playing
      ? "Stop Ambient Sound"
      : "Start Ambient Sound";
    statusText.textContent = playing
      ? "Ambient sound is playing."
      : "Sound is stopped.";
    circle.classList.toggle("playing", playing);

    updateSound();
  } catch (error) {
    statusText.textContent = "Audio could not start. Try Chrome or Edge.";
  }
}

testButton.addEventListener("click", playTestSound);
playButton.addEventListener("click", toggleAmbientSound);
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

zip_path = Path("/mnt/data/grainmeditate-expanded-audio.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for file in base.rglob("*"):
        if file.is_file():
            z.write(file, file.relative_to(base))

print(zip_path)