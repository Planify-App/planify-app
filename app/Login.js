import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, Alert, TextInput, Button, View, TouchableOpacity} from 'react-native';
import "../global.css"
import {useState} from "react";
import {Link} from "expo-router";
import Logo from "./Logo";
import Constants from "expo-constants";


/* INICIAR LA PÁGINA: npx expo start */

export default function Login() {
    const [campoCorreo, correo] = useState('');
    const [campoContra, contrasena] = useState('');

    const subirFormulario = async () => {
        // Verifica que ambos campos no estén vacíos
        if (!campoCorreo || !campoContra) {
            Alert.alert('Error', 'Por favor, completa ambos campos.');
            return;
        }

        try {
            // Hacemos la petición POST con fetch
            const response = await fetch('http://localhost:3080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Asegúrate de que tu API key esté correcta
                    'x-api-key': 'planify-CZI=om?L7IUkjHmlWdh7km9oGsO3?zS?EQtysKAr679njqFIgXWTSnsiKaPBcLj4EW30AVdwCv830N2fksjPzlLl/4wexLg3QbJofXhFrwZFCE-4Uqk9uF-03=fr5-dvzsa06SYy2JNNuUX!QpZ?6jwb/dGsXk/077FUCocJVdvvV!NKoG5AfyN2VFduROCAgepKf/gA54NqtErU9?0Zz?fHp9dpWtCXsBNdWsE1cb-U1zf6CTQ70CSwFObf=MibBavqV=wrumLwFo4nPXGv=ZC76dIgMQNULl99CEyOtSuYSkJF8wsVnxO?igxxh2ogpMmNwd4sfM3sSqA=si9o3ryiendeAdRN9D39fPtJSqh8fe8H97amqNS0fb6mPXheXcfV?Lt3hmvU0-1kTy//uOfNrPy-sj0m0IMaPA-sjIsmLbIRo=wq9dziKxp8zH9NKEQjIQ=fvrMVG4gGf!!Itn4N4WcSmI?UiwXaFBCnuq8JEHqXP-zLTH8I?cTq!FtbQeXGVVpZ6jY8zckrsLIXC6AvOa1S8E/yXCN6siCz0Y0PqhfwlWDG/GMPzzzCQ0t-PLroUoFahB=KAm6TluaaP9kOOEaOkVf4-=4gqY9?t88D=rq0!-2Rzope5bSPPKkfoAqFBc=lInJPAY2ezkW1!1oZgy8CNd22tj4DDFujs-3DDNHgfIhJH1B84PD8/TEH9RZh!Oi0Hs=2Sx5gX4usCnsyqefW4ySR2zhGHN5NXtzOR!PBxq8JOXV6D3rB-JgvP/ZZG8M7HiPbUbD6Z1-1oWkPB7IDDRcR1UrNcA!anMsQtVKc?at4f/1HbkWSK-oMGBYApNtKei?i5ZvaJhu-mS-oPtCpOx/HhklLNx9UGVjtHnLHzP57B0OncY6dVFZhbtMOmLRzJqThJ?PLVqf9Jv7xbfLGU/8hZtFm7QLybxu/G/?UHDeJZRzLMXNgfgeOtWE/12E6iAmFyy8mEPCENNzcKXS?TLViP=GrlmxJkH57cTGi/48egWoVV',
                },
                body: JSON.stringify({
                    correo: campoCorreo,
                    contrasena: campoContra,
                }),
            });

            // Esperamos la respuesta como JSON
            const data = await response.json();

            // Verificamos si la respuesta es correcta
            if (response) {
                console.log("HECHODJAODJSPDJAÑLJFSKDÑAHÑASLFJA")
                Alert.alert('Éxito', data.message || 'Bienvenido a Planify');
                // Aquí puedes redirigir al usuario a la página principal, si es necesario
            } else {
                Alert.alert('Error', data.message || 'Credenciales inválidas.');
            }

        } catch (error) {
            Alert.alert('Error', 'Ocurrió un problema con la solicitud.');
            console.error('Error en la petición:', error);
        }
    };



    return (
        <>
            <View style={styles.view} className="w-full min-h-full lg:min-h-screen bg-[#DBF3EF] pb-10">
                <View className="flex items-center justify-center">
                    <View className="max-w-[89%] mx-auto">
                        <Text className="my-5 text-center text-balance font-bold text-4xl">Bienvenido de nuevo a Planify</Text>
                    </View>
                    <Logo size="w-40 h-40" color="#297169" />
                    <StatusBar style="auto" />
                    <Text className="my-5 font-bold text-4xl">Iniciar Sesión</Text>

                    <View>

                        <Text className="mt-2 font-bold">Nombre:</Text>
                        <TextInput
                            className="w-72 bg-white/60"
                            style={styles.input}
                            placeholder="Correo electrónico"
                            value={campoCorreo}
                            onChangeText={correo}
                        />

                        <Text className="mt-2 font-bold">Nombre:</Text>
                        <TextInput
                            className="w-72 bg-white/60"
                            style={styles.input}
                            placeholder="Contraseña"
                            value={campoContra}
                            onChangeText={contrasena}
                        />
                    </View>
                    <Text className={"mb-10 mt-2"}>No tienes cuenta? Registrate <Link href="/Register" style={styles.enlace} className="font-bold">aquí</Link></Text>
                    <TouchableOpacity className="bg-[#2C7067] border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                                      onPress={subirFormulario}
                    >
                        <Text className="text-white font-semibold">
                            Iniciar Sesión
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
        backgroundColor: '#fff',
    },
    enlace: {
        color: "#0000FF",
    },
});
