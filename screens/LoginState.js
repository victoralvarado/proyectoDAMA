import React, { useState, useEffect } from "react";
import { Button, StyleSheet, SafeAreaView, ScrollView, StatusBar, Dimensions, Image, Pressable, Text, View } from "react-native";
import { ListItem } from "react-native-elements";

import storage from './Storage';
import {firebase} from "../database/firebase";
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import CryptoJS from "react-native-crypto-js";
import { NativeBaseProvider, HStack, Spinner,extendTheme, Icon, Center } from "native-base";
export default function LoginState(props) {
    const isFocused = useIsFocused();
 
    const [co, setCorreo] = useState("");
    const [cl, setClave] = useState("");
    const [login, setLogin] = useState([]);
    const theme = extendTheme({
        colors: {
            primary: {
                1: '#5D576B',
                2: '#9BC1BC',
                3: '#ED6A5A',
                4: '#E6EBE0',
                5: '#F4F1BB',
            },
        },
        config: {
            // Changing initialColorMode to 'dark'
            initialColorMode: 'light'
        }
    });
    useEffect(() => {
        storage
            .load({
                key: 'loginState',

                // autoSync (default: true) means if data is not found or has expired,
                // then invoke the corresponding sync method
                autoSync: true,

                // syncInBackground (default: true) means if data expired,
                // return the outdated data first while invoking the sync method.
                // If syncInBackground is set to false, and there is expired data,
                // it will wait for the new data and return only after the sync completed.
                // (This, of course, is slower)
                syncInBackground: true,

                // you can pass extra params to the sync method
                // see sync example below
                syncParams: {
                    extraFetchOptions: {
                        // blahblah
                    },
                    someFlag: true
                }
            })
            .then(ret => {
                // found data go to then()
                setCorreo(ret.correo);
                setClave(ret.clave);
                setLogin("");
                const login = [];
                firebase.firestore().collection("usuarios").where("correo", "==", ret.correo).onSnapshot((querySnapshot) => {

                    querySnapshot.docs.forEach((doc) => {
                        const { correo, clave, nivel, nombre, apellido, telefono } = doc.data();
                        let bytes = CryptoJS.AES.decrypt(clave, 'Clav3123!');
                        let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                        if (decryptedData == ret.clave) {
                            login.push({
                                id: doc.id,
                                correo,
                                decryptedData,
                                nivel,
                                telefono
                            });
                            storage.save({
                                key: 'loginState', // Note: Do not use underscore("_") in key!
                                data: {
                                    id: doc.id,
                                    correo: correo,
                                    clave: decryptedData,
                                    nivel: nivel,
                                    nombre: nombre,
                                    apellido: apellido,
                                    telefono: telefono
                                },

                                // if expires not specified, the defaultExpires will be applied instead.
                                // if set to null, then it will never expire.
                                expires: null,
                            });
                            setTimeout(
                                function () {
                                    props.navigation.navigate("ScreenHome")
                                }
                                , 1000);

                        }else{
                            console.log("Datos de sesion incorrectos");
                        }

                        //clave = CryptoJS.AES.decrypt(clave, 'Clav3123!').toString();

                    });
                    const dataLogin = new Set(login);
                    let result = [...dataLogin];
                    setLogin(result);

                });
            })
            .catch(err => {
                // any exception including data not found
                // goes to catch()
                //console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        props.navigation.navigate("ScreenInicio")
                        break;
                    case 'ExpiredError':
                        props.navigation.navigate("ScreenInicio")
                        break;
                }
            });

    }, [isFocused])
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                <NativeBaseProvider theme={theme}>
                    <Center flex={1} px="3">
                        <HStack space={8} justifyContent="center" alignItems="center">
                            <Spinner size="lg" color="primary.3" />
                        </HStack>
                    </Center>
                </NativeBaseProvider>
            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#FFF"
    },
    scrollView: {
        height: Dimensions.get('window').height,
        backgroundColor: '#FFF',
        marginHorizontal: 5,
    },
    text: {
        textAlign: 'center',
        fontFamily: "Poppins Bold",
        color: "#ED6A5A",
        fontSize: 30
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});