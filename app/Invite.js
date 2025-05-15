import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Globals from './globals';
import { useRouter, useSearchParams } from 'expo-router';

export default function Invite() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { code } = useSearchParams();

    useEffect(() => {
        (async () => {
            try {
                // 1) Obtener userId de sesión
                let session;
                if (Platform.OS === 'web') {
                    session = localStorage.getItem('userSession');
                } else {
                    session = await AsyncStorage.getItem('userSession');
                }
                if (!session) {
                    router.replace('/Login');
                    return;
                }
                const { userId } = JSON.parse(session);

                const res = await fetch(`http://${Globals.ip}:3080/api/joinHangout`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, code })
                });
                const result = await res.json();
                if (res.ok && result.status) {
                    setMessage('Te has unido correctamente a la quedada.');
                } else {
                    setMessage(result.message || 'No se pudo unir a la quedada.');
                }
            } catch (error) {
                console.error('Error en joinHangout:', error);
                setMessage('Error al conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        })();
    }, [code]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center items-center bg-white p-4">
            <Text className="text-xl font-semibold text-center mb-4">{message}</Text>
            <Text className="text-center text-gray-500">Código: {code}</Text>
        </View>
    );
}
