import {Animated, Keyboard, Platform, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import Logo from "../Logo";
import React, {useEffect, useRef, useState} from "react";
import Constants from "expo-constants";
import Svg, {Path} from "react-native-svg";
import {io} from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from "expo-status-bar";
import forge from 'node-forge';


export default function Chat() {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false)
    const [messages, setMessages] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");

    const scrollViewRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [textInputHeight, setTextInputHeight] = useState(85);
    const [text, setText] = useState("");
    const [buttonVisible, setButtonVisible] = useState(false);
    const [inputWidth, setInputWidth] = useState("100%");
    const fadeAnim = useState(new Animated.Value(0))[0];
    const room = "miSalaDeChat2";
    const [userId, setUserId] = useState("1");
    const [userName, setUserName] = useState("UsuarioAnonimo")

    const [pribateK, setPribateK] = useState("")
    const [publicK, setPublicK] = useState("")
    const [keys, setKeys] = useState([])


    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        useEffect(() => {
            const getUserSession = async () => {
                try {
                    const session = await AsyncStorage.getItem("userSession");
                    if (session) {
                        const userData = JSON.parse(session);
                        setUserId(userData.userId);
                        setUserName(userData.nombre_usuario)
                        setPribateK(userData.clavePrivada)
                        setPublicK(userData.clavePublica)
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
                        setUserName(userData.nombre_usuario)
                        setPribateK(userData.clavePrivada)
                        setPublicK(userData.clavePublica)

                    }
                } catch (error) {
                    console.error("Error al obtener la sesión:", error);
                }
            };

            getUserSession();
        }, []);
    }

    useEffect(() => {
        if (userId === "1") return;
        const newSocket = io("http://localhost:3090", {
            query: { userId },
            autoConnect: true,
            reconnection: true,
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
            setIsConnected(true);
            console.log("Conectado al servidor con userId:", userId);

            newSocket.emit("joinRoom", room, userId, publicK);
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
            console.log("Desconectado del servidor");
        });

        return () => {
            newSocket.disconnect();
        };
    }, [userId, publicK]);

    useEffect(() => {
        if (!socket) return;

        const handleMessages = (msgs) => {
            desencriptarMensaje(msgs);
            //setMessages(Object.values(msgs));
        };
        const handlePk = (pk) => {
            setKeys([])
            const keysArray = Object.entries(pk).map(([userId, value]) => ({
                userId,
                pk: value.llavePublica,
            }));

            setKeys((prevKeys) => [...prevKeys, ...keysArray]);
        };

        socket.on("getMsgs", handleMessages);

        socket.on("getPk", handlePk);

        return () => {
            socket.off("getMsgs", handleMessages);
            socket.off("getPk", handlePk);
        };
    }, [socket]);

    useEffect(() => {
        const showListener = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideListener = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
            scrollViewRef.current?.scrollToEnd({ animated: true });
        });
        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (text.trim().length > 0) {
            setButtonVisible(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            setInputWidth("85%");
        } else {
            setButtonVisible(false);
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
            setInputWidth("100%");
        }
    }, [text]);

    const handleLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        setTextInputHeight(height + 55);
    };

    const sendMessage = () => {
        if (!socket || !nuevoMensaje.trim()) return;

        const mensajeEncriptado = encriptarMensaje(nuevoMensaje);

        socket.emit("sendMsg", room, mensajeEncriptado, userName, userId, Date.now());

    };

    const encriptarMensaje = (mensaje) => {
        const aesKey = forge.random.getBytesSync(16);
        const iv = forge.random.getBytesSync(16); // IV aleatorio

        const cipher = forge.cipher.createCipher('AES-CBC', aesKey);
        cipher.start({ iv: iv }); // Usar el IV aquí
        cipher.update(forge.util.createBuffer(mensaje));
        cipher.finish();
        const encryptedMessage = cipher.output.getBytes();

        const encryptedKeys = {};

        for (let key in keys) {
            if (keys[key].pk !== null && keys[key].pk !== ""){
                const publicKey = forge.pki.publicKeyFromPem(keys[key].pk);
                encryptedKeys[keys[key].userId] = forge.util.encode64(publicKey.encrypt(aesKey, 'RSA-OAEP'));
            }
        }

        console.log(encryptedKeys)

        return {
            message: forge.util.encode64(encryptedMessage),
            iv: forge.util.encode64(iv),  // Guardar el IV en Base64
            encryptedAESKey: encryptedKeys,
        };
    };

    const desencriptarMensaje = (mensaje) => {
        console.log(keys)
        try {
            setMessages([])
            // Recorrer todos los mensajes en el objeto `mensaje`
            for (const timestampKey of Object.keys(mensaje)) {

                const mensajeObj = mensaje[timestampKey];

                if (!mensajeObj?.mensaje?.encryptedAESKey) {
                    console.warn(`⚠️ Mensaje con timestamp ${timestampKey} no tiene claves encriptadas.`);
                    continue; // Saltar al siguiente mensaje si no hay claves
                }

                if (!pribateK || typeof pribateK !== "string") {
                    throw new Error("Clave privada no válida.");
                }

                const clavePrivada = forge.pki.privateKeyFromPem(pribateK);
                if (typeof clavePrivada !== "object" || !clavePrivada.decrypt) {
                    throw new Error("La clave privada no es válida.");
                }

                // Buscar la clave encriptada correspondiente al usuario
                const encryptedAESKey = mensajeObj.mensaje.encryptedAESKey[userId];

                if (!encryptedAESKey) {
                    console.warn(`⚠️ No se encontró clave AES encriptada para el usuario: ${userId}`);
                    continue; // Saltar al siguiente mensaje si no hay clave AES para este usuario
                }

                // Desencriptar la clave AES con la clave privada RSA
                const aesKey = clavePrivada.decrypt(forge.util.decode64(encryptedAESKey), 'RSA-OAEP');

                if (!mensajeObj.mensaje.message) {
                    console.warn(`⚠️ No hay mensaje cifrado en los datos del timestamp ${timestampKey}.`);
                    continue;
                }

                // Desencriptar el mensaje con AES
                const decipher = forge.cipher.createDecipher('AES-CBC', aesKey);
                const iv = forge.util.decode64(mensajeObj.mensaje.iv); // Asegúrate de que el IV esté correctamente en Base64

                decipher.start({ iv: iv });
                decipher.update(forge.util.createBuffer(forge.util.decode64(mensajeObj.mensaje.message)));

                const success = decipher.finish();

                if (!success) {
                    console.error("❌ Error: La desencriptación del mensaje falló.");
                    continue;
                }

                const mensajeDesencriptado = decipher.output.toString();

                const msg = {
                    usuario: mensajeObj.usuario,
                    idUsuario: mensajeObj.idUser,
                    mensaje: mensajeDesencriptado,
                    tiempo: mensajeObj.tiempo };

                setMessages((prevMessages) => [...prevMessages, msg]); // Usa el estado previo para evitar pérdida de mensajes

            }
        } catch (error) {
            console.error("❌ Error al desencriptar mensaje:", error.message);
            return null;
        }
    };





    return (
        <View style={{paddingTop: Constants.statusBarHeight}} className="bg-[#DBF3EF] w-full min-h-full h-screen relative">
            <StatusBar style="auto" />
            <View
                style={{ paddingTop: Constants.statusBarHeight }}
                className="flex w-full bg-[#297169]/30 backdrop-blur py-4 px-8"
            >
                <View className="flex flex-row items-center gap-x-5">
                    <Logo
                        size="w-12 h-12 p-2 bg-white rounded-full md:w-24 md:h-24"
                        color="#297169"
                    />
                    <Text className="text-3xl font-semibold">Chat</Text>
                </View>
            </View>

            <View style={{ flex: 1, marginBottom: textInputHeight }}>
                <ScrollView
                    ref={scrollViewRef}
                    className="px-3 flex flex-col gap-y-5"
                    contentContainerStyle={{ paddingBottom: 10 }}
                    onContentSizeChange={() =>
                        scrollViewRef.current?.scrollToEnd({ animated: true })
                    }
                >
                    {messages.map((msg, i) => (
                        <View
                            key={i}
                            className={`pl-6 pr-2 pt-3 pb-1 rounded-lg max-w-[70%] mt-4 ${
                                msg.idUsuario === userId ? "bg-blue-500 self-end rounded-br-none" : "bg-gray-700 self-start rounded-bl-none"
                            }`}
                        >
                            { msg.idUsuario !== userId &&
                                <Text className="text-yellow-300 self-start">{msg.usuario}</Text>
                            }
                            <Text className="text-white pr-4">{msg.mensaje}</Text>
                            <Text className="text-sm text-white opacity-60 self-end leading-1 pl-32">12:30</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View
                style={{ bottom: keyboardHeight }}
                className="absolute bg-white w-full flex gap-x-4 flex-row justify-center p-4"
            >
                <TextInput
                    onChange = {(e) => setNuevoMensaje(e.nativeEvent.text)}
                    placeholder="Escribe un mensaje..."
                    multiline
                    value={text}
                    onChangeText={setText}
                    onLayout={handleLayout}
                    blurOnSubmit={false}
                    className="p-2 border border-gray-300 rounded-2xl"
                    style={{
                        maxHeight: 100,
                        minHeight: 35,
                        marginBottom: 20,
                        width: inputWidth,
                    }}
                />

                {buttonVisible && (
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#00ad3a",
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={sendMessage}
                        >
                            <Svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <Path fill="none" />
                                <Path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                                <Path d="M6.5 12h14.5" />
                            </Svg>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}