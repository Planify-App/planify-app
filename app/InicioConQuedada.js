import React from 'react';
import {View, Text, StyleSheet, Button, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from "@react-navigation/native";

export default function InicioConQuedada(){

    const navigation = useNavigation();
    const quedadas = [
        { id: 1, nombre: 'Quedada 1', descripcion: 'Descripcion de la quedada 1 dsjiadhsadasdsauihdashdashjfgsdgfdsgfdhjsfgsdgfdjhsfgdhfj iudshjfgdshjfds fiufdhfdjsfbhjdskfhdskfhdskjfhdskjfhdskjf', fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' }), tiempoRestante: '2h', imagen: null, invitacionQuedada: "FWTDAGHS" },
        { id: 2, nombre: 'Quedada 2', descripcion: 'Descripcion de la quedada 2', fecha: '17/2/2025', tiempoRestante: '2h', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCgLKOFbr0B71QYXSkJ7YEmD-eVxOh9wohMQ&s', invitacionQuedada: "FWTDAGHS" },
        { id: 3, nombre: 'Quedada 3', descripcion: 'Descripcion de la quedada 3', fecha: '17/2/2025', tiempoRestante: '2h', imagen: null, invitacionQuedada: "FWTDAGHS" },
    ];

    function cortarFrase(frase) {
        if (frase.length > 100) {
            return frase.substring(0, 30) + '...';
        }
        return frase;
    }
    return (
        <View className="flex lg:justify-center items-center min-h-screen">
            <View className="flex gap-y-4 mb-6">
                <TouchableOpacity className="bg-[#2C7067] border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                >
                    <Text className="text-white font-semibold">
                        Crear Quedada
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#2C7067] border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                >
                    <Text className="text-white font-semibold">
                        Unirse a Quedada
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="max-w-fit">
                {quedadas.map((quedada) => (
                    <TouchableOpacity
                        className="lg:hover:scale-[1.01] transition-transform"
                        onPress={() => navigation.navigate(quedada.invitacionQuedada)}
                    >
                        <View key={quedada.id} className="mb-6">
                            {quedada.imagen ? (
                                <View className="border-2 border-black/40 rounded-lg">
                                    <View>
                                        <Image
                                            source={{ uri: quedada.imagen }}
                                            className="min-w-72 w-full h-32 rounded-t-lg"
                                        />
                                    </View>
                                    <View className="flex justify-between flex-row gap-x-6 px-2 py-4">
                                        <View className="max-w-56">
                                            <Text className="font-semibold">{quedada.nombre}</Text>
                                            <Text className="text-sm text-balance text-black/60">{cortarFrase(quedada.descripcion)}</Text>
                                        </View>
                                        <View>
                                            <Text>{quedada.fecha}</Text>
                                            <Text>{quedada.tiempoRestante}</Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View className="border-2 border-black/40 rounded-lg px-2 py-4">
                                    <View className="flex justify-between flex-row gap-x-6">
                                        <View className="max-w-56">
                                            <Text className="font-semibold">{quedada.nombre}</Text>
                                            <Text className="text-sm text-balance text-black/60">{cortarFrase(quedada.descripcion)}</Text>
                                        </View>
                                        <View>
                                            <Text>{quedada.fecha}</Text>
                                            <Text>{quedada.tiempoRestante}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        color: 'black',
    },
    input: {
        height: 40,
        width: 200,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 20,
        marginBottom: 20,
    },
    quedadaContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
    },
    boxInfo: {
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imagen: {
        width: "auto",
        height: 100,
    },
});