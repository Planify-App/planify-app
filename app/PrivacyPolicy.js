import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function PrivacyPolicy() {
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
        <Text style={styles.title}>Política de Privacidad</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Introducción</Text>
        <Text style={styles.paragraph}>
          En Planify, respetamos tu privacidad y nos comprometemos a proteger tus datos personales. 
          Esta política de privacidad te informará sobre cómo cuidamos tus datos personales cuando 
          utilizas nuestra aplicación y te informará sobre tus derechos de privacidad.
        </Text>
        
        <Text style={styles.sectionTitle}>Datos que recopilamos</Text>
        <Text style={styles.paragraph}>
          Recopilamos varios tipos de información, incluyendo:
        </Text>
        <Text >• Información de identificación personal (nombre, correo electrónico, etc.)</Text>
        <Text >• Información de ubicación (si lo permites)</Text>
        <Text >• Información sobre tus quedadas y participaciones</Text>
        <Text >• Mensajes en los chats de las quedadas</Text>
        
        <Text style={styles.sectionTitle}>Cómo utilizamos tus datos</Text>
        <Text style={styles.paragraph}>
          Utilizamos tus datos personales para:
        </Text>
        <Text >• Proporcionar y mantener nuestro servicio</Text>
        <Text >• Notificarte sobre cambios en nuestro servicio</Text>
        <Text >• Permitirte participar en funciones interactivas</Text>
        <Text >• Proporcionar atención al cliente</Text>
        <Text >• Mejorar nuestro servicio</Text>
        
        <Text style={styles.sectionTitle}>Compartición de datos</Text>
        <Text style={styles.paragraph}>
          No compartimos tus datos personales con terceros excepto en las siguientes situaciones:
        </Text>
        <Text >• Con tu consentimiento</Text>
        <Text >• Para cumplir con obligaciones legales</Text>
        <Text >• Para proteger nuestros derechos, privacidad, seguridad o propiedad</Text>
        
        <Text style={styles.sectionTitle}>Seguridad de datos</Text>
        <Text style={styles.paragraph}>
          Implementamos medidas de seguridad adecuadas para proteger tus datos personales contra 
          acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún método 
          de transmisión por Internet o método de almacenamiento electrónico es 100% seguro.
        </Text>
        
        <Text style={styles.sectionTitle}>Tus derechos</Text>
        <Text style={styles.paragraph}>
          Tienes derecho a:
        </Text>
        <Text >• Acceder a tus datos personales</Text>
        <Text >• Rectificar tus datos personales</Text>
        <Text >• Eliminar tus datos personales</Text>
        <Text >• Oponerte al procesamiento de tus datos personales</Text>
        <Text >• Retirar tu consentimiento en cualquier momento</Text>
        
        <Text style={styles.sectionTitle}>Cambios a esta política</Text>
        <Text style={styles.paragraph}>
          Podemos actualizar nuestra política de privacidad de vez en cuando. Te notificaremos 
          cualquier cambio publicando la nueva política de privacidad en esta página y, si los 
          cambios son significativos, te enviaremos una notificación.
        </Text>
        
        <Text style={styles.sectionTitle}>Contacto</Text>
        <Text style={styles.paragraph}>
          Si tienes alguna pregunta sobre esta política de privacidad, puedes contactarnos en:
        </Text>
        <Text style={styles.contactInfo}>support@planify-app.com</Text>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Última actualización: Junio 2024</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#297169',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginLeft: 10,
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 16,
    color: '#297169',
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  footer: {
    marginTop: 30,
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});