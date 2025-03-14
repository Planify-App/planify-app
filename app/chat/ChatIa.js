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
import React, { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import Svg, {Path} from "react-native-svg";
import {StatusBar} from "expo-status-bar";
import * as Location from 'expo-location';
import {MultipleSelectList, SelectList} from "react-native-dropdown-select-list";


export default function Chat() {
    const ip = "192.168.1.111" +
        ""
    const scrollViewRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [textInputHeight, setTextInputHeight] = useState(85);
    const [text, setText] = useState("");
    const [buttonVisible, setButtonVisible] = useState(false);
    const [inputWidth, setInputWidth] = useState("100%");
    const fadeAnim = useState(new Animated.Value(0))[0];
    const checkSelected = [false, false];

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
    const Categories = () => {

        const [selected, setSelected] = React.useState([]);

        const data = [
            {key:'1', value:'Restauracion'},
            {key:'2', value:'Hoteles'},
            {key:'3', value:'Prostibulos'}
        ]
        const handleSelect = (val) => {
            setSelected(val);
            checkSelected[0] = true;
            checkSelected[1] = true;
        }

        return(
            <SelectList
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
                    {Array(70)
                        .fill(0)
                        .map((_, i) => (
                            <View
                                key={i}
                                className={`pl-6 pr-2 pt-3 pb-1 rounded-lg max-w-[70%] mt-4 ${
                                    i % 2 === 0 ? "bg-gray-700 self-start rounded-bl-none" : "bg-blue-500 self-end rounded-br-none"
                                }`}
                            >
                                <Text
                                    className={`text-yellow-300 self-start ${
                                        i % 2 === 0 ? "" : "hidden"}`}>
                                    Nombre Usuario
                                </Text>
                                <Text className="text-white pr-4">Marcos Escoria, Basura, Mierda, Porquería {i + 1}</Text>
                                <Text className="text-sm text-white opacity-60 self-end leading-1 pl-32">12:30</Text>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>

            <View
                style={{bottom: keyboardHeight}}
                className="absolute bg-white w-full flex gap-x-4 flex-row justify-center p-4"
            >

                {Categories()}

                <TouchableOpacity
                    style={{
                        backgroundColor: "#00ad3a",
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        disabled: !checkSelected[0] || !checkSelected[1]
                    }}
                    onPress={() => {
                        getLocation().then(async coords => {
                            const promptParams = {
                                coords: coords.latitude + ", " + coords.longitude,
                                cantidad: 5,
                                busquedaDe: Categories().selected.map(item => item.value).join(", "),
                            }
                            const result = await fetch(`http://${ip}:3080/api/iaRequest`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(userData),
                            })
                        });
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
