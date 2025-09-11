import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Profile() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>About Crop AI</Text>
        <Text style={styles.paragraph}>
          Crop AI is a revolutionary, AI-powered platform designed to empower farmers with a science-based approach to agriculture. Developed in collaboration with the Government of Jharkhand's Department of Higher and Technical Education, our mission is to make expert farming advice accessible, personalized, and impactful.
        </Text>

        <Text style={styles.subHeader}>Our Mission</Text>
        <Text style={styles.paragraph}>
          Farmers often face challenges in accessing timely and accurate agricultural support due to language barriers and limited resources. Our mission is to bridge this gap by providing an intelligent decision support system that helps farmers increase income, use resources more efficiently, and adopt sustainable farming practices.
        </Text>

        <Text style={styles.subHeader}>Key Features</Text>
        <Text style={styles.paragraph}>
          Crop AI is a holistic solution that provides real-time, personalized recommendations by analyzing key factors like soil health, localized weather.
        </Text>
        <Text style={styles.bulletPoint}>
          • AI-Powered Chat: Our chat interface allows you to ask questions in your local language using text and get instant, actionable advice on any farming challenge, from pest control to nutrient management.
        </Text>
        <Text style={styles.bulletPoint}>
          • Intelligent Recommendations: The app suggests the most appropriate crops for your specific conditions, with forecasts for yield, profit, and sustainability.
        </Text>
        <Text style={styles.bulletPoint}>
          • Personalized Profile: Your profile serves as a central hub, securely storing all your farm's data, past recommendations, and chat history for a truly personalized experience.
        </Text>

     
        <Text style={styles.subHeader}>Tech Stack</Text>
        <Text style={styles.bulletPoint}>
          • Frontend:
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: 'bold' }}>React Native</Text> and <Text style={{ fontWeight: 'bold' }}>TypeScript</Text> for building a cross-platform mobile application.
          </Text>
        </Text>
        <Text style={styles.bulletPoint}>
          • Backend:
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: 'bold' }}>LangGraph</Text> for orchestrating complex AI agents and <Text style={{ fontWeight: 'bold' }}>MongoDB</Text> for the database.
          </Text>
        </Text>
       
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#34495e",
    marginTop: 20,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 5,
    marginLeft: 10,
  },
});
