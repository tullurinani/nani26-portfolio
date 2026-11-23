import { FaceLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/vision_bundle.mjs";

const video = document.querySelector("#video");
const placeholder = document.querySelector("#placeholder");
const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
const cameraLabel = document.querySelector("#cameraLabel");
const cameraState = document.querySelector("#cameraState");
const statusOrb = document.querySelector("#statusOrb");
const statusTitle = document.querySelector("#statusTitle");
const statusCopy = document.querySelector("#statusCopy");
const timerLabel = document.querySelector("#timer");
const alertCountLabel = document.querySelector("#alertCount");
const modelStatus = document.querySelector("#modelStatus");
document.querySelector("#year").textContent = new Date().getFullYear();

const HOLD_MS = 1800;
const EYE_CLOSED_SCORE = 0.56;
const DETECTION_INTERVAL_MS = 90;

let landmarker = null;
let stream = null;
let animationFrame = null;
let running = false;
let closedSince = null;
let alertedThisEpisode = false;
let alerts = 0;
let lastFrameAt = 0;
let audioContext = null;

function setStatus(title, copy, mode = "normal") {
  statusTitle.textContent = title;
  statusCopy.textContent = copy;
  statusOrb.classList.toggle("alert", mode === "alert");
  cameraState.textContent = mode === "alert" ? "POSSIBLE PROLONGED EYE CLOSURE" : title.toUpperCase();
}

function resetClosure() {
  closedSince = null;
  alertedThisEpisode = false;
  timerLabel.textContent = "0.0s";
}

function getScore(categories, name) {
  const item = categories?.find((entry) => (entry.categoryName || entry.category_name) === name);
  return typeof item?.score === "number" ? item.score : 0;
}

async function loadLandmarker() {
  if (landmarker) return landmarker;
  modelStatus.textContent = "Loading face landmark model…";
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm"
  );
  const base = {
    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
  };
  try {
    landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: { ...base, delegate: "GPU" },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true
    });
  } catch (gpuError) {
    landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: { ...base, delegate: "CPU" },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true
    });
  }
  modelStatus.textContent = "Model ready · processing on this device";
  return landmarker;
}

function playAlert() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext ||= new AudioContextClass();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.42);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.44);
  } catch (error) {
    console.warn("The browser could not play the alert sound.", error);
  }
}

function processFrame(now) {
  if (!running || !landmarker) return;
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && now - lastFrameAt >= DETECTION_INTERVAL_MS) {
    lastFrameAt = now;
    try {
      const result = landmarker.detectForVideo(video, now);
      const blendshapeCategories = result.faceBlendshapes?.[0]?.categories;

      if (!result.faceLandmarks?.length || !blendshapeCategories) {
        resetClosure();
        setStatus("Face not detected", "Move into the camera view and face the camera. Keep your eyes clearly visible.");
      } else {
        const left = getScore(blendshapeCategories, "eyeBlinkLeft");
        const right = getScore(blendshapeCategories, "eyeBlinkRight");
        const eyesClosed = left >= EYE_CLOSED_SCORE && right >= EYE_CLOSED_SCORE;

        if (eyesClosed) {
          closedSince ??= now;
          const elapsed = now - closedSince;
          timerLabel.textContent = (elapsed / 1000).toFixed(1) + "s";
          if (elapsed >= HOLD_MS) {
            if (!alertedThisEpisode) {
              alerts += 1;
              alertCountLabel.textContent = String(alerts);
              playAlert();
              alertedThisEpisode = true;
            }
            setStatus("Possible prolonged eye closure", "Your eyes appear closed for an extended period. This is only an advisory computer-vision result.", "alert");
          } else {
            setStatus("Eyes appear closed", "A short blink is normal. The timer resets when your eyes open.");
          }
        } else {
          resetClosure();
          setStatus("Eyes appear open", "Face detected. Keep your face visible and look naturally toward the camera.");
        }
      }
    } catch (error) {
      console.error(error);
      stopCamera();
      setStatus("Detection stopped", "The video frame could not be processed. Try starting the demo again.");
      modelStatus.textContent = "Detection error";
      return;
    }
  }
  animationFrame = requestAnimationFrame(processFrame);
}

async function startCamera() {
  startBtn.disabled = true;
  startBtn.textContent = "Starting…";
  setStatus("Preparing camera", "Loading the face landmark model and requesting camera permission.");
  try {
    await loadLandmarker();
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Camera access is unavailable. Open this page using HTTPS in a supported browser.");
    }
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 540 } }
    });
    video.srcObject = stream;
    await video.play();
    placeholder.hidden = true;
    video.style.display = "block";
    running = true;
    resetClosure();
    cameraLabel.textContent = "Camera on";
    startBtn.textContent = "Camera running";
    stopBtn.disabled = false;
    setStatus("Camera ready", "Position your face in the frame. Detection starts automatically.");
    animationFrame = requestAnimationFrame(processFrame);
  } catch (error) {
    console.error(error);
    const message = error?.name === "NotAllowedError"
      ? "Camera permission was blocked. Allow camera access in your browser and try again."
      : (error?.message || "Could not start the camera. Check your camera and browser permissions.");
    setStatus("Could not start", message);
    modelStatus.textContent = "Unable to initialise";
    startBtn.disabled = false;
    startBtn.textContent = "Try again";
    cameraLabel.textContent = "Camera off";
  }
}

function stopCamera() {
  running = false;
  if (animationFrame !== null) cancelAnimationFrame(animationFrame);
  animationFrame = null;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  video.pause();
  video.srcObject = null;
  video.style.display = "none";
  placeholder.hidden = false;
  cameraLabel.textContent = "Camera off";
  cameraState.textContent = "CAMERA STOPPED";
  startBtn.disabled = false;
  startBtn.textContent = "Start camera demo";
  stopBtn.disabled = true;
  resetClosure();
  setStatus("Camera stopped", "Your camera has been switched off. Start again when you are ready.");
}

startBtn.addEventListener("click", startCamera);
stopBtn.addEventListener("click", stopCamera);
window.addEventListener("pagehide", () => {
  running = false;
  if (stream) stream.getTracks().forEach((track) => track.stop());
  if (animationFrame !== null) cancelAnimationFrame(animationFrame);
  landmarker?.close();
});
