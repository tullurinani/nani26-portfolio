import unittest

from detector import EyeClosureMonitor


class EyeClosureMonitorTests(unittest.TestCase):
    def test_awake_when_face_and_eyes_are_detected(self):
        monitor = EyeClosureMonitor(alert_after_seconds=1.0)
        state = monitor.update(face_found=True, eyes_found=True, now=0.0)
        self.assertEqual(state.status, "AWAKE")
        self.assertFalse(state.should_alert)

    def test_short_eye_non_detection_is_checking_not_alert(self):
        monitor = EyeClosureMonitor(alert_after_seconds=1.0)
        first = monitor.update(face_found=True, eyes_found=False, now=2.0)
        second = monitor.update(face_found=True, eyes_found=False, now=2.5)
        self.assertEqual(first.status, "CHECKING")
        self.assertEqual(second.status, "CHECKING")
        self.assertFalse(second.should_alert)

    def test_sustained_eye_non_detection_triggers_only_one_alert(self):
        monitor = EyeClosureMonitor(alert_after_seconds=1.0)
        monitor.update(face_found=True, eyes_found=False, now=0.0)
        alert = monitor.update(face_found=True, eyes_found=False, now=1.0)
        repeated = monitor.update(face_found=True, eyes_found=False, now=1.5)
        self.assertEqual(alert.status, "DROWSY")
        self.assertTrue(alert.should_alert)
        self.assertFalse(repeated.should_alert)

    def test_eyes_reopening_resets_the_monitor(self):
        monitor = EyeClosureMonitor(alert_after_seconds=1.0)
        monitor.update(face_found=True, eyes_found=False, now=0.0)
        monitor.update(face_found=True, eyes_found=False, now=1.0)
        state = monitor.update(face_found=True, eyes_found=True, now=1.2)
        self.assertEqual(state.status, "AWAKE")
        self.assertEqual(state.closed_seconds, 0.0)
        self.assertFalse(state.should_alert)

    def test_lost_face_resets_the_monitor(self):
        monitor = EyeClosureMonitor(alert_after_seconds=1.0)
        monitor.update(face_found=True, eyes_found=False, now=0.0)
        state = monitor.update(face_found=False, eyes_found=False, now=0.5)
        self.assertEqual(state.status, "NO_FACE")
        self.assertFalse(state.should_alert)

    def test_rejects_non_positive_threshold(self):
        with self.assertRaises(ValueError):
            EyeClosureMonitor(alert_after_seconds=0)


if __name__ == "__main__":
    unittest.main()
