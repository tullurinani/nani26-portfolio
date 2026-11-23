"""Clean Tkinter UI for the Driver Drowsiness Detection demo."""
from __future__ import annotations

import time
import tkinter as tk
from tkinter import messagebox, ttk

import cv2
from PIL import Image, ImageTk

from detector import EyeClosureMonitor


class DrowsinessApp:
    BG = "#101923"
    PANEL = "#182534"
    PANEL_ALT = "#1d2d3e"
    TEXT = "#f2f6fa"
    MUTED = "#a7b7c8"
    ACCENT = "#69c3b4"
    WARNING = "#f2ba62"
    DANGER = "#f07878"

    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("DriveGuard · Drowsiness Monitor")
        self.root.geometry("1120x760")
        self.root.minsize(900, 650)
        self.root.configure(bg=self.BG)
        self.cap = None
        self.running = False
        self.monitor = EyeClosureMonitor(alert_after_seconds=1.8)
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        self.eye_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_eye_tree_eyeglasses.xml"
        )
        if self.face_cascade.empty() or self.eye_cascade.empty():
            raise RuntimeError("OpenCV Haar cascade files could not be loaded.")
        self.alert_count = 0
        self.frame_count = 0
        self.photo = None
        self._build_styles()
        self._build_layout()
        self.root.protocol("WM_DELETE_WINDOW", self.close)

    def _build_styles(self) -> None:
        style = ttk.Style()
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass
        style.configure("TButton", font=("Segoe UI", 10, "bold"), padding=(16, 11), borderwidth=0)
        style.configure("Start.TButton", background=self.ACCENT, foreground="#10201f")
        style.map("Start.TButton", background=[("active", "#7bd5c6")])
        style.configure("Stop.TButton", background="#34485b", foreground=self.TEXT)
        style.map("Stop.TButton", background=[("active", "#415b72")])

    def _build_layout(self) -> None:
        shell = tk.Frame(self.root, bg=self.BG, padx=28, pady=22)
        shell.pack(fill="both", expand=True)

        top = tk.Frame(shell, bg=self.BG)
        top.pack(fill="x", pady=(0, 20))
        tk.Label(top, text="DRIVEGUARD", bg=self.BG, fg=self.ACCENT,
                 font=("Segoe UI", 10, "bold")).pack(anchor="w")
        tk.Label(top, text="Driver Drowsiness Monitor", bg=self.BG, fg=self.TEXT,
                 font=("Segoe UI", 25, "bold")).pack(anchor="w", pady=(5, 1))
        tk.Label(top, text="A camera-based computer vision demo that watches for prolonged eye closure.",
                 bg=self.BG, fg=self.MUTED, font=("Segoe UI", 10)).pack(anchor="w")

        body = tk.Frame(shell, bg=self.BG)
        body.pack(fill="both", expand=True)
        body.columnconfigure(0, weight=3)
        body.columnconfigure(1, weight=1)
        body.rowconfigure(0, weight=1)

        camera_card = tk.Frame(body, bg=self.PANEL, padx=14, pady=14)
        camera_card.grid(row=0, column=0, sticky="nsew", padx=(0, 16))
        camera_card.rowconfigure(1, weight=1)
        camera_card.columnconfigure(0, weight=1)
        cam_head = tk.Frame(camera_card, bg=self.PANEL)
        cam_head.grid(row=0, column=0, sticky="ew", pady=(0, 12))
        tk.Label(cam_head, text="CAMERA PREVIEW", bg=self.PANEL, fg=self.MUTED,
                 font=("Segoe UI", 9, "bold")).pack(side="left")
        self.connection_label = tk.Label(cam_head, text="● CAMERA OFF", bg=self.PANEL,
                                         fg=self.MUTED, font=("Segoe UI", 9, "bold"))
        self.connection_label.pack(side="right")
        self.preview = tk.Label(camera_card, text="Camera is off\n\nPress Start monitoring to begin",
                                bg="#0b131c", fg=self.MUTED, font=("Segoe UI", 15),
                                justify="center")
        self.preview.grid(row=1, column=0, sticky="nsew")
        self.preview.configure(width=720, height=410)

        side = tk.Frame(body, bg=self.BG)
        side.grid(row=0, column=1, sticky="nsew")
        status_card = tk.Frame(side, bg=self.PANEL, padx=18, pady=18)
        status_card.pack(fill="x", pady=(0, 14))
        tk.Label(status_card, text="CURRENT STATUS", bg=self.PANEL, fg=self.MUTED,
                 font=("Segoe UI", 9, "bold")).pack(anchor="w")
        self.status_badge = tk.Label(status_card, text="READY", bg=self.PANEL_ALT, fg=self.ACCENT,
                                     font=("Segoe UI", 17, "bold"), padx=12, pady=12)
        self.status_badge.pack(fill="x", pady=(12, 10))
        self.status_detail = tk.Label(status_card, text="Start the camera to begin monitoring.",
                                      bg=self.PANEL, fg=self.MUTED, justify="left", wraplength=220,
                                      font=("Segoe UI", 9))
        self.status_detail.pack(anchor="w")

        metrics = tk.Frame(side, bg=self.PANEL, padx=18, pady=18)
        metrics.pack(fill="x", pady=(0, 14))
        tk.Label(metrics, text="SESSION", bg=self.PANEL, fg=self.MUTED,
                 font=("Segoe UI", 9, "bold")).pack(anchor="w", pady=(0, 12))
        self.frames_value = self._metric(metrics, "Frames analysed", "0")
        self.alerts_value = self._metric(metrics, "Drowsiness alerts", "0")

        controls = tk.Frame(side, bg=self.PANEL, padx=18, pady=18)
        controls.pack(fill="x")
        tk.Label(controls, text="CONTROLS", bg=self.PANEL, fg=self.MUTED,
                 font=("Segoe UI", 9, "bold")).pack(anchor="w", pady=(0, 12))
        self.start_button = ttk.Button(controls, text="Start monitoring", style="Start.TButton", command=self.start)
        self.start_button.pack(fill="x", pady=(0, 8))
        self.stop_button = ttk.Button(controls, text="Stop monitoring", style="Stop.TButton", command=self.stop, state="disabled")
        self.stop_button.pack(fill="x")

        footer = tk.Label(
            shell,
            text="DEMO ONLY · Not a medical device or certified driver-assistance system. Do not use this prototype while driving.",
            bg=self.BG, fg="#e6b66b", font=("Segoe UI", 9), anchor="w"
        )
        footer.pack(fill="x", pady=(16, 0))

    def _metric(self, parent: tk.Widget, label: str, value: str) -> tk.Label:
        row = tk.Frame(parent, bg=self.PANEL)
        row.pack(fill="x", pady=6)
        tk.Label(row, text=label, bg=self.PANEL, fg=self.MUTED,
                 font=("Segoe UI", 9)).pack(side="left")
        value_label = tk.Label(row, text=value, bg=self.PANEL, fg=self.TEXT,
                               font=("Segoe UI", 14, "bold"))
        value_label.pack(side="right")
        return value_label

    def start(self) -> None:
        if self.running:
            return
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            camera.release()
            messagebox.showerror("Camera unavailable", "Could not open camera 0. Check permissions or connect a webcam.")
            return
        self.cap = camera
        self.running = True
        self.start_button.configure(state="disabled")
        self.stop_button.configure(state="normal")
        self.connection_label.configure(text="● CAMERA LIVE", fg=self.ACCENT)
        self.status_badge.configure(text="MONITORING", fg=self.ACCENT)
        self.status_detail.configure(text="Keep your face visible to the camera. Eye-closure alerts are advisory only.")
        self._tick()

    def _tick(self) -> None:
        if not self.running or self.cap is None:
            return
        ok, frame = self.cap.read()
        if not ok:
            self.status_detail.configure(text="Camera frame unavailable. Monitoring paused.")
            self.stop()
            return

        frame = cv2.flip(frame, 1)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.12, minNeighbors=5, minSize=(90, 90))
        face_found = len(faces) > 0
        eyes_found = False

        if face_found:
            x, y, w, h = max(faces, key=lambda box: box[2] * box[3])
            cv2.rectangle(frame, (x, y), (x + w, y + h), (105, 195, 180), 2)
            upper_gray = gray[y:y + int(h * 0.62), x:x + w]
            eyes = self.eye_cascade.detectMultiScale(upper_gray, scaleFactor=1.1, minNeighbors=6, minSize=(18, 18))
            eyes_found = len(eyes) >= 1
            for ex, ey, ew, eh in eyes:
                cv2.rectangle(frame, (x + ex, y + ey), (x + ex + ew, y + ey + eh), (105, 195, 180), 2)

        state = self.monitor.update(face_found=face_found, eyes_found=eyes_found, now=time.monotonic())
        self.frame_count += 1
        self.frames_value.configure(text=str(self.frame_count))
        if state.status == "DROWSY":
            self._set_status("DROWSY ALERT", self.DANGER,
                             f"Eyes were not detected for {state.closed_seconds:.1f} seconds. Check the camera view.")
            cv2.putText(frame, "DROWSINESS ALERT", (20, 42), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (80, 80, 240), 2)
            if state.should_alert:
                self.alert_count += 1
                self.alerts_value.configure(text=str(self.alert_count))
                self.root.bell()
        elif state.status == "CHECKING":
            self._set_status("CHECKING", self.WARNING,
                             f"Eyes not detected yet · {state.closed_seconds:.1f}s")
        elif state.status == "NO_FACE":
            self._set_status("NO FACE", self.MUTED, "Move into the camera frame to start monitoring.")
        else:
            self._set_status("AWAKE", self.ACCENT, "Face and eyes detected.")

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image = Image.fromarray(rgb)
        image.thumbnail((780, 500))
        self.photo = ImageTk.PhotoImage(image)
        self.preview.configure(image=self.photo, text="")
        self.root.after(20, self._tick)

    def _set_status(self, label: str, color: str, detail: str) -> None:
        self.status_badge.configure(text=label, fg=color)
        self.status_detail.configure(text=detail)

    def stop(self) -> None:
        self.running = False
        if self.cap is not None:
            self.cap.release()
            self.cap = None
        self.start_button.configure(state="normal")
        self.stop_button.configure(state="disabled")
        self.connection_label.configure(text="● CAMERA OFF", fg=self.MUTED)
        self._set_status("STOPPED", self.MUTED, "Monitoring has stopped.")
        self.preview.configure(image="", text="Camera is off\n\nPress Start monitoring to begin")
        self.photo = None

    def close(self) -> None:
        self.stop()
        self.root.destroy()


def main() -> None:
    root = tk.Tk()
    DrowsinessApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
