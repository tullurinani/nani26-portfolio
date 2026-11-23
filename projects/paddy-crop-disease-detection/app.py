"""Streamlit interface for paddy crop leaf disease classification."""
from __future__ import annotations

import json
from pathlib import Path

import streamlit as st
from PIL import Image

from inference import load_class_names, load_classifier, predict_image

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "rice_disease_model.keras"
CLASS_NAMES_PATH = BASE_DIR / "models" / "class_names.json"

st.set_page_config(page_title="PaddyCare AI", page_icon="🌾", layout="wide", initial_sidebar_state="expanded")

st.markdown("""
<style>
:root { --ink: #20352b; --muted: #718176; --green: #315b45; --cream: #f5f4ec; }
.stApp { background: #f4f5ef; color: var(--ink); }
.block-container { max-width: 1180px; padding-top: 2.2rem; padding-bottom: 3rem; }
[data-testid="stSidebar"] { background: #e8ede4; border-right: 1px solid #d8e0d5; }
[data-testid="stSidebar"] * { color: #31483a; }
.hero-panel { padding: 2rem 2.2rem; border-radius: 22px; background: linear-gradient(115deg,#254c3a,#56765a); color: #f6f7ee; margin-bottom: 1.3rem; }
.hero-panel h1 { color: #fff; font-size: 2.25rem; margin: 0 0 .4rem; letter-spacing: -.04em; }
.hero-panel p { color: #e2ece0; font-size: 1rem; max-width: 720px; margin: 0; }
.eyebrow { color: #c5d9bf; font-size: .72rem; letter-spacing: .16em; font-weight: 700; text-transform: uppercase; margin-bottom: .65rem; }
.panel { background: #fff; border: 1px solid #e0e6dc; border-radius: 18px; padding: 1.3rem; box-shadow: 0 8px 25px rgba(37,63,46,.05); }
.panel-title { color: #294735; font-size: 1.02rem; font-weight: 750; margin-bottom: .3rem; }
.panel-sub { color: #7b887d; font-size: .87rem; margin-bottom: 1rem; }
.prediction { border-left: 4px solid #67875d; padding: .85rem 1rem; background: #f0f5ec; border-radius: 0 12px 12px 0; margin: .75rem 0 1rem; }
.prediction strong { color: #315b45; font-size: 1.2rem; }
.small-note { color: #77857a; font-size: .78rem; line-height: 1.55; }
div.stButton > button[kind="primary"] { background: #315b45; border-color: #315b45; border-radius: 10px; min-height: 2.8rem; }
div.stButton > button[kind="primary"]:hover { background: #244936; border-color: #244936; }
div[data-testid="stMetric"] { background: #f5f7f1; padding: .8rem 1rem; border-radius: 12px; border: 1px solid #e1e8de; }
hr { border-color: #e1e7de; }
</style>
""", unsafe_allow_html=True)

with st.sidebar:
    st.markdown("## 🌾 PaddyCare AI")
    st.caption("Rice leaf health screening · Computer vision")
    st.divider()
    st.markdown("### How to use")
    st.markdown("1. Choose a clear rice-leaf photo.\n2. Select **Analyse leaf**.\n3. Review the predicted class and confidence.\n4. Compare with field symptoms and expert guidance.")
    st.divider()
    st.markdown("### Model status")
    if MODEL_PATH.is_file() and CLASS_NAMES_PATH.is_file():
        st.success("Trained model found")
    else:
        st.warning("Model not trained yet")
        st.caption("Prepare the dataset and run train.py before analysing images.")

st.markdown("""
<div class="hero-panel">
  <div class="eyebrow">IMAGE-BASED CROP HEALTH ASSISTANT</div>
  <h1>Understand your paddy leaf health.</h1>
  <p>Upload a rice-leaf image to get a model-based classification result. The model must be trained on your labelled dataset before predictions are available.</p>
</div>
""", unsafe_allow_html=True)

left, right = st.columns([1.05, 0.95], gap="large")
with left:
    st.markdown('<div class="panel"><div class="panel-title">1 · Upload a leaf image</div><div class="panel-sub">Use a well-lit image with one leaf in focus.</div>', unsafe_allow_html=True)
    uploaded = st.file_uploader("Choose an image", type=["jpg", "jpeg", "png", "webp"], label_visibility="collapsed")
    if uploaded:
        try:
            image = Image.open(uploaded)
            st.image(image, caption="Selected leaf image", use_container_width=True)
        except Exception as exc:
            st.error(f"This image could not be opened: {exc}")
            image = None
    else:
        image = None
        st.info("Upload a JPG, PNG or WebP image to begin.")
    analyse = st.button("Analyse leaf", type="primary", use_container_width=True, disabled=image is None)
    st.markdown('</div>', unsafe_allow_html=True)

with right:
    st.markdown('<div class="panel"><div class="panel-title">2 · Classification result</div><div class="panel-sub">Top prediction from the trained model.</div>', unsafe_allow_html=True)
    if analyse and image is not None:
        try:
            with st.spinner("Analysing image…"):
                model = load_classifier(MODEL_PATH)
                class_names = load_class_names(CLASS_NAMES_PATH)
                predictions = predict_image(image, model, class_names)
            top = predictions[0]
            st.markdown(f'<div class="prediction"><span class="small-note">MOST LIKELY CLASS</span><br><strong>{top["class_name"]}</strong></div>', unsafe_allow_html=True)
            st.metric("Model confidence", f'{top["confidence"] * 100:.1f}%')
            st.markdown("**Other likely classes**")
            for item in predictions[1:]:
                st.write(f'{item["class_name"]} · {item["confidence"] * 100:.1f}%')
                st.progress(float(item["confidence"]))
            st.caption("Confidence is the model's score, not a guarantee of disease or diagnosis.")
        except FileNotFoundError:
            st.warning("No trained model is available yet.")
            st.markdown("Run \`python train.py --data data/rice-leaf-disease\` after arranging your labelled dataset.")
        except RuntimeError as exc:
            st.error(str(exc))
        except (ValueError, OSError, json.JSONDecodeError) as exc:
            st.error(f"Could not analyse this image: {exc}")
        except Exception as exc:
            st.error(f"Unexpected prediction error: {exc}")
    elif MODEL_PATH.is_file() and CLASS_NAMES_PATH.is_file():
        st.info("Upload a leaf photo and select **Analyse leaf** to view the prediction.")
    else:
        st.info("The interface is ready. Train the model first to enable real predictions.")
    st.markdown('</div>', unsafe_allow_html=True)

st.divider()
st.markdown("### Important note")
st.markdown('<p class="small-note">This is a learning and decision-support prototype. Image quality, lighting, camera angle, dataset labels and model validation affect results. Confirm suspected disease with an agriculture expert before taking crop-treatment decisions.</p>', unsafe_allow_html=True)
