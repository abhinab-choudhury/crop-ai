# 🚀 FastAPI ML-Server

An **AI-powered FastAPI server** that integrates **machine learning models** for:

* 🌱 **Crop Recommendation** (using soil + weather data)
* 🍃 **Plant Disease Detection** (from leaf images)

Built with **FastAPI**, **ONNX Runtime**, and **XGBoost**, this API enables smart agriculture solutions with a simple REST interface.

## 🛠 Prerequisites

Make sure you have [`uv`](https://astral.sh/blog/uv/) installed:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## ⚙️ Setup & Installation

### 2️⃣ Create a Virtual Environment

```bash
uv venv
```

This will create a `.venv` directory with an isolated Python environment.

### 3️⃣ Install Dependencies

```bash
uv sync
```

## ▶️ Running the Application

### 🔹 Start the Server (Default: port **5000**)

```bash
uv run python run.py
```

Runs the API with **auto-reload** enabled.

### 🔹 Run on a Custom Port

```bash
PORT=8080 uv run python run.py
```


## 🌐 API Access

Once the server is running, you can access:

* ✅ **Root** → [http://127.0.0.1:5000](http://127.0.0.1:5000)
* 📄 **Swagger UI** → [http://127.0.0.1:5000/docs](http://127.0.0.1:5000/docs)
* 📘 **ReDoc UI** → [http://127.0.0.1:5000/redoc](http://127.0.0.1:5000/redoc)

## 📂 Project Structure

---

## 🤖 Machine Learning Models

### 🌱 Crop Recommendation

* Decision Tree
* Naïve Bayes
* Random Forest
* SVM Classifier
* **XGBoost (final selected model)**

### 🍃 Plant Disease Detection

* ResNet9
* ResNet18
* **ResNet50 (final selected model)**

> Trained on the **[Plant Disease Dataset (Kaggle)](https://www.kaggle.com/datasets/emmarex/plantdisease)**.