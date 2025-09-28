<div align="center">
  <img src="https://crop-ai-one.vercel.app/icon.png" alt="Crop AI Logo" width="100"/>
  <h1>Crop AI</h1>
  <p>AI-powered crop diagnosis, guidance, and multilingual support for farmers</p>
</div>

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

 