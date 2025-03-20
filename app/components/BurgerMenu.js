import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export default function BurgerMenu() {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setMenuVisible(false);
      });
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = async () => {
    try {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        await AsyncStorage.removeItem('userSession');
      } else if (Platform.OS === 'web') {
        sessionStorage.removeItem('userSession');
      }
      toggleMenu();
      router.replace('/MenuNoLog');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const navigateTo = (screen) => {
    toggleMenu();
    router.push(screen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={toggleMenu}
      >
        <Ionicons name="menu" size={28} color="#297169" />
      </TouchableOpacity>

      {menuVisible && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={toggleMenu}
        />
      )}

      {menuVisible && (
        <Animated.View 
          style={[
            styles.menuContainer, 
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menú</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={toggleMenu}
            >
              <Ionicons name="close" size={28} color="#297169" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.menuItems}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('/FAQ')}
            >
              <Ionicons name="help-circle-outline" size={24} color="#444444" />
              <Text style={styles.menuItemText}>Preguntas Frecuentes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('/PrivacyPolicy')}
            >
              <Ionicons name="document-text-outline" size={24} color="#444444" />
              <Text style={styles.menuItemText}>Política de Privacidad</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.logoutItem]} 
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : Constants.statusBarHeight + 10,
    right: 15,
    zIndex: 9999,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9998,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#ffffff',
    zIndex: 9999,
    paddingTop: Platform.OS === 'ios' ? 50 : Constants.statusBarHeight + 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#297169',
  },
  closeButton: {
    padding: 5,
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#444444',
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 30,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF3B30',
  },
});