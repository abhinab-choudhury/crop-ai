import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Image source={require('@/assets/icon.png')} style={styles.avatar} />
        <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'No email provided'}</Text>
        <Text style={styles.joinDate}>
          Member since {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
        </Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailValue}>{user?.phone || 'Not provided'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue}>{user?.location || 'Not provided'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Farm Size</Text>
          <Text style={styles.detailValue}>{user?.farmSize || 'Not provided'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Preferred Crops</Text>
          <View style={styles.chipsContainer}>
            {user?.preferredCrops?.map((crop, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{crop}</Text>
              </View>
            )) || <Text style={styles.detailValue}>Not specified</Text>}
          </View>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Account Actions</Text>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Notification Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Crop AI - Powered by AI for Farmers</Text>
        <Text style={styles.footerText}>In collaboration with Government of Jharkhand</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: '#888',
  },
  detailsCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 2,
    justifyContent: 'flex-end',
  },
  chip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 5,
    marginBottom: 5,
  },
  chipText: {
    color: '#2E7D32',
    fontSize: 14,
  },
  actionsCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FFEBEE',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#D32F2F',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  footerText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
});
