import {Button, ScrollView, StyleSheet, Text, View} from "react-native";

export default function PremiumExpl() {
    return(
        <View>
                <Text style={styles.tittle}>Premium</Text>
            <View style={ styles.container_text}>
                <Text style={styles.promo}>Obtén la versión premium y disfruta de todas las características de Planify</Text>
                <ScrollView style={styles.container_text}>
                <Text style={styles.text_premium}>
                    Explicación que marcos va a hacer porque no está haciendo nada
                </Text>
                </ScrollView>
                <Button style={styles.boton_comprar} title={"Comprar"}></Button>

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    tittle: {
        fontSize: 75,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        color: 'rgba(0,21,255,0.56)',
        fontFamily: 'Pacifico',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 4,
    },
    promo: {
        fontSize: 18,
        textAlign: "center",
    },
    container_text: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    text_premium: {
        fontSize: 18,
        textAlign: "justify",
        marginVertical: 10,
    },
    boton_comprar: {

    },

});