import {Slot} from "expo-router";
import {View, StyleSheet, ScrollView} from "react-native";
import Constants from "expo-constants";

export default function Layout() {
    return (
        <View className="w-full">
            <Slot />
        </View>
    );
}