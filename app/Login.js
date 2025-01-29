import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, Alert, TextInput, Button, View} from 'react-native';
import "../global.css"
import {useState} from "react";
import {Link} from "expo-router";
import Logo from "./Logo";


/* INICIAR LA PÁGINA: npx expo start */

export default function Login() {
    const [campoCorreo, correo] = useState('');
    const [campoContra, contrasena] = useState('');

    const subirFormulario = () => {
        if (!campoCorreo || !campoContra) {
            Alert.alert('Error', 'Por favor, completa ambos campos.');
        }else {
        }
    }



    return (
        <>
            <View className="max-w-[95%] mx-auto">
                <Text className="my-5 text-center text-balance font-bold text-4xl">Bienvenido de nuevo a Planify</Text>
            </View>
            <Logo size="w-40 h-40" color="#297169" />
            <StatusBar style="auto" />
            <Text className="my-5 font-bold text-4xl">Iniciar Sesión</Text>

            <View>

                <Text className="mt-2 font-bold">Nombre:</Text>
                <TextInput
                        className="min-w-60"
                        style={styles.input}
                        placeholder="Correo electrónico"
                        value={campoCorreo}
                        onChangeText={correo}
                    />

                <Text className="mt-2 font-bold">Nombre:</Text>
                <TextInput
                        className="min-w-60"
                        style={styles.input}
                        placeholder="Contraseña"
                        value={campoContra}
                        onChangeText={contrasena}
                    />
            </View>
            <Text className={"mb-10 mt-2"}>No tienes cuenta? Registrate <Link href="/Register" style={styles.enlace} className="font-bold">aquí</Link></Text>
            <Button title="Enviar" onPress={subirFormulario}>
            </Button>

        </>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginTop: 4,
        backgroundColor: '#fff',
    },
    enlace: {
        color: "#0000FF",
    },
});
