import {Slot} from "expo-router";
import {View, StyleSheet} from "react-native";
import Constants from "expo-constants";

export default function Layout() {
    return (
        <View style={styles.pag}>
            <Slot />
        </View>
    );
}

const styles = StyleSheet.create({
    pag: {
        backgroundColor: "#FFFFFF",
        paddingVertical: Constants.statusBarHeight,

        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
});