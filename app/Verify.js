import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import Globals from './globals';
import {useRoute} from "@react-navigation/native";
import {router} from "expo-router";

export default function Verify() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const route = useRoute();
    const { token } = route.params || {};

    const handleVerify = async () => {
        setLoading(true);
        try {

            const res = await fetch(`http://${Globals.ip}:3080/api/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ docId: token })
            });
            const result = await res.json();
            if (res.ok && result.status) {
                setMessage(result.message || 'Verificación completada con éxito.');
                router.replace('/Login');
            } else {
                setMessage(result.message || 'No se pudo verificar el token.');
            }
        } catch (error) {
            console.error('Error en verify:', error);
            setMessage('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center items-center bg-white p-4">
            <TouchableOpacity
                className="bg-[#2C7067] py-3 px-6 rounded-lg"
                onPress={handleVerify}
            >
                <Text className="text-white text-center font-semibold">Verificar Cuenta</Text>
            </TouchableOpacity>
        </View>
    );
}
