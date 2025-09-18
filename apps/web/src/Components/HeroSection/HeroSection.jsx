import React from "react";
import "./HeroSection.css";
import DummmyPhone from "../Media/AndroidPhone.png"

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-left">
          <div className="badge">
            🌱 AI-Powered Agriculture
          </div>
          <h1 className="hero-title">
            Empowering Farmers with <span className="accent">AI-Powered Insights</span>
          </h1>
          <p className="hero-sub">
            Crop AI provides real-time crop suggestions, plant health , multilingual chat support
            analysis — all through a simple, farmer-friendly chat
            interface.
          </p>
          
          <div className="hero-ctas">
            <a href="" className="btn btn-primary">
              <span className="btn-icon"></span>
              Download Now
            </a>
            <a href="https://github.com/abhinab-choudhury/crop-ai" className="btn btn-outline">
              <span className="btn-icon"></span>
              Github
            </a>
          </div>
          
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-icon"></span>
             Multilingual Conversational chat interface
            </li>
            <li className="feature-item">
              <span className="feature-icon"></span>
              Image upload for disease detection
            </li>
            <li className="feature-item">
              <span className="feature-icon"></span>
              Voice input ready
            </li>
          </ul>
        </div>
                
        <div className="hero-right">
          <div className="phone-container">
            <div className="phone-frame">
              <img src={DummmyPhone} alt="Crop AI Mobile App" />
            </div>
            <div className="floating-elements">
              <div className="floating-card card-1">
                <div className="card-icon"></div>
                <span>Crops Recommendation</span>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon"></div>
                <span>Crops Diseases</span>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon"></div>
                <span>AI Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
    </section>
  );
}