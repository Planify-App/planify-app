import {Slot} from "expo-router";
import {View, StyleSheet, ScrollView} from "react-native";
import Constants from "expo-constants";

export default function Layout() {
    return (
        <ScrollView>
            <View style={styles.pag}>
                <Slot />
            </View>
        </ScrollView>
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