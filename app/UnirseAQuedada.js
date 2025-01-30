import React from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';

export default function UnirseAQuedada({ navigation }){
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Codigo de acceso</Text>
            <TextInput style={styles.input}  />
            <Button title={"Entrar"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        color: 'black',
    },
    input: {
        height: 40,
        width: 200,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 20,
        marginBottom: 20,
    },
});