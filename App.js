import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import "./global.css"
import {SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import Constants from "expo-constants";

export default function App() {
    const insets = useSafeAreaInsets();

    return (
        <View style={{paddingTop: insets.top, paddingBottom: insets.bottom}}>
            <SafeAreaProvider>
                <View>
                    <StatusBar style="light" />
                </View>
            </SafeAreaProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    login: {
        backgroundColor: "#DBF3EF" ,
        paddingTop: Constants.statusBarHeight,
        minHeight: "100vh",
    },
});
