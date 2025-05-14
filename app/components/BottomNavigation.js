import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Platform, Dimensions, Pressable} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {Link, router, usePathname} from 'expo-router';
import Logo from "../Logo";

export default function BottomNavigation() {

  const pathname = usePathname();

  const TABS = [
    { label: 'Inicio',  route: '/InicioQuedadas'},
    { label: 'Chats',   route: '/chat/Chats'},
    { label: 'Unirse',  route: '/UnirseAQuedada'},
    { label: 'Crear Quedada',  route: '/CrearQuedada'},
  ];
  
  const navigateTo = (screen) => {
    router.push(screen);
  };

  const isActive = (route) => {
    return pathname === route || pathname.startsWith(route);
  };

  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return (
        <View style={styles.container}>
          <TouchableOpacity
              style={styles.tabButton}
              onPress={() => navigateTo('/InicioQuedadas')}
          >
            <Ionicons
                name={isActive('/InicioQuedadas') ? 'home' : 'home-outline'}
                size={24}
                color={isActive('/InicioQuedadas') ? '#297169' : '#666'}
            />
            <Text style={[styles.tabText, isActive('/InicioQuedadas') && styles.activeText]}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.tabButton}
              onPress={() => navigateTo('/chat/Chats')}
          >
            <Ionicons
                name={isActive('/chat/Chats') ? 'chatbubbles' : 'chatbubbles-outline'}
                size={24}
                color={isActive('/chat/Chats') ? '#297169' : '#666'}
            />
            <Text style={[styles.tabText, isActive('/chat/Chats') && styles.activeText]}>Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.tabButton}
              onPress={() => navigateTo('/CrearQuedada')}
          >
            <View style={styles.addButton}>
              <Ionicons name="add" size={28} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.tabButton}
              onPress={() => navigateTo('/UnirseAQuedada')}
          >
            <Ionicons
                name={isActive('/UnirseAQuedada') ? 'people' : 'people-outline'}
                size={24}
                color={isActive('/UnirseAQuedada') ? '#297169' : '#666'}
            />
            <Text style={[styles.tabText, isActive('/UnirseAQuedada') && styles.activeText]}>Unirse</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.tabButton}
              onPress={() => navigateTo('/PerfilUsuario')}
          >
            <Ionicons
                name={isActive('/PerfilUsuario') ? 'person' : 'person-outline'}
                size={24}
                color={isActive('/PerfilUsuario') ? '#297169' : '#666'}
            />
            <Text style={[styles.tabText, isActive('/PerfilUsuario') && styles.activeText]}>Perfil</Text>
          </TouchableOpacity>
        </View>
    );
  } else if (Platform.OS === 'web') {
    return (
        <View className="w-full bg-[#DBF3EF] flex flex-row gap-x-6 items-center">
          <Link key="/InicioQuedadas" href="/InicioQuedadas" asChild>
            <Pressable className="w-fit h-fit">
              <Logo width={64} height={64} size="py-4 ml-4" color="#297169" />
            </Pressable>
          </Link>
          {TABS.map(({ label, route }) => (
              <Link key={route} href={route} asChild>
                <Pressable
                    className={"flex py-3"}
                >
                  <Text
                      className={`my-2 text-lg ${
                          isActive(route) ? 'font-bold text-[#297169]' : 'font-normal'
                      }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              </Link>
          ))}
        </View>
    );
  }

}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingTop: 5,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeText: {
    color: '#297169',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#297169',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});