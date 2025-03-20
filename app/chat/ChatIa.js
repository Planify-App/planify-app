import {
    Alert,
    Animated,
    Button,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Logo from "../Logo";
import React, {memo, useEffect, useRef, useState} from "react";
import Constants from "expo-constants";
import Svg, {Path} from "react-native-svg";
import {StatusBar} from "expo-status-bar";
import * as Location from 'expo-location';
import {MultipleSelectList, SelectList} from "react-native-dropdown-select-list";


export default function ChatIa() {
    const scrollViewRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [textInputHeight, setTextInputHeight] = useState(85);
    const [text, setText] = useState("");
    const [buttonVisible, setButtonVisible] = useState(false);
    const [inputWidth, setInputWidth] = useState("100%");
    const fadeAnim = useState(new Animated.Value(0))[0];
    const [typeSelected, setTypeSelected] = useState(false);
    const [quantity, setQuantity] = useState('1');
    const [type, setType] = useState(null)
    const [budget, setBudget] = useState(null)
    const [coords, setCoords] = useState(null)
    const [selectedRestoration, setSelectedRestoration] = useState(false)

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
            setSelectedRestoration(true)
        } else {
            setSelectedRestoration(false)
        }
    }, [type]);

    const handleLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        setTextInputHeight(height + 55);
    };
    const Categories = () => {

        const [selected, setSelected] = React.useState([]);

        const data = [
            {key:'1', value:'Restauración'},
            {key:'2', value:'Hoteles'},
            {key:'3', value:'Prostibulos'}
        ]
        const handleSelect = (val) => {
            setSelected(val);
            setType(val)
            typeSelected ? setTypeSelected(false) : setTypeSelected(true);
        }

        return(
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
        )

    };


    const loadMessages = async () => {
        const mensajes = await fetch(`http://192.168.17.198:3080/api/getAiMessages/XrpqKteN4yvCAjinw4s1`)
        const mensajesArray = [];
        Array.from(mensajes.docs).forEach(doc => {
            mensajesArray.push(doc.data());
        });
        console.log(mensajesArray);
        return mensajesArray
            .map((_, i) => (
                <View
                    key={i}
                    className={`pl-6 pr-2 pt-3 pb-1 rounded-lg max-w-[70%] mt-4 bg-gray-700 self-start rounded-bl-none`}
                >
                    <Text
                        className={`text-yellow-300 self-start`}>
                        Nombre Usuario
                    </Text>
                    <Text className="text-white pr-4"></Text>
                    <Text className="text-sm text-white opacity-60 self-end leading-1 pl-32">12:30</Text>
                </View>
            ))
    }


    const requestIa = async () => {
        getLocation().then(async coords => {
            await setCoords(coords.latitude + ", " + coords.longitude);
        })
        if (coords) {
            const promptParams = {
                coords: coords,
                cantidad: quantity,
                busqueda_de: type,
                tipoRestauracion: budget,
                id: "XrpqKteN4yvCAjinw4s1"
            }
            console.log(promptParams)
            return await fetch(`http://localhost:3080/api/iaRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promptParams),
            })
        }
    }

    const Quantity = () => {

        const [selected, setSelected] = React.useState([]);
        const data = [
            {key:'1', value:'1'},
            {key:'2', value:'2'},
            {key:'3', value:'3'},
            {key:'4', value:'4'},
            {key:'5', value:'5'}
        ]
        const handleSelect = (val) => {
            setSelected(val);
            setQuantity(val);
            console.log(val);
        }
        return(
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
        )
    }
    const Presupuesto = memo(({ setType, setTypeSelected }) => {

        const [selected, setSelected] = React.useState([]);
        const data = [
            {key:'1', value:'Básico (Bajo presupuesto)'},
            {key:'2', value:'Normal (Presupuesto medio)'},
            {key:'3', value:'De lujo (Alto presupuesto)'}
        ]
        const handleSelect = (val) => {
            setSelected(val);
            setBudget(val);
            console.log(val);
        }
        return(
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
        )
    });

    return (
        <View style={{paddingTop: Constants.statusBarHeight}} className="bg-[#DBF3EF] w-full min-h-full h-screen relative">
            <StatusBar style="auto" />
            <View
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
                    {console.log(loadMessages())}
                </ScrollView>
            </View>

            <View
                style={{bottom: keyboardHeight}}
                className="absolute bg-white w-full flex gap-x-4 flex-row justify-center p-4"
            >

                <View className="flex flex-col gap-y-4 md:flex-row md:gap-x-4">
                    <View className="flex flex-col gap-x-4">
                        <Text className="text-lg text-center font-semibold">Cantidad de Recomendaciones: </Text>
                        {Quantity()}
                    </View>
                    <View className="flex flex-col gap-x-4">
                        <Text className="text-lg text-center font-semibold">Tipo de Recomendaciones: </Text>
                        {Categories()}
                    </View>
                    { selectedRestoration  && (
                        <View className="flex flex-col gap-x-4">
                            <Text className="text-lg text-center font-semibold">Presupuesto: </Text>
                            <Presupuesto setBudget={setBudget} />
                        </View>)
                    }
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
                            console.log(await result)
                        })
                    }}

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
                            onPress={() => {
                                setText("");
                            }}
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
                                <Path fill="none"/>
                                <Path
                                    d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z"/>
                                <Path d="M6.5 12h14.5"/>
                            </Svg>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}
