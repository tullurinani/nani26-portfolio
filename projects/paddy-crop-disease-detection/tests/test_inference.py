import json
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

from inference import load_class_names, load_classifier, prepare_image, rank_predictions


class InferenceTests(unittest.TestCase):
    def test_prepare_image_returns_mobilenet_batch_shape_and_range(self):
        image = Image.new("RGB", (100, 80), color=(255, 127, 0))
        batch = prepare_image(image)
        self.assertEqual(batch.shape, (1, 224, 224, 3))
        self.assertTrue(np.isfinite(batch).all())
        self.assertGreaterEqual(float(batch.min()), -1.0)
        self.assertLessEqual(float(batch.max()), 1.0)

    def test_missing_model_is_reported_before_tensorflow_is_needed(self):
        with tempfile.TemporaryDirectory() as tmp:
            model_path = Path(tmp) / "missing.keras"
            with self.assertRaises(FileNotFoundError):
                load_classifier(model_path)

    def test_load_class_names(self):
        with tempfile.TemporaryDirectory() as tmp:
            file_path = Path(tmp) / "classes.json"
            file_path.write_text(json.dumps(["healthy", "leaf_blast"]), encoding="utf-8")
            self.assertEqual(load_class_names(file_path), ["healthy", "leaf_blast"])

    def test_rejects_invalid_class_names(self):
        with tempfile.TemporaryDirectory() as tmp:
            file_path = Path(tmp) / "classes.json"
            file_path.write_text(json.dumps(["healthy", "  "]), encoding="utf-8")
            with self.assertRaises(ValueError):
                load_class_names(file_path)

    def test_rank_predictions_returns_highest_first(self):
        result = rank_predictions([0.1, 0.8, 0.1], ["healthy", "blast", "blight"], limit=2)
        self.assertEqual(result[0]["class_name"], "blast")
        self.assertAlmostEqual(result[0]["confidence"], 0.8)
        self.assertEqual(len(result), 2)

    def test_rank_predictions_rejects_mismatched_class_count(self):
        with self.assertRaises(ValueError):
            rank_predictions([0.6, 0.4], ["healthy"])

    def test_rank_predictions_rejects_nan(self):
        with self.assertRaises(ValueError):
            rank_predictions([float("nan")], ["healthy"])


if __name__ == "__main__":
    unittest.main()
