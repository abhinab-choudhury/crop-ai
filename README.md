<div align="center"> 
  <img src="https://crop-ai-one.vercel.app/icon.png" alt="Crop AI Logo" width="120"/> 
  <h2>AI-Powered Crop Diagnosis, Advisory & Multilingual Assistance</h2> 
  <p> 
    An end-to-end, mobile-first platform that helps farmers diagnose crop diseases, 
    get intelligent recommendations, and interact using voice or chat — even in 
    low-connectivity environments. 
  </p> 
</div>

---

# 🚀 Overview

Crop AI is a full-stack, AI-driven agriculture platform designed to assist farmers with:

- 🌱 Plant disease detection from leaf images
- 💬 Conversational AI chat assistant
- 🌾 Crop recommendation & yield prediction
- 🌍 Region-aware agricultural guidance
- 🗣 Multilingual + Speech-based interaction
- 📱 Offline-friendly mobile experience

The project is built as a TurboRepo monorepo, combining mobile, web, backend, and ML services into a single, scalable codebase.

---

## 🧠 System Architecture

```
            ┌──────────────┐
            │  Mobile App  │  (React Native + Expo)
            └──────┬───────┘
                   │
        ┌──────────▼─────────┐
        │   Backend Server   │  (Node.js + Express)
        │  Auth • Chat • API │
        └──────┬───────┬─────┘
               │       │
     ┌─────────▼───┐   ▼
     │  ML Server  │  MongoDB
     │  (FastAPI)  │  (Mongoose)
     └─────────────┘
```

---

## ✨ Features Status 

### 🤖 AI Chat Server

- [x] Conversational assistant powered by **Ollama**
- [x] Custom **tool calling system** (not LangChain-based)
- [ ] Supports reasoning, structured responses, and agriculture-focused queries
- [ ] Designed to later plug into LangChain.js if needed

### 🌿 Plant Leaf Disease Detection

- [x] Dedicated **ML server (FastAPI)**
- [x] Image-based disease detection
- [x] Model evolution:
  - [x] ResNet9 → ResNet18 → **ResNet50 (current)**
- [ ] Optimized for mobile image inputs

### 🌾 Crop Recommendation & Prediction

- [x] Multiple classical ML models trained and evaluated

### 🗣 Voice & Language Support
- [ ] Speech-to-Text and Text-to-Speech using (On Device using APIopenai/whisper)
- [x] Multilingual support for farmer accessibility

### 🔐 Authentication
- [x] **Clerk** for secure, scalable authentication
- [x] Works across mobile
      
---

## 🛠 Tech Stack

### Frontend

* React Native + Expo
* React + Vite (Web)
* Clerk Authentication

### Backend

* Node.js + Express
* MongoDB + Mongoose
* Ollama (LLM runtime)

### Machine Learning

* FastAPI
* PyTorch
* Scikit-learn
* XGBoost

### DevOps

* TurboRepo
* Docker & Docker Compose
* pnpm

---

## Getting Started

### 1. Install Dependencies

Install all project dependencies:

```bash
pnpm install
````

If you face issues with Expo Go:

```bash
cd apps/native
pnpm install
```

Set up the ML server:

```bash
cd apps/ml-server
uv venv
uv sync
```

Optional setups:

```bash
cd apps/server
pnpm install

cd apps/web
pnpm install
```

---

### 2. Database Setup

This project uses **MongoDB** with **Mongoose**.

1. Ensure MongoDB is installed and running.
2. Update `apps/server/.env` with your MongoDB connection URI.

Get API Keys from 
- [WEATHER API](https://www.weatherapi.com/) 
- [TAVILY](https://app.tavily.com/)
- [CLOUDINARY](https://cloudinary.com/)
- [CLERK](https://clerk.com/)

---

### 3. Running the Project

Start the development servers:

```bash
pnpm dev
```

* The mobile app can be run via **Expo Go**.
* Backend API is available at: [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
crop-ai/
├── apps/
│   ├── native/      # Mobile app (React Native + Expo)
│   ├── ml-server/   # Machine Learning server (FastAPI)
│   ├── server/      # Backend API (Express)
│   └── web/         # Web app (React + Vite)
```

---

## Available Scripts

| Script               | Description                                    |
| -------------------- | ---------------------------------------------- |
| `pnpm dev`           | Start all applications in development mode     |
| `pnpm build`         | Build all applications                         |
| `pnpm dev:native`    | Start the React Native/Expo development server |
| `pnpm dev:web`       | Start only the web application                 |
| `pnpm dev:ml-server` | Start only the ML FastAPI server               |
| `pnpm dev:server`    | Start only the backend server                  |
| `pnpm check-types`   | Check TypeScript types across all apps         |

---

## Features

* AI-powered **disease detection** from leaf images
* Crop Recommendation (XGBoost)
* **Crop Yield** Prediction (XGBoost)
* **RealTime Mandi Market** Analysis
* **Speech to Text and vice-versa** supported
* **Multilingual chat assistant** for farmers
* **Crop and rotation guidance** tailored to local regions
* Works **offline** and on mobile devices
* Easy-to-use **mobile applications**

## 🧪 Machine Learning Models

### 🌿 Plant Disease Detection

**Image-based classification**

* Backbone: **ResNet50**
* Input: Leaf images
* Output: Disease class + confidence

**Available Models**

* Disease Recommendation Models: **3**
* Evolution: ResNet9 → ResNet18 → ResNet50
 
