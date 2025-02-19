import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';

export default function UnirseAQuedada({ navigation }){
    const [invitationCode, setInvitationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleJoinQuedada = async () => {
        setErrorMessage('');

        if (!invitationCode) {
            setErrorMessage("Por favor, introduce un código de invitación.");
            return;
        }

        try {
            const correo = 'correo_del_usuario@example.com';
            const response = await fetch('http://localhost:3080/api/joinHangout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: "ed@d.com",
                    code: invitationCode,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al unirse a la quedada");
            }

            const data = await response.json();
            if (data.status) {
                Alert.alert("Éxito", data.message, [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate('InicioQuedadas'),
                    },
                ]);
            } else {
                setErrorMessage(data.message);
            }

        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(error.message);
        }
    };
    return (
        <View style={styles.container} className="w-full min-h-full lg:min-h-screen bg-[#DBF3EF] pb-10">
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
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>} {/* Display error message */}
            <TouchableOpacity
                className="mt-10 bg-[#2C7067] border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px-4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
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