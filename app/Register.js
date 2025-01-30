import {Text, Alert, TextInput, StyleSheet, View, TouchableOpacity} from 'react-native';
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import Logo from "./Logo";
import Constants from "expo-constants";
import { MaterialIcons } from '@expo/vector-icons';

export default function Register() {
    const [campoCorreo, setCorreo] = useState('');
    const [campoNombre, setNombre] = useState('');
    const [campoApellido, setApellido] = useState('');
    const [campoUsuario, setUsuario] = useState('');
    const [campoContra, setContra] = useState('');
    const [campoRepContra, setRepContra] = useState('');

    const [secureText, setSecureText] = useState(true);
    const [secureRepText, setSecureRepText] = useState(true);


    const subirFormulario = async () => {
        try {
            if (!campoCorreo || !campoNombre || !campoContra || !campoRepContra) {
                Alert.alert('Error', 'Por favor, completa todos los campos.');
                return;
            }

            if (campoContra !== campoRepContra) {
                Alert.alert('Error', 'Las contraseñas no coinciden.');
                return;
            }

            const params = {
                correo: campoCorreo,
                nombre: campoNombre,
                nombre_usuario: campoUsuario,
                contrasena: campoContra,
            };

            const response = await fetch("http://localhost:3080/api/register", {
                method: 'POST',
                headers: {
                    'x-api-key': "planify-CZI=om?L7IUkjHmlWdh7km9oGsO3?zS?EQtysKAr679njqFIgXWTSnsiKaPBcLj4EW30AVdwCv830N2fksjPzlLl/4wexLg3QbJofXhFrwZFCE-4Uqk9uF-03=fr5-dvzsa06SYy2JNNuUX!QpZ?6jwb/dGsXk/077FUCocJVdvvV!NKoG5AfyN2VFduROCAgepKf/gA54NqtErU9?0Zz?fHp9dpWtCXsBNdWsE1cb-U1zf6CTQ70CSwFObf=MibBavqV=wrumLwFo4nPXGv=ZC76dIgMQNULl99CEyOtSuYSkJF8wsVnxO?igxxh2ogpMmNwd4sfM3sSqA=si9o3ryiendeAdRN9D39fPtJSqh8fe8H97amqNS0fb6mPXheXcfV?Lt3hmvU0-1kTy//uOfNrPy-sj0m0IMaPA-sjIsmLbIRo=wq9dziKxp8zH9NKEQjIQ=fvrMVG4gGf!!Itn4N4WcSmI?UiwXaFBCnuq8JEHqXP-zLTH8I?cTq!FtbQeXGVVpZ6jY8zckrsLIXC6AvOa1S8E/yXCN6siCz0Y0PqhfwlWDG/GMPzzzCQ0t-PLroUoFahB=KAm6TluaaP9kOOEaOkVf4-=4gqY9?t88D=rq0!-2Rzope5bSPPKkfoAqFBc=lInJPAY2ezkW1!1oZgy8CNd22tj4DDFujs-3DDNHgfIhJH1B84PD8/TEH9RZh!Oi0Hs=2Sx5gX4usCnsyqefW4ySR2zhGHN5NXtzOR!PBxq8JOXV6D3rB-JgvP/ZZG8M7HiPbUbD6Z1-1oWkPB7IDDRcR1UrNcA!anMsQtVKc?at4f/1HbkWSK-oMGBYApNtKei?i5ZvaJhu-mS-oPtCpOx/HhklLNx9UGVjtHnLHzP57B0OncY6dVFZhbtMOmLRzJqThJ?PLVqf9Jv7xbfLGU/8hZtFm7QLybxu/G/?UHDeJZRzLMXNgfgeOtWE/12E6iAmFyy8mEPCENNzcKXS?TLViP=GrlmxJkH57cTGi/48egWoVV",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            }).then(response => console.log(response.json()))
            .catch(error => console.log("un error " + error));

            if (!response.ok) {
                const errorResponse = await response.json();
                Alert.alert('Error', `Error: ${response.status} - ${errorResponse.message}`);
            } else {
                const jsonResponse = await response.json();
                Alert.alert('Éxito', `Usuario registrado exitosamente: ${jsonResponse.message}`);
                console.log(response.json())
            }
        } catch (error) {
            Alert.alert('Error', `Error de conexión: ${error.message}`);
        }
    };

    return (
        <>
            <View style={styles.view} className="w-full min-h-full lg:min-h-screen bg-[#DBF3EF] pb-10">
                <View className="flex items-center justify-center">
                    <View className="max-w-[95%] mx-auto">
                        <Text className="my-5 text-center text-balance font-bold text-4xl">Bienvenido a Planify</Text>
                    </View>
                    <Logo size="w-40 h-40" color="#297169" />
                    <StatusBar style="auto" />

                    <Text className="my-5 font-bold text-4xl">REGISTRO</Text>

                    <View className="lg:w-1/3 lg:mx-auto">
                        <View className="flex lg:flex-row gap-x-4 mx-auto">
                            <View>
                                <Text className="mt-2 font-bold">Nombre:</Text>
                                <TextInput
                                    className="w-72 lg:w-48 bg-white/60"
                                    style={styles.input}
                                    placeholder="Nombre"
                                    value={campoNombre}
                                    onChangeText={setNombre}
                                />
                            </View>
                            <View>
                                <Text className="mt-2 font-bold">Apellidos:</Text>
                                <TextInput
                                    className="w-72 lg:w-[18.7rem] bg-white/60"
                                    style={styles.input}
                                    placeholder="Apellidos"
                                    value={campoApellido}
                                    onChangeText={setApellido}
                                />
                            </View>
                        </View>

                        <Text className="mt-2 font-bold">Nombre de Usuario:</Text>
                        <TextInput
                            className="w-72 lg:w-full bg-white/60"
                            style={styles.input}
                            placeholder="Nombre de Usuario"
                            value={campoUsuario}
                            onChangeText={setUsuario}
                        />

                        <Text className="mt-2 font-bold">Correo electrónico:</Text>
                        <TextInput
                            className="w-72 lg:w-full bg-white/60"
                            style={styles.input}
                            placeholder="correo@ejemplo.com"
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
                                placeholder="Repetir Contraseña"
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
            </View>
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