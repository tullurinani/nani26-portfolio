"""Haar-cascade based eye-closure monitor used by the desktop demo.

This is an educational prototype, not a certified driver safety system.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class MonitorState:
    status: str
    closed_seconds: float
    should_alert: bool


class EyeClosureMonitor:
    """Track sustained eye non-detection while a face is visible."""

    def __init__(self, alert_after_seconds: float = 1.8) -> None:
        if alert_after_seconds <= 0:
            raise ValueError("alert_after_seconds must be positive")
        self.alert_after_seconds = float(alert_after_seconds)
        self._closed_since: Optional[float] = None
        self._alerted = False

    def update(self, *, face_found: bool, eyes_found: bool, now: float) -> MonitorState:
        if not face_found:
            self._closed_since = None
            self._alerted = False
            return MonitorState("NO_FACE", 0.0, False)

        if eyes_found:
            self._closed_since = None
            self._alerted = False
            return MonitorState("AWAKE", 0.0, False)

        if self._closed_since is None:
            self._closed_since = now

        elapsed = max(0.0, now - self._closed_since)
        if elapsed >= self.alert_after_seconds:
            should_alert = not self._alerted
            self._alerted = True
            return MonitorState("DROWSY", elapsed, should_alert)

        return MonitorState("CHECKING", elapsed, False)
