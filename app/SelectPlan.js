import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import Globals from './globals';
import { useRouter } from 'expo-router';


export default function SelectPlan() {
    const [loading, setLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState(null);
    const [userId, setUserId] = useState(null);
    const router = useRouter();


    useEffect(() => {
        const getSession = async () => {
            try {
                let session;
                if (Platform.OS === 'web') {
                    session = localStorage.getItem('userSession');
                } else {
                    session = await AsyncStorage.getItem('userSession');
                }
                if (session) {
                    const { userId } = JSON.parse(session);
                    setUserId(userId);
                } else {
                    router.replace('/MenuNoLog');
                }
            } catch (err) {
                console.error('Error leyendo sesión:', err);
            }
        };
        getSession();
    }, []);


    const plans = { free: 0, basic: 4.99, premium: 9.99 };


    const handlePurchase = async planKey => {
        if(!userId) return;
        setLoading(true);
        try {
            const res = await fetch(`http://${Globals.ip}:3080/api/create-payment`,{
                method:'POST',headers:{'Content-Type':'application/json'},
                body:JSON.stringify({ userId, plan: planKey })
            });
            const { actionUrl, Ds_SignatureVersion, Ds_MerchantParameters, Ds_Signature } = await res.json();

            const formHtml = `
        <!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body onload="document.forms[0].submit()">
          <form action="${actionUrl}" method="POST">
            <input type="hidden" name="Ds_SignatureVersion" value="${Ds_SignatureVersion}" />
            <input type="hidden" name="Ds_MerchantParameters" value="${Ds_MerchantParameters}" />
            <input type="hidden" name="Ds_Signature" value="${Ds_Signature}" />
          </form>
        </body></html>`;

            if (Platform.OS==='web') {
                // Inyecta y envía
                const form = document.createElement('form');
                form.method='POST'; form.action=actionUrl; form.style.display='none';
                [['Ds_SignatureVersion',Ds_SignatureVersion],['Ds_MerchantParameters',Ds_MerchantParameters],['Ds_Signature',Ds_Signature]]
                    .forEach(([n,v])=>{const i=document.createElement('input');i.name=n;i.type='hidden';i.value=v;form.appendChild(i);});
                document.body.appendChild(form); form.submit();
            } else {
                setHtml(formHtml);
            }
        } catch(e){console.error(e);} finally {setLoading(false);}
    };



    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    }


    if (htmlContent) {
        console.log("Renderizando WebView con htmlContent");
        return (
            <WebView
                originWhitelist={["*"]}
                source={{ html: htmlContent }}
                style={{ flex: 1 }}
            />
        );
    }


    return (
        <View className="bg-[#DBF3EF] w-full h-screen">
            <Text className="text-center mt-4 text-3xl font-bold">Selecciona tu plan</Text>
            <View className="w-full flex flex-row gap-x-6 items-center justify-center">


                {/* Gratuito */}
                <View className="border-2 border-[#2C7067] py-4 px-6 justify-center w-1/4 rounded-lg">
                    <Text className="text-center text-xl font-extrabold uppercase pb-2 border-b-[.1rem] border-black/20">Gratuito</Text>
                    <View className="w-[70%] mx-auto flex flex-row items-center justify-center pb-2 border-b-[.1rem] border-black/20">
                        <Text className="text-center text-[#2C7067] font-bold text-6xl">0€</Text>
                        <Text className="text-center text-black/60 text-xl font-extrabold uppercase">/mes</Text>
                    </View>
                    <View className="mt-4 px-2">
                        <Text className="text-sm">• Acceso básico a funciones esenciales.</Text>
                        <Text className="text-sm">• Limitado en plantillas y personalización.</Text>
                        <Text className="text-sm">• Ideal para probar la aplicación.</Text>
                    </View>
                </View>


                {/* Básico */}
                <View className="border-4 border-[#2C7067] py-4 px-6 justify-center w-1/4 rounded-lg scale-125 bg-white z-10">
                    <Text className="text-center text-xl font-extrabold uppercase pb-2 border-b-[.1rem] border-black/20">Básico</Text>
                    <View className="w-[70%] mx-auto flex flex-row items-center justify-center pb-2 border-b-[.1rem] border-black/20">
                        <Text className="text-center text-[#2C7067] font-bold text-6xl">4,99€</Text>
                        <Text className="text-center text-black/60 text-xl font-extrabold uppercase">/mes</Text>
                    </View>
                    <View className="mt-4 px-2">
                        <Text className="text-sm">• Mayor capacidad de creación y personalización.</Text>
                        <Text className="text-sm">• Integración con calendarios y opciones intermedias.</Text>
                        <Text className="text-sm">• Soporte prioritario para usuarios en crecimiento.</Text>
                    </View>
                    <TouchableOpacity onPress={() => handlePurchase('basic')} className="mt-10 bg-[#2C7067] border-[#2C7067] border-2 py-4 px-8 rounded-lg">
                        <Text className="text-white font-semibold text-center">Adquirir Plan</Text>
                    </TouchableOpacity>
                </View>


                {/* Premium */}
                <View className="border-2 border-[#2C7067] py-4 px-6 justify-center w-1/4 rounded-lg">
                    <Text className="text-center text-xl font-extrabold uppercase pb-2 border-b-[.1rem] border-black/20">Premium</Text>
                    <View className="w-[70%] mx-auto flex flex-row items-center justify-center pb-2 border-b-[.1rem] border-black/20">
                        <Text className="text-center text-[#2C7067] font-bold text-6xl">9,99€</Text>
                        <Text className="text-center text-black/60 text-xl font-extrabold uppercase">/mes</Text>
                    </View>
                    <View className="mt-4 px-2">
                        <Text className="text-sm\">• Acceso completo a todas las funciones avanzadas.</Text>
                        <Text className="text-sm\">• Creación ilimitada de planes y personalización total.</Text>
                        <Text className="text-sm\">• Soporte premium y actualizaciones exclusivas.</Text>
                    </View>
                    <TouchableOpacity onPress={() => handlePurchase('premium')} className="mt-10 bg-[#2C7067] border-[#2C7067] border-2 py-4 px-8 rounded-lg">
                        <Text className="text-white font-semibold text-center">Adquirir Plan</Text>
                    </TouchableOpacity>
                </View>


            </View>
        </View>
    );
}