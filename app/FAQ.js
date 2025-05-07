import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import {useRouter, useRootNavigationState} from 'expo-router';
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FAQ() {
  const router = useRouter();
  const navigationState = useRootNavigationState()

  useEffect(() => {
    const checkSession = async () => {
      if (!navigationState?.key) return;

      try {
        let session = null;

        if (Platform.OS === 'web') {
          session = sessionStorage.getItem("userSession");
        } else {
          session = await AsyncStorage.getItem("userSession");
        }

        if (session) {

        } else {
          router.replace('/MenuNoLog');
        }
      } catch (error) {
        console.error("Error al obtener la sesión:", error);
        router.replace('/MenuNoLog');
      }
    };

    checkSession();
  }, [navigationState]);

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#297169" />
        </TouchableOpacity>
        <Text style={styles.title}>Preguntas Frecuentes</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Qué es Planify?</Text>
          <Text style={styles.answer}>
            Planify es una aplicación que te permite organizar y crear quedadas con amigos, 
            familiares o compañeros de trabajo de manera sencilla y eficiente.
          </Text>
        </View>
        
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Cómo puedo crear una quedada?</Text>
          <Text style={styles.answer}>
            Para crear una quedada, simplemente pulsa el botón "+" en la barra de navegación 
            inferior y completa los detalles requeridos como título, fecha, hora y ubicación.
          </Text>
        </View>
        
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Cómo puedo unirme a una quedada?</Text>
          <Text style={styles.answer}>
            Puedes unirte a una quedada pulsando en "Unirse" en la barra de navegación 
            inferior y luego introduciendo el código de la quedada proporcionado por el organizador.
          </Text>
        </View>
        
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Puedo editar una quedada después de crearla?</Text>
          <Text style={styles.answer}>
            Sí, si eres el organizador de la quedada, puedes editarla en cualquier momento 
            accediendo a los detalles de la quedada y pulsando en "Editar".
          </Text>
        </View>
        
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Cómo puedo cancelar mi participación en una quedada?</Text>
          <Text style={styles.answer}>
            Puedes cancelar tu participación accediendo a los detalles de la quedada y 
            pulsando en "Salir de la quedada".
          </Text>
        </View>
        
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Cómo funciona el chat de la quedada?</Text>
          <Text style={styles.answer}>
            Cada quedada tiene un chat grupal donde todos los participantes pueden comunicarse. 
            Accede al chat desde la sección "Chats" o desde los detalles de la quedada.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#297169',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  faqItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#297169',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#297169',
  },
  answer: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});