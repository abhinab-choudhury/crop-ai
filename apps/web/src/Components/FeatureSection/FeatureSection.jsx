import React from "react";

function FeaturesSection() {
  const styles = {
    section: {
      backgroundColor: "#ffffff",
      padding: "60px 20px",
      textAlign: "center",
    },
    heading: {
      color: "#1b5e20", 
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    subheading: {
      color: "#4caf50", 
      fontSize: "18px",
      marginBottom: "40px",
    },
    featureContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
      gap: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    card: {
      backgroundColor: "#f5fff5",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      textAlign: "center",
      transition: "transform 0.3s ease",
    },
    icon: {
      fontSize: "40px",
      color: "#2e7d32",
      marginBottom: "15px",
    },
    title: {
      fontSize: "20px",
      color: "#1b5e20",
      fontWeight: "600",
      marginBottom: "10px",
    },
    text: {
      fontSize: "16px",
      color: "#555",
      lineHeight: "1.5",
    },
    
  };
const features = [
        {
            icon: "🔍",
            title: "Crop Disease Detection",
            text: "Instantly diagnose crop diseases by simply uploading a photo. Get accurate identification and suggested cures to protect your harvest.",
        },
        {
            icon: "🌾",
            title: "Best Crop Suggestions",
            text: "Discover which crops are ideal for your location and current season. Our model analyzes local data to help you maximize your yield.",
        },
        {
            icon: "🔄",
            title: "Crop Rotation Planning",
            text: "Generate optimized crop rotation plans tailored to your field. Our AI suggests the best sequence to maintain soil health and boost productivity.",
        },
        {
            icon: "🤖",
            title: "AI Chat Assistant",
            text: "Chat with our AI assistant for instant support and guidance on all your farming questions.",
        },
    ];

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Our Features</h2>
      <p style={styles.subheading}>
        Discover the key benefits of choosing our platform
      </p>

      <div style={styles.featureContainer}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={styles.icon}>{feature.icon}</div>
            <h3 style={styles.title}>{feature.title}</h3>
            <p style={styles.text}>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
