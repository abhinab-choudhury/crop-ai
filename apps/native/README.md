# 🌾 Crop AI | React Native Application

Crop AI is a **mobile application** built with **React Native** that empowers farmers with **AI-powered crop recommendations** and **plant disease detection**. This app consumes the **FastAPI backend** (AgroTech AI API) to deliver real-time predictions using soil, weather, and image data.

## 📱 Features

- ✅ **Crop Recommendation** based on soil nutrients (N, P, K), pH, rainfall, temperature & humidity
- ✅ **Plant Disease Detection** using image classification models (ResNet / ONNX)
- ✅ **Weather Data Fetching** from latitude & longitude (via OpenWeatherMap API)
- ✅ **Modern UI** designed for ease of use in rural & agricultural contexts
- ✅ **Android-first** deployment

## 🛠 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) or React Native CLI
- [Android Studio](https://developer.android.com/studio) with Android Emulator OR a physical Android device
- [FastAPI Backend](../ml-server) running locally or deployed (required for API calls)

Make sure your backend server is running and accessible from the app.

## Commands

```bash
npx expo prebuild
eas build --profile development --platform android
```

## 📸 Screenshots

_Add screenshots of your app here for better documentation._
