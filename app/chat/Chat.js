import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image } from "react-native";
import Logo from "../Logo";
import {useNavigation, useRoute} from "@react-navigation/native";
import Constants from "expo-constants";
import Svg, { Path } from "react-native-svg";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import forge from "node-forge";
import Globals from "../globals";
import {useRootNavigationState, useRouter} from "expo-router";

export default function Chat() {
    const navigation = useNavigation();
    const router = useRouter();
    const route = useRoute();
    const navigationState = useRootNavigationState();

    const { id } = route.params || {};
    const [quedada, setQuedada] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const scrollViewRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [textInputHeight, setTextInputHeight] = useState(85);
    const [buttonVisible, setButtonVisible] = useState(false);
    const [inputWidth, setInputWidth] = useState("100%");
    const fadeAnim = useState(new Animated.Value(0))[0];

    const room = "ChatIdQuedada" + id;
    const [userId, setUserId] = useState("1");
    const [userName, setUserName] = useState("UsuarioAnonimo");
    const [pribateK, setPribateK] = useState("");
    const [publicK, setPublicK] = useState("");
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        const checkSession = async () => {
            if (!navigationState?.key) return;

            try {
                let session = null;

                if (Platform.OS === 'web') {
                    session = localStorage.getItem("userSession");
                } else {
                    session = await AsyncStorage.getItem("userSession");
                }

                if (session) {
                    const userData = JSON.parse(session);
                    setUserId(userData.userId);
                    setUserName(userData.nombre_usuario);
                    setPribateK(userData.clavePrivada);
                    setPublicK(userData.clavePublica);

                    if (userData.userId && id) {
                        await fetchHangoutData(userData.userId, id);
                    }
                } else {
                    router.replace('/MenuNoLog');
                }
            } catch (error) {
                console.error("Error al obtener la sesión:", error);
                router.replace('/MenuNoLog');
            }
        };

        checkSession();
    }, [navigationState?.key, id]);

    const fetchHangoutData = async (userId, id) => {
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const response = await fetch(`http://${Globals.ip}:3080/api/getHangoutById`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, hangoutId: id }),
                signal,
            });
            if (!response.ok) {
                router.replace('/chat/Chats');
            }
            const data = await response.json();
            console.log("🚩 fetchQuedada data:", data);
            setQuedada(Array.isArray(data) ? data[0] : data);
        } catch (error) {
            if (signal.aborted) {
                console.log("Fetch aborted");
            } else {
                console.error('Error fetching quedada:', error);
            }
        }
    };

    // Conexión Socket.IO
    useEffect(() => {
        if (userId === "1") return;
        const newSocket = io(`http://${Globals.ip}:3090`, {
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

        return () => newSocket.disconnect();
    }, [userId, publicK]);

    // Recepción de mensajes y claves públicas
    useEffect(() => {
        if (!socket) return;
        const handleMessages = (msgs) => desencriptarMensaje(msgs);
        const handlePk = (pk) => {
            const keysArray = Object.entries(pk).map(([uid, val]) => ({ userId: uid, pk: val.llavePublica }));
            setKeys(keysArray);
        };
        socket.on("getMsgs", handleMessages);
        socket.on("getPk", handlePk);
        return () => {
            socket.off("getMsgs", handleMessages);
            socket.off("getPk", handlePk);
        };
    }, [socket]);

    // Manejo teclado
    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", e => setKeyboardHeight(e.endCoordinates.height));
        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
            scrollViewRef.current?.scrollToEnd({ animated: true });
        });
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    // Mostrar/ocultar botón enviar
    useEffect(() => {
        if (text.trim()) {
            setButtonVisible(true);
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
            setInputWidth("85%");
        } else {
            setButtonVisible(false);
            Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
            setInputWidth("100%");
        }
    }, [text]);

    const handleLayout = (e) => setTextInputHeight(e.nativeEvent.layout.height + 55);

    const sendMessage = () => {
        if (!socket || !text.trim()) return;
        const mensajeEncriptado = encriptarMensaje(text);
        socket.emit("sendMsg", room, mensajeEncriptado, userName, userId, Date.now());
        setText("");
    };

    const encriptarMensaje = (mensaje) => {
        const aesKey = forge.random.getBytesSync(16);
        const iv = forge.random.getBytesSync(16);
        const cipher = forge.cipher.createCipher('AES-CBC', aesKey);
        cipher.start({ iv });
        cipher.update(forge.util.createBuffer(mensaje));
        cipher.finish();
        const encryptedMessage = cipher.output.getBytes();
        const encryptedKeys = {};
        keys.forEach(k => {
            if (k.pk) {
                const pub = forge.pki.publicKeyFromPem(k.pk);
                encryptedKeys[k.userId] = forge.util.encode64(pub.encrypt(aesKey, 'RSA-OAEP'));
            }
        });
        return {
            message: forge.util.encode64(encryptedMessage),
            iv: forge.util.encode64(iv),
            encryptedAESKey: encryptedKeys
        };
    };

    const desencriptarMensaje = (mensaje) => {
        try {
            const nuevosMensajes = [];
            for (const ts of Object.keys(mensaje)) {
                const mObj = mensaje[ts];
                const encryptedAESKey = mObj.mensaje.encryptedAESKey?.[userId];
                if (!encryptedAESKey) continue;
                const priv = forge.pki.privateKeyFromPem(pribateK);
                const aesKey = priv.decrypt(forge.util.decode64(encryptedAESKey), 'RSA-OAEP');
                const dec = forge.cipher.createDecipher('AES-CBC', aesKey);
                const iv = forge.util.decode64(mObj.mensaje.iv);
                dec.start({ iv });
                dec.update(forge.util.createBuffer(forge.util.decode64(mObj.mensaje.message)));
                if (!dec.finish()) continue;
                const texto = dec.output.toString();

                // Acumulamos los mensajes de manera local
                nuevosMensajes.push({
                    usuario: mObj.usuario,
                    idUsuario: mObj.idUser,
                    mensaje: texto,
                    tiempo: mObj.tiempo
                });
            }

            // Actualizamos el estado de mensajes solo una vez
            setMessages(prev => [...prev, ...nuevosMensajes]);
        } catch (error) {
            console.error("Error desencriptando:", error);
        }
    };

    return (
        <View style={{ paddingTop: Constants.statusBarHeight }} className="bg-[#DBF3EF] w-full min-h-full h-screen relative">
            <StatusBar style="auto" />
            <View className="flex w-full bg-[#297169]/30 backdrop-blur py-4 px-8">
                <View className="flex flex-row items-center gap-x-5">
                    {quedada?.link_imagen ? (
                        <Image source={{ uri: quedada.link_imagen }} className="w-12 h-12 rounded-full bg-white md:w-24 md:h-24" />
                    ) : (
                        <Logo size="w-12 h-12 p-2 bg-white rounded-full md:w-24 md:h-24" color="#297169" />
                    )}
                    <Text style={{ fontSize: 24, fontWeight: '600', color: '#000' }}>
                        {quedada?.nombre_quedada ?? 'Cargando…'}
                    </Text>
                </View>
            </View>

            <View style={{ flex: 1, marginBottom: textInputHeight }}>
                <ScrollView
                    ref={scrollViewRef}
                    className="px-3 flex flex-col gap-y-5"
                    contentContainerStyle={{ paddingBottom: 10 }}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((msg, i) => (
                        <View
                            key={i}
                            className={`pl-6 pr-2 pt-3 pb-1 rounded-lg max-w-[70%] mt-4 ${
                                msg.idUsuario === userId ? 'bg-blue-500 self-end rounded-br-none' : 'bg-gray-700 self-start rounded-bl-none'
                            }`}
                        >
                            {msg.idUsuario !== userId && (
                                <Text className="text-yellow-300 self-start">{msg.usuario}</Text>
                            )}
                            <Text className="text-white pr-4">{msg.mensaje}</Text>
                            <Text className="text-sm text-white opacity-60 self-end leading-1 pl-32">
                                {new Date(msg.tiempo).toLocaleTimeString()}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={{ bottom: keyboardHeight }} className="absolute bg-white w-full flex gap-x-4 flex-row justify-center p-4">
                <TextInput
                    placeholder="Escribe un mensaje..."
                    multiline
                    value={text}
                    onChangeText={setText}
                    onLayout={handleLayout}
                    blurOnSubmit={false}
                    className="p-2 border border-gray-300 rounded-2xl"
                    style={{ maxHeight: 100, minHeight: 35, marginBottom: 20, width: inputWidth }}
                />
                {buttonVisible && (
                    <Animated.View style={{ opacity: fadeAnim, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ backgroundColor: '#00ad3a', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}
                            onPress={sendMessage}
                        >
                            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
