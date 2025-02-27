import {Slot, useSegments} from "expo-router";
import {View, StyleSheet, ScrollView} from "react-native";
import Constants from "expo-constants";

export default function Layout() {
    const segments = useSegments();

    if (segments[0] === "chat") {
        return <Slot />;
    }
    return (
        <ScrollView className="bg-[#DBF3EF]">
            <View style={styles.pag}>
                <Slot />
            </View>
        </ScrollView>
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