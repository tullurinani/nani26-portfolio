# Driver Drowsiness Detection

A Python desktop prototype that uses OpenCV Haar cascades to locate a face and eyes. A small state machine tracks sustained periods where a visible face is detected but eyes are not. The Tkinter interface displays the camera feed, state and alert count.

> **Safety note:** This is an educational computer-vision prototype, not a certified driver-monitoring system. Haar cascades can miss eyes because of glasses, lighting, head pose and camera quality. It must not be used as a safety device or operated while driving.

## Features

- Live webcam preview with face and eye detection overlays.
- Configurable eye-closure threshold in detector.py.
- Alert only after sustained eye non-detection; one alert per episode.
- Clear camera state, session counters and start / stop controls.
- Six unit tests for the monitor state machine without requiring a webcam.

## Requirements

- Python 3.10 or newer
- Webcam and desktop environment with Tk support
- Windows, macOS or Linux

## Run on Windows

\`\`\`powershell
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
\`\`\`

On macOS / Linux, activate the environment with source .venv/bin/activate and run python app.py.

## Run tests

\`\`\`bash
python -m unittest discover -s tests -v
\`\`\`

A real camera check is still needed on the target computer. This environment validated the state machine and Python syntax; webcam availability and live camera behaviour were not tested here.

## How it works

1. OpenCV reads frames from the webcam.
2. A Haar face cascade locates the largest face.
3. An eye cascade searches the upper face region.
4. The monitor starts a timer while a face is visible and eyes are not detected.
5. If the interval reaches 1.8 seconds, the UI displays an advisory alert and beeps once until eyes are detected again.

This heuristic is sensitive to lighting, glasses, camera placement and head movement. Do not interpret its output as medical advice or a reliable driving warning.


## Browser demo

The `web/` folder contains a separate static browser version that can be served from GitHub Pages. Open the project page and select **Try browser demo**. It requests camera permission, runs MediaPipe Face Landmarker in the browser and checks for prolonged eye closure. It does not send camera video to this site's server.

Use a current browser over HTTPS, allow camera access and test only while stationary. The MediaPipe SDK and model are loaded from their published CDN/model endpoints. This remains an educational experiment, not a certified driver-monitoring system. The original Python/OpenCV/Tkinter desktop application remains available through `python app.py`.
