import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import "./global.css"
import {SafeAreaProvider} from "react-native-safe-area-context";
import Constants from "expo-constants";

export default function App() {

    return (
        <SafeAreaProvider>
            <View  style={styles.login}>
                <StatusBar style="light" />
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    login: {
        backgroundColor: "#DBF3EF" ,
        paddingTop: Constants.statusBarHeight,
        paddingBottom: Constants.statusBarHeight,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
});

