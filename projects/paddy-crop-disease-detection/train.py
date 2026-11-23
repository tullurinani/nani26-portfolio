"""Train a rice-leaf classifier from a folder-per-class image dataset."""
from __future__ import annotations

import argparse
import json
from pathlib import Path


def train(dataset_dir: Path, output_dir: Path, epochs: int = 12, batch_size: int = 32) -> None:
    try:
        import tensorflow as tf
    except ImportError as exc:
        raise SystemExit("TensorFlow is required. Run: python -m pip install -r requirements.txt") from exc

    if not dataset_dir.is_dir():
        raise SystemExit(f"Dataset directory does not exist: {dataset_dir}")
    if epochs < 1 or batch_size < 1:
        raise SystemExit("epochs and batch size must be positive integers.")

    image_size = (224, 224)
    train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="training",
        seed=42,
        image_size=image_size,
        batch_size=batch_size,
        label_mode="int",
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="validation",
        seed=42,
        image_size=image_size,
        batch_size=batch_size,
        label_mode="int",
    )
    class_names = list(train_ds.class_names)
    if len(class_names) < 2:
        raise SystemExit("Place at least two disease / healthy class folders inside the dataset directory.")

    autotune = tf.data.AUTOTUNE
    data_augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.08),
        tf.keras.layers.RandomZoom(0.1),
    ], name="data_augmentation")

    base = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3), include_top=False, weights="imagenet"
    )
    base.trainable = False

    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.25)(x)
    outputs = tf.keras.layers.Dense(len(class_names), activation="softmax")(x)
    model = tf.keras.Model(inputs, outputs, name="rice_leaf_disease_classifier")

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )

    train_ds = train_ds.cache().shuffle(1000).prefetch(autotune)
    val_ds = val_ds.cache().prefetch(autotune)
    output_dir.mkdir(parents=True, exist_ok=True)
    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=4, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint(output_dir / "rice_disease_model.keras", monitor="val_accuracy", save_best_only=True),
    ]
    history = model.fit(train_ds, validation_data=val_ds, epochs=epochs, callbacks=callbacks)
    with (output_dir / "class_names.json").open("w", encoding="utf-8") as handle:
        json.dump(class_names, handle, indent=2)

    best_val_accuracy = max(history.history.get("val_accuracy", [0.0]))
    print(f"Training finished. Best validation accuracy: {best_val_accuracy:.4f}")
    print(f"Saved model and class names in: {output_dir.resolve()}")
    print("Evaluate with a separate test set before relying on predictions.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train the paddy rice-leaf disease classifier")
    parser.add_argument("--data", type=Path, default=Path("data/rice-leaf-disease"), help="Dataset folder with one subfolder per class")
    parser.add_argument("--output", type=Path, default=Path("models"), help="Output directory for model and class names")
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--batch-size", type=int, default=32)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    train(args.data, args.output, epochs=args.epochs, batch_size=args.batch_size)
