import React from 'react';
import Navbar from './components/NavBar/Navbar.jsx';
import HeroSection from './components/HeroSection/HeroSection.jsx';
import FeaturesSection from './components/FeatureSection/FeatureSection.jsx';
import Footer from './components/Footer/Footer.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </>
  );
}
