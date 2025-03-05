import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform} from 'react-native';
import {router} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusBar} from "expo-status-bar";
import Constants from "expo-constants";

export default function UnirseAQuedada({ navigation }){
    const [invitationCode, setInvitationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        useEffect(() => {
            const getUserSession = async () => {
                try {
                    const session = await AsyncStorage.getItem("userSession");
                    if (session) {
                        const userData = JSON.parse(session);
                        setUserId(userData.userId);
                    }
                } catch (error) {
                    console.error("Error al obtener la sesión:", error);
                }
            };

            getUserSession();
        }, []);
    } else if (Platform.OS === 'web') {
        useEffect(() => {
            const getUserSession = async () => {
                try {
                    const session = sessionStorage.getItem("userSession");
                    if (session) {
                        const userData = JSON.parse(session);
                        setUserId(userData.userId);
                    }
                } catch (error) {
                    console.error("Error al obtener la sesión:", error);
                }
            };

            getUserSession();
        }, []);
    }

    const handleJoinQuedada = async () => {
        setErrorMessage('');
        setLoading(true);

        try {
            const response = await fetch('http://192.168.17.198:3080/api/joinHangout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    code: invitationCode,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setLoading(false);
                throw new Error(errorData.message || "Error al unirse a la quedada");
            }

            const data = await response.json();
            if (data.status) {
                router.push('/MenuNoLog');
            } else {
                setLoading(false);
                setErrorMessage(data.message);
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000);
            }

        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(error.message);
        }
    };
    return (
        <View style={{paddingTop: Constants.statusBarHeight}} className="w-full flex flex-col items-center justify-center min-h-full lg:min-h-screen bg-[#DBF3EF] pb-10">
            <StatusBar style="auto" />
            <View className="max-w-[95%] mx-auto">
                <Text className="my-5 text-center text-balance font-bold text-4xl">Código de Invitación:</Text>
            </View>
            <TextInput
                className="w-72 lg:w-48 bg-white/60"
                style={styles.input}
                placeholder="f2TwER6i"
                value={invitationCode}
                onChangeText={setInvitationCode}
            />
            <View className="h-3 w-fit mx-auto">
                {errorMessage && <Text className="text-red-500 text-center font-semibold mt-2">{errorMessage}</Text>}
            </View>
            <TouchableOpacity
                disabled={loading}
                className="mt-10 bg-[#2C7067] border-[#2C7067] disabled:bg-gray-400 disabled:border-gray-400 border-2 py-4 lg:py-2 px-8 lg:px-4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                onPress={handleJoinQuedada}
            >
                <Text className="text-white font-semibold">
                    Entrar
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: 'black',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginTop: 4,
    }
});