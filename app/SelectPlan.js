import {Text, TouchableOpacity, View} from "react-native";
import React from "react";

export default function SelectPlan() {
    return (
        <View className="w-full h-screen flex flex-row gap-x-6 items-center justify-center">
            <View className="border-2 border-[#2C7067] py-4 px-6 justify-center w-1/4 rounded-lg">
                <Text className="text-center text-xl font-extrabold uppercase pb-2 border-b-[.1rem] border-black/20">
                    Gratuito
                </Text>
                <View className="w-[70%] mx-auto flex flex-row items-center justify-center pb-2 border-b-[.1rem] border-black/20">
                    <Text className="text-center text-[#2C7067] font-bold text-6xl">0€</Text>
                    <Text className="text-center text-black/60 text-xl font-extrabold uppercase">/mes</Text>
                </View>
                <View className="mt-4 px-2">
                    <Text className="text-sm">• Acceso básico a funciones esenciales.</Text>
                    <Text className="text-sm">• Limitado en plantillas y personalización.</Text>
                    <Text className="text-sm">• Ideal para probar la aplicación.</Text>
                </View>
                <TouchableOpacity className="mt-10 bg-[#2C7067] border-[#2C7067] disabled:bg-gray-400 disabled:border-gray-400 border-2 py-4 lg:py-2 px-8 lg:px-4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all">
                    <Text className="text-white font-semibold">
                        Adquirir Plan
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="border-4 border-[#2C7067] py-4 px-6 justify-center w-1/4 rounded-lg scale-125 bg-white z-10">
                <Text className="text-center text-xl font-extrabold uppercase pb-2 border-b-[.1rem] border-black/20">
                    Básico
                </Text>
                <View className="w-[70%] mx-auto flex flex-row items-center justify-center pb-2 border-b-[.1rem] border-black/20">
                    <Text className="text-center text-[#2C7067] font-bold text-6xl">4,99€</Text>
                    <Text className="text-center text-black/60 text-xl font-extrabold uppercase">/mes</Text>
                </View>
                <View className="mt-4 px-2">
                    <Text className="text-sm">
                        • Mayor capacidad de creación y personalización.
                    </Text>
                    <Text className="text-sm">
                        • Integración con calendarios y opciones intermedias.
                    </Text>
                    <Text className="text-sm">
                        • Soporte prioritario para usuarios en crecimiento.
                    </Text>
                </View>
                <TouchableOpacity className="mt-10 bg-[#2C7067] border-[#2C7067] disabled:bg-gray-400 disabled:border-gray-400 border-2 py-4 lg:py-2 px-8 lg:px-4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all">
                    <Text className="text-white font-semibold">
                        Adquirir Plan
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="border-2 border-[#2C7067] py-4 px-6 justify-center w-1/4 rounded-lg">
                <Text className="text-center text-xl font-extrabold uppercase pb-2 border-b-[.1rem] border-black/20">
                    Premium
                </Text>
                <View className="w-[70%] mx-auto flex flex-row items-center justify-center pb-2 border-b-[.1rem] border-black/20">
                    <Text className="text-center text-[#2C7067] font-bold text-6xl">9,99€</Text>
                    <Text className="text-center text-black/60 text-xl font-extrabold uppercase">/mes</Text>
                </View>
                <View className="mt-4 px-2">
                    <Text className="text-sm">
                        • Acceso completo a todas las funciones avanzadas.
                    </Text>
                    <Text className="text-sm">
                        • Creación ilimitada de planes y personalización total.
                    </Text>
                    <Text className="text-sm">
                        • Soporte premium y actualizaciones exclusivas.
                    </Text>
                </View>
                <TouchableOpacity className="mt-10 bg-[#2C7067] border-[#2C7067] disabled:bg-gray-400 disabled:border-gray-400 border-2 py-4 lg:py-2 px-8 lg:px-4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all">
                    <Text className="text-white font-semibold">
                        Adquirir Plan
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
