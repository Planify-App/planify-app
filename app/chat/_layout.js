import {Slot} from "expo-router";
import {View, StyleSheet, TouchableOpacity, Platform} from "react-native";
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

export default function Layout() {
    const navigation = useNavigation();
    
    const goBack = () => {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            router.push('/InicioQuedadas');
        } else {
            router.back();
        }
    };

    return (
        <View className="w-full h-full">
            {(Platform.OS === 'ios' || Platform.OS === 'android') && (
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={goBack}
                >
                    <Ionicons name="arrow-back" size={24} color="#297169" />
                </TouchableOpacity>
            )}
            <Slot />
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: Constants.statusBarHeight + 10,
        left: 10,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 20,
        padding: 8,
    }
});
