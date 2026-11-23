# Paddy Crop Disease Detection

A Streamlit + TensorFlow project for classifying labelled rice-leaf images. The interface accepts a leaf photo and displays the model's top predicted class and confidence. The training pipeline uses MobileNetV2 transfer learning.

**Important:** No dataset or trained model is included. The app becomes a real classifier only after you supply a correctly labelled dataset and train the model. No accuracy claim is made by this starter implementation.

## Features

- Clean image-upload and prediction interface.
- Image orientation correction, RGB conversion and 224 × 224 preprocessing.
- Transfer-learning training pipeline with augmentation and early stopping.
- Class-name metadata saved beside the trained model.
- Top predictions with confidence values.
- Six unit tests for preprocessing, class-name loading and prediction ranking.

## Dataset structure

Place rice-leaf images in folders named after their labels:

\`\`\`text
data/
└── rice-leaf-disease/
    ├── healthy/
    │   ├── image_001.jpg
    │   └── image_002.jpg
    ├── leaf_blast/
    │   ├── image_003.jpg
    │   └── image_004.jpg
    └── brown_spot/
        ├── image_005.jpg
        └── image_006.jpg
\`\`\`

Use the class folders that match your dataset labels. Keep images out of Git unless you have permission and the dataset licence allows redistribution.

## Setup on Windows

Use Python 3.12 or another TensorFlow-supported Python version:

\`\`\`powershell
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
\`\`\`

## Train the model

\`\`\`powershell
python train.py --data data/rice-leaf-disease --epochs 12 --batch-size 32
\`\`\`

The script creates the following files in the models folder:

- rice_disease_model.keras
- class_names.json

Training downloads MobileNetV2 ImageNet weights the first time. An internet connection is required for that first training run unless the weights are already cached.

## Run the UI

\`\`\`powershell
streamlit run app.py
\`\`\`

Open the local address printed by Streamlit, usually http://localhost:8501.

## Run tests

\`\`\`powershell
python -m unittest discover -s tests -v
\`\`\`

The six tests do not require TensorFlow. They validate preprocessing and prediction ranking. To assess model quality, keep a separate held-out test set and report accuracy, precision, recall, F1 score and a confusion matrix. Avoid evaluating only on training data.

## Limitations

The classifier can only predict classes it was trained on. Image quality, background, lighting, dataset imbalance and incorrect labels can reduce accuracy. Treat its output as an initial screening aid, not an agronomic diagnosis or treatment recommendation.
