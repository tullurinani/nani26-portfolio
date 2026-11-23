"""Inference helpers for the rice-leaf disease classifier.

TensorFlow is imported only when loading a trained model so preprocessing tests
can run without the optional deep-learning runtime installed.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Sequence

import numpy as np
from PIL import Image, ImageOps

IMAGE_SIZE = (224, 224)


def load_class_names(path: str | Path) -> list[str]:
    file_path = Path(path)
    with file_path.open("r", encoding="utf-8") as handle:
        names = json.load(handle)
    if not isinstance(names, list) or not names or not all(isinstance(name, str) and name.strip() for name in names):
        raise ValueError("Class names must be a non-empty JSON array of strings.")
    return [name.strip() for name in names]


def prepare_image(image: Image.Image, image_size: tuple[int, int] = IMAGE_SIZE) -> np.ndarray:
    if not isinstance(image, Image.Image):
        raise TypeError("image must be a PIL Image")
    image = ImageOps.exif_transpose(image).convert("RGB").resize(image_size, Image.Resampling.BILINEAR)
    array = np.asarray(image, dtype=np.float32)
    if array.shape != (image_size[1], image_size[0], 3):
        raise ValueError("Image preprocessing produced an unexpected shape.")
    # MobileNetV2 preprocess_input maps RGB values from [0, 255] to [-1, 1].
    array = (array / 127.5) - 1.0
    return np.expand_dims(array, axis=0)


def load_classifier(model_path: str | Path) -> Any:
    try:
        from tensorflow.keras.models import load_model
    except ImportError as exc:  # pragma: no cover - requires optional TensorFlow dependency
        raise RuntimeError("TensorFlow is required. Install the project requirements first.") from exc

    path = Path(model_path)
    if not path.is_file():
        raise FileNotFoundError(f"Model file not found: {path}. Train a model first using train.py.")
    return load_model(path)


def rank_predictions(probabilities: Sequence[float], class_names: Sequence[str], limit: int = 3) -> list[dict[str, float | str]]:
    values = np.asarray(probabilities, dtype=np.float64).reshape(-1)
    if len(values) != len(class_names):
        raise ValueError("Number of predictions does not match the class-name list.")
    if len(values) == 0:
        raise ValueError("No predictions were returned by the model.")
    if not np.all(np.isfinite(values)):
        raise ValueError("Model returned invalid prediction values.")
    if np.any(values < 0) or np.any(values > 1):
        raise ValueError("Expected probability values between zero and one.")
    indices = np.argsort(values)[::-1][: max(1, int(limit))]
    return [
        {"class_name": str(class_names[index]), "confidence": float(values[index])}
        for index in indices
    ]


def predict_image(image: Image.Image, model: Any, class_names: Sequence[str]) -> list[dict[str, float | str]]:
    batch = prepare_image(image)
    output = model.predict(batch, verbose=0)
    values = np.asarray(output)
    if values.ndim == 2 and values.shape[0] == 1:
        values = values[0]
    return rank_predictions(values, class_names)
