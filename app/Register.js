import {Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from "react";
import {StatusBar} from "expo-status-bar";
import {Link, router} from "expo-router";
import Logo from "./Logo";
import Constants from "expo-constants";
import {MaterialIcons} from '@expo/vector-icons';
import forge from 'node-forge';
import CryptoJS from 'crypto-js';
import Globals from "./globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {

    const [campoCorreo, setCorreo] = useState('');
    const [campoNombre, setNombre] = useState('');
    const [campoApellidos, setApellidos] = useState('');
    const [campoUsuario, setUsuario] = useState('');
    const [campoContra, setContra] = useState('');
    const [campoRepContra, setRepContra] = useState('');

    const [secureText, setSecureText] = useState(true);
    const [secureRepText, setSecureRepText] = useState(true);

    const [errorMensaje, setErrorMensaje] = useState('');

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        useEffect(() => {
            const getUserSession = async () => {
                try {
                    const session = await AsyncStorage.getItem("userSession");
                    if (session) {
                        router.replace('/InicioQuedadas');
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
                    const session = localStorage.getItem("userSession");

                    if (session) {
                        router.replace('/InicioQuedadas');
                    }
                } catch (error) {
                    console.error("Error al obtener la sesión:", error);
                }
            };
            getUserSession();
        }, []);
    }

    const validarContrasena = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
        return regex.test(password);
    };

    const mostrarErrorTemporal = (mensaje) => {
        setErrorMensaje(mensaje);
        setTimeout(() => setErrorMensaje(''), 20000);
    };

    const subirFormulario = async () => {
            if (!campoCorreo || !campoNombre || !campoContra || !campoRepContra) {
                mostrarErrorTemporal('Por favor, completa todos los campos.');
                return;
            }

            if (!validarContrasena(campoContra)) {
                mostrarErrorTemporal('La contraseña debe tener entre 8 y 32 caracteres, incluir mayúsculas, minúsculas, números y símbolos.');
                return;
            }

            if (campoContra !== campoRepContra) {
                mostrarErrorTemporal('Las contraseñas no coinciden.');
                return;
            }

            // Generar clave pública y privada
            const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

            const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
            const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);

            const contrasenaHash = await HashContrasena(campoContra);

            const params = {
                correo: campoCorreo,
                nombre: campoNombre,
                nombre_usuario: campoUsuario,
                apellidos: campoApellidos,
                contrasena: campoContra,
                clavePublica: publicKeyPem,
                clavePrivada: encryptPrivateKey(privateKeyPem, contrasenaHash)
            };

            try {
                const response = await fetch(`http://${Globals.ip}:3080/api/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                });

                const jsonResponse = await response.json();

                if (response.status !== 200) {
                } else {
                    window.alert("Verifica tu cuenta a través del correo");
                    router.replace('/InicioQuedadas');

                    Alert.alert(
                        'Info',
                        'Verifica tu cuenta a través del correo',
                        [
                            {
                                text: 'OK',
                                onPress: () => router.replace('/InicioQuedadas'),
                            },
                        ],
                        { cancelable: false }
                    );
                }
            } catch (error) {
                console.log("un error: " + error);
                Alert.alert('Error', 'No se pudo conectar con el servidor.');
            }

    };
    const HashContrasena = async (contrasena) => {
        return CryptoJS.SHA256(contrasena).toString(CryptoJS.enc.Hex);
    };

    const encryptPrivateKey = (privateKeyPem, password) => {
        const encryptedPrivateKey = forge.pki.encryptRsaPrivateKey(
            forge.pki.privateKeyFromPem(privateKeyPem),
            password
        );
        return encryptedPrivateKey;
    };

    return (
        <>
            <ScrollView style={styles.view} className="w-full min-h-full lg:min-h-screen bg-[#DBF3EF] pb-10">
                <View className="flex items-center justify-center">
                    <View className="max-w-[95%] mx-auto">
                        <Text className="my-5 text-center text-balance font-bold text-4xl">Bienvenido a Planify</Text>
                    </View>
                    <Logo size="w-32 h-32 mb-5 md:w-60 md:h-60" color="#297169" />
                    <StatusBar style="auto" />

                    <View className="h-32 items-center justify-center">
                        <Text className="w-1/3 mx-auto font-bold text-red-500">{errorMensaje}</Text>
                    </View>

                    <View className="lg:w-1/3 lg:mx-auto">
                        <View className="flex lg:flex-row gap-x-4">
                            <View className="w-[48.25%]">
                                <Text className="mt-2 font-bold">Nombre:</Text>
                                <TextInput
                                    className="w-72 lg:w-full bg-white/60"
                                    style={styles.input}
                                    placeholder="Nombre"
                                    autoCapitalize="words"
                                    value={campoNombre}
                                    onChangeText={setNombre}
                                />
                            </View>
                            <View className="w-[48.25%]">
                                <Text className="mt-2 font-bold">Apellidos:</Text>
                                <TextInput
                                    className="w-72 lg:w-full bg-white/60"
                                    style={styles.input}
                                    placeholder="Apellidos"
                                    autoCapitalize="words"
                                    value={campoApellidos}
                                    onChangeText={setApellidos}
                                />
                            </View>
                        </View>

                        <Text className="mt-2 font-bold">Nombre de Usuario:</Text>
                        <TextInput
                            className="w-72 lg:w-full bg-white/60"
                            style={styles.input}
                            placeholder="Nombre de Usuario"
                            keyboardType="default"
                            autoCapitalize="none"
                            value={campoUsuario}
                            onChangeText={setUsuario}
                        />

                        <Text className="mt-2 font-bold">Correo electrónico:</Text>
                        <TextInput
                            className="w-72 lg:w-full bg-white/60"
                            style={styles.input}
                            placeholder="correo@ejemplo.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={campoCorreo}
                            onChangeText={setCorreo}
                        />

                        <Text className="mt-2 font-bold">Contraseña:</Text>
                        <View className="flex flex-row items-center relative">
                            <TextInput
                                secureTextEntry={secureText}
                                className="w-72 lg:w-full bg-white/60"
                                style={styles.input}
                                placeholder="Contraseña"
                                keyboardType="default"
                                autoCapitalize="none"
                                value={campoContra}
                                onChangeText={setContra}
                            />
                            <TouchableOpacity onPress={() => setSecureText(!secureText)} className="absolute right-2">
                                <MaterialIcons name={secureText ? 'visibility-off' : 'visibility'} size={20} color="rgba(0, 0, 0, 0.3)" />
                            </TouchableOpacity>
                        </View>

                        <Text className="mt-2 font-bold">Repetir Contraseña:</Text>
                        <View className="flex flex-row items-center relative">
                            <TextInput
                                secureTextEntry={secureRepText}
                                className="w-72 lg:w-full bg-white/60"
                                style={styles.input}
                                placeholder="Confirmar Contraseña"
                                keyboardType="default"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={campoRepContra}
                                onChangeText={setRepContra}
                            />
                            <TouchableOpacity onPress={() => setSecureRepText(!secureRepText)} className="absolute right-2">
                                <MaterialIcons name={secureRepText ? 'visibility-off' : 'visibility'} size={20} color="rgba(0, 0, 0, 0.3)" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text className="mb-10 mt-2">Ya tienes una cuenta? Inicia sesión <Link href="/Login" style={styles.enlace} className="font-bold">aquí</Link></Text>

                    <TouchableOpacity
                        className="bg-[#2C7067] border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                        onPress={subirFormulario}
                    >
                        <Text className="text-white font-semibold">
                            Registrarse
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    view: {
        paddingTop: Constants.statusBarHeight,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginTop: 4,
    },
    enlace: {
        color: "#0000FF",
    },
});