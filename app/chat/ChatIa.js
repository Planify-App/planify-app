import {
    Alert,
    Animated,
    Button,
    Keyboard, Linking, Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Logo from "../Logo";
import React, { memo, useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import Svg, { Path } from "react-native-svg";
import { StatusBar } from "expo-status-bar";
import * as Location from 'expo-location';
import { MultipleSelectList, SelectList } from "react-native-dropdown-select-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import {useRootNavigationState, useRouter} from "expo-router";
import Globals from "../globals";

export default function ChatIa() {
    const router = useRouter();
    const navigationState = useRootNavigationState();
    const [userId, setUserId] = useState(null);


    const scrollViewRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [textInputHeight, setTextInputHeight] = useState(85);
    const [text, setText] = useState("");
    const [buttonVisible, setButtonVisible] = useState(false);
    const [inputWidth, setInputWidth] = useState("100%");
    const fadeAnim = useState(new Animated.Value(0))[0];
    const [typeSelected, setTypeSelected] = useState(false);
    const [quantity, setQuantity] = useState('1');
    const [type, setType] = useState(null);
    const [budget, setBudget] = useState(null);
    const [coords, setCoords] = useState(null);
    const [selectedRestoration, setSelectedRestoration] = useState(false);

    const [messages, setMessages] = useState([]); // Estado para los mensajes
    const [loading, setLoading] = useState(true); // Estado para la carga de mensajes
    const [error, setError] = useState(null); // Estado para manejar errores

    const counter = useRef(0);

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
                } else {
                    router.replace('/MenuNoLog');
                }
            } catch (error) {
                console.error("Error al obtener la sesión:", error);
                router.replace('/MenuNoLog');
            }
        };

        checkSession();
    }, [navigationState?.key]);

    useEffect(() => {
        loadMessages();
    }, [userId]);

    const renderNestedData = (data, keyPrefix = '') => {
        return Object.entries(data).map(([key, value]) => {
            const currentKey = keyPrefix + key;
            if (typeof value === 'object' && value !== null) {
                const name = value.nombre;
                return (
                    <View key={currentKey} style={{ paddingLeft: 10, marginTop: 4 }}>
                        <Text style={{ fontWeight: 'bold', color: '#37968c', textDecorationLine: 'underline' }}>{name}:</Text>
                        {renderNestedData(value, currentKey + '-')}
                    </View>
                );
            }
            var field_name;
            var field_value;
            if (key === "descripcion") {
                field_name = "Descripción: ";
                field_value = value.toString();
            } else if (key === "tipo") {
                field_name = "Tipo de local: ";
                field_value = value.toString();
            } else if (key === "precio") {
                field_name = "Precio: ";
                field_value = value.toString();
            } else if (key === "direccion") {
                field_name = "Dirección: ";
                field_value = value.toString();
            } else if (key === "enlace_google_maps") {
                field_name = "Enlace a Google Maps";
                field_value = value.toString();
                return (
                    <TouchableOpacity
                        onPress={() => Linking.openURL(field_value)}
                        style={{
                            marginRight: 10,
                            backgroundColor: '#297169',
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 'fit-content',
                            margin: 5,
                            marginLeft: 10,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Abrir enlace: ${field_name}`}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                            {field_name}
                        </Text>
                    </TouchableOpacity>
                );
            } else if (key === "estado") {
                field_name = "Estado: ";
                field_value = value.toString();
            } else if (key === "horario") {
                field_name = "Horario:\n";
                field_value = value.toString().split(", ").join("\n");
            } else if (key === "nombre") {
                return
            } else if (key === "distancia_metros") {
                field_name = "Distancia en metros: ";
                field_value = value.toString();
            }
            return (
                <Text key={currentKey} style={{ marginLeft: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Text style={{ color: '#57b9ac', fontWeight: 'bold' }}>
                        {field_name}
                    </Text>
                    <Text style={{ color: 'white' }}>
                        {field_value}
                    </Text>
                </Text>

            );
        });
    };

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
            return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        console.log(loc.coords);
        return loc.coords;
    };

    useEffect(() => {
        if (type === "Restauración") {
            setSelectedRestoration(true);
        } else {
            setSelectedRestoration(false);
        }
    }, [type]);
    const loadMessages = async () => {
        try {
            console.log("userid load: " + userId);
            if (!userId) return;
            const response = await fetch(`http://${Globals.ip}:3080/api/getAiMessages/${userId}`);
            console.log(response);
            const mensajesData = await response.json();
            console.log('Datos del servidor:', mensajesData);

            if (!mensajesData || Object.keys(mensajesData).length === 0) {
                setMessages([]);
            } else {
                // Convertimos el documento en un array de mensajes
                const mensajesArray = Object.values(mensajesData);
                setMessages(mensajesArray);
            }
        } catch (error) {
            setError('Error al obtener los mensajes');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (counter.current <= 0) {
            counter.current = 0;
            return;
        }
        loadMessages();
        counter.current -= 1;
    }, );

    const requestIa = async () => {
        try {
            const location = await getLocation();
            if (!location) return;

            const coordsString = location.latitude + ", " + location.longitude;
            setCoords(coordsString);

            const promptParams = {
                coords: coordsString,
                cantidad: quantity,
                busqueda_de: type,
                tipoRestauracion: budget,
                id: userId
            };
            console.log(promptParams);

            const response = await fetch(`http://${Globals.ip}:3080/api/iaRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promptParams),
            });

            return response;
        } catch (error) {
            console.error("Error en requestIa:", error);
        }
    };


    const Quantity = () => {
        const [selected, setSelected] = React.useState([]);
        const data = [
            { key: '1', value: '1' },
            { key: '2', value: '2' },
            { key: '3', value: '3' },
            { key: '4', value: '4' },
            { key: '5', value: '5' }
        ];
        const handleSelect = (val) => {
            setSelected(val);
            setQuantity(val);
            console.log(val);
        };
        return (
            <SelectList
                searchPlaceholder={"Cantidad de recomendaciones..."}
                defaultOption={{ key: '1', value: '1' }}
                setSelected={handleSelect}
                data={data}
                save="value"
                label="Quantity"
                boxStyles={{
                    width: 300,
                }}
            />
        );
    };

    const Categories = () => {
        const [selected, setSelected] = React.useState([]);
        const data = [
            { key: '1', value: 'Restauración' },
            { key: '2', value: 'Hoteles' },
            { key: '3', value: 'Prostibulos' }
        ];
        const handleSelect = (val) => {
            setSelected(val);
            setType(val);
            typeSelected ? setTypeSelected(false) : setTypeSelected(true);
        };

        return (
            <SelectList
                searchPlaceholder={"Buscar recomendaciones..."}
                placeholder="Tipo de Recomendacion"
                setSelected={handleSelect}
                data={data}
                save="value"
                label="Categories"
                boxStyles={{
                    width: 300,
                }}
            />
        );
    };

    const Presupuesto = memo(({ setBudget }) => {
        const [selected, setSelected] = React.useState([]);
        const data = [
            { key: '1', value: 'Básico (Bajo presupuesto)' },
            { key: '2', value: 'Normal (Presupuesto medio)' },
            { key: '3', value: 'De lujo (Alto presupuesto)' }
        ];
        const handleSelect = (val) => {
            setSelected(val);
            setBudget(val);
            console.log(val);
        };
        return (
            <SelectList
                searchPlaceholder={"Presupuesto..."}
                placeholder="Presupuesto"
                setSelected={handleSelect}
                data={data}
                save="value"
                label="Budget"
                boxStyles={{
                    width: 300,
                }}
            />
        );
    });

    return (
        <View style={{ paddingTop: Constants.statusBarHeight }} className="bg-[#DBF3EF] w-full min-h-full h-screen relative">
            <StatusBar style="auto" />
            <View className="flex w-full bg-[#297169]/30 backdrop-blur py-4 px-8">
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
                    {/* Mostrar mensajes si no hay error y no está cargando */}
                    {loading ? (
                        <Text>Cargando mensajes...</Text>
                    ) : error ? (
                        <Text>{error}</Text>
                    ) : (
                        messages.map((message, i) => (
                            <View
                                key={i}
                                className="pl-6 pr-2 mb-6 py-8 rounded-lg max-w-[70%] mt-4 bg-gray-700 self-start rounded-bl-none"
                            >
                                <Text className="text-yellow-300 self-start">Plannify IA</Text>
                                {renderNestedData(message)}
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>

            <View
                style={{ bottom: keyboardHeight }}
                className="absolute bg-white w-full flex gap-x-4 flex-row justify-center p-4"
            >
                <View className="flex flex-col gap-y-4 md:flex-row md:gap-x-4">
                    <View className="flex flex-col gap-x-4">
                        <Text className="text-lg text-center font-semibold">
                            Cantidad de Recomendaciones:
                        </Text>
                        {Quantity()}
                    </View>
                    <View className="flex flex-col gap-x-4">
                        <Text className="text-lg text-center font-semibold">
                            Tipo de Recomendaciones:
                        </Text>
                        {Categories()}
                    </View>
                    {selectedRestoration && (
                        <View className="flex flex-col gap-x-4">
                            <Text className="text-lg text-center font-semibold">
                                Presupuesto:
                            </Text>
                            <Presupuesto setBudget={setBudget} />
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={{
                        backgroundColor: typeSelected ? "#00ad3a" : "#aaaaaa",
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    disabled={!typeSelected}
                    onPress={() => {
                        requestIa().then(async result => {
                            loadMessages();
                            console.log(result);
                            counter.current = 5;
                        });
                    }}
                >
                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <Path fill="none" />
                        <Path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                        <Path d="M6.5 12h14.5" />
                    </Svg>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 5,
        width: "100%",
        height: 100,
    },
    inputField: {
        borderRadius: 12,
        height: 40,
        padding: 8,
        backgroundColor: "#eeeeee",
        width: "100%",
    },
    buttonStyle: {
        marginTop: 10,
        backgroundColor: "#D1E4E3",
        borderRadius: 12,
    },
});
