import {Button, Text, TextInput, View} from "react-native";
import Logo from "./Logo";
import * as React from "react";


export default function Chat() {
    return (
        <View className="bg-[#DBF3EF] w-full min-h-full h-screen relative">
            <View className="flex w-full bg-blue-500 py-4 px-8">
                <View className="flex flex-row items-center gap-x-5">
                    <Logo size="w-12 h-12 p-2 bg-white rounded-full md:w-24 md:h-24" color="#297169" />
                    <Text className="text-3xl font-semibold">Chat</Text>
                </View>
            </View>
            <View className="absolute bg-white bottom-0 w-full flex flex-row justify-center p-4">
                <TextInput placeholder="Test" className="w-full p-2 border border-gray-300 rounded-2xl" />
            </View>
        </View>

    );
}
