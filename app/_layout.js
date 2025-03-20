import {Slot, useSegments} from "expo-router";
import {View, StyleSheet, ScrollView, Platform} from "react-native";
import Constants from "expo-constants";
import BottomNavigation from "./components/BottomNavigation";
import BurgerMenu from "./components/BurgerMenu";

export default function Layout() {
    const segments = useSegments();

    const isAuthScreen = segments[0] === "chat" || segments[0] === "Login" || segments[0] === "Register" || segments[0] === "MenuNoLog";
    
    const contentStyle = Platform.OS === 'ios' || Platform.OS === 'android' 
        ? { ...styles.pag, paddingBottom: 70 }
        : styles.pag;

    if (isAuthScreen) {
        return <Slot />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#DBF3EF" }}>
            <ScrollView style={{ marginTop: Constants.statusBarHeight }}>
                <View style={contentStyle}>
                    <Slot />
                </View>
            </ScrollView>
            
            <BurgerMenu />
            
            {(Platform.OS === 'ios' || Platform.OS === 'android') && <BottomNavigation />}
        </View>
    );
}

const styles = StyleSheet.create({
    pag: {
        backgroundColor: "#FFFFFF",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
});