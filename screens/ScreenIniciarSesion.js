import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Pressable, Text } from "react-native";
import { Input, Center, NativeBaseProvider, FormControl, extendTheme, HStack, Link, Icon, Slide, CheckIcon, Box, WarningTwoIcon } from "native-base";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from './Storage';
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from 'formik';
import * as yup from 'yup'
import {firebase} from "../database/firebase";

import CryptoJS from "react-native-crypto-js";
import { log } from "react-native-reanimated";
export default function ScreenInicio(props) {
    const ref = firebase.firestore().collection("usuarios");
    const [login, setLogin] = useState([]);
    const [show, setShow] = React.useState(false);
    const [existe, setExiste] = React.useState(false);
    const [isOpenTop, setIsOpenTop] = React.useState(false);
    const SignupSchema = yup.object().shape({
        correo: yup
            .string()
            .email('Ingrese un correo valido')
            .required('El correo es requerido'),
        clave: yup
            .string()
            .required('La clave es requerida'),
    });
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
    return (
        <Formik
            initialValues={{
                correo: '',
                clave: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={values => {
                setLogin("");
                const login = [];

                firebase.firestore().collection("usuarios").where("correo", "==", values.correo).get()
                    .then((querySnapshot) => {
                        if (querySnapshot.empty) {
                            let timeout;
                            setIsOpenTop(true)
                            timeout = setTimeout(alertFunc, 2500);
                            function alertFunc() {
                                setIsOpenTop(false)
                            }
                        }
                        querySnapshot.docs.forEach((doc) => {

                            const { correo, clave, nivel, nombre, apellido, telefono } = doc.data();
                            let bytes = CryptoJS.AES.decrypt(clave, 'Clav3123!');
                            let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                            if (decryptedData == values.clave) {
                                login.push({
                                    id: doc.id,
                                    correo,
                                    decryptedData,
                                    nivel,
                                    nombre,
                                    apellido,
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
                                        props.navigation.navigate("ScreenHome", { 'paramPropKey': 'paramPropValue' })
                                    }
                                    , 1000);

                            } else {
                                let timeout;
                                setIsOpenTop(true)
                                timeout = setTimeout(alertFunc, 2500);
                                function alertFunc() {
                                    setIsOpenTop(false)
                                }
                            }

                            //clave = CryptoJS.AES.decrypt(clave, 'Clav3123!').toString();

                        });
                        const dataLogin = new Set(login);
                        let result = [...dataLogin];
                        setLogin(result);

                    }
                    );


            }}
        >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                        <NativeBaseProvider theme={theme}>
                            <Center flex={1}>
                                <Slide in={isOpenTop} placement="top" style={{ marginTop: "20%", alignItems: "center" }}>
                                    <Box w="70%" position="absolute" p="2" borderRadius="2xl" bg="primary.3" alignItems="center" justifyContent="center" _dark={{
                                        bg: "primary.2"
                                    }} safeArea>
                                        <HStack space={2}>
                                            <WarningTwoIcon size="4" color="primary.5" mt="1" _dark={{
                                                color: "primary.5"
                                            }} />
                                            <Text style={{ color: "#E6EBE0" }} textAlign="center" fontWeight="medium">
                                                Correo y/o clave incorrectos
                                            </Text>
                                        </HStack>
                                    </Box>
                                </Slide>
                                <View>
                                    <Text style={styles.text}>Iniciar Sesión</Text>
                                </View>
                                <View style={{ marginTop: 14 }}>
                                    <Text style={{ fontFamily: "Poppins Medium", fontSize: 16, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                                        Bienvenido de Regreso, inicia Sesión para continuar
                                    </Text>
                                </View>

                                {/* Inicio Control Correo */}
                                <FormControl w="100%" maxW="390px" style={{ marginTop: 44 }}>

                                    {/* Inicio Label Correo */}
                                    <FormControl.Label _text={{ fontSize: 15, fontWeight: "500", fontFamily: "Poppins Medium", color: "primary.1" }} >
                                        Correo
                                    </FormControl.Label>
                                    {/* Fin Label Correo */}

                                    {/* Inicio Input Correo */}
                                    <View
                                        style={{
                                            borderColor: "#5D576B",
                                            borderWidth: 1,
                                            borderRadius: 4,
                                        }}>
                                        <Input
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            returnKeyType={'next'}
                                            value={values.correo}
                                            onChangeText={handleChange('correo')}
                                            onBlur={() => setFieldTouched('correo')}
                                            _focus={{
                                                backgroundColor: "primary.2",
                                            }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Correo"
                                        />
                                    </View>
                                    {/* Fin Input Correo */}

                                    {/* Inicio Advertencias de validacion */}
                                    {
                                        touched.correo && errors.correo &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.correo}</Text>
                                    }
                                    {/* Fin Advertencias de validacion */}

                                </FormControl>
                                {/* Fin Control Correo */}

                                {/* Inicio Control Clave */}
                                <FormControl w="100%" maxW="390px" style={{ marginTop: 10 }}>

                                    {/* Inicio Label Clave */}
                                    <FormControl.Label _text={{ fontSize: 15, fontFamily: "Poppins Medium", color: "primary.1" }} >
                                        Clave
                                    </FormControl.Label>
                                    {/* Fin Label Clave */}

                                    {/* Inicio Input Clave */}
                                    <View
                                        style={{
                                            borderColor: "#5D576B",
                                            borderWidth: 1,
                                            borderRadius: 4,
                                        }}>
                                        <Input
                                            style={{
                                                color: "#5D576B",
                                                fontFamily: "Poppins Regular"
                                            }}
                                            value={values.clave}
                                            onChangeText={handleChange('clave')}
                                            onBlur={() => setFieldTouched('clave')}
                                            _focus={{
                                                backgroundColor: "primary.2",
                                            }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Clave"
                                            type={show ? "text" : "password"}
                                            InputRightElement={
                                                <Pressable onPress={() => setShow(!show)} >
                                                    <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="primary.1" />
                                                </Pressable>
                                            }
                                        />
                                    </View>
                                    {/* Fin Input Clave */}

                                    {/* Inicio Advertencias de validacion */}
                                    {
                                        touched.clave && errors.clave &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.clave}</Text>
                                    }
                                    {/* Fin Advertencias de validacion */}

                                </FormControl>
                                {/* Fin Control Clave */}

                                {/* Inicio Boton Iniciar Sesión */}
                                <View style={{ marginTop: 50, alignItems: "center" }}>
                                    <Pressable
                                        style={({ pressed }) => [
                                            {
                                                backgroundColor: pressed
                                                    ? 'rgb(210, 230, 255)'
                                                    : '#9BC1BC',
                                                fontFamily: "",
                                                width: 265,
                                                height: 64,
                                                borderRadius: 15,
                                                alignItems: "center",
                                                justifyContent: 'center'
                                            },
                                            styles.wrapperCustom
                                        ]}
                                        onPress={handleSubmit} disabled={!isValid}>
                                        <Text style={{ fontFamily: "Poppins SemiBold", fontSize: 16, color: "#5D576B" }}>Iniciar Sesión</Text>
                                    </Pressable>
                                </View>
                                {/* Fin Boton Iniciar Sesión */}

                                {/* Texto y Link para ir a crear una cuanta*/}
                                <HStack mt="6" style={{ marginTop: 14 }} justifyContent="center">
                                    <Text style={{ fontFamily: "Poppins Regular", fontSize: 14, color: "#5D576B" }}>
                                        ¿No tienes una cuenta?{" "}
                                    </Text>
                                    <Link
                                        _text={{
                                            color: "primary.3",
                                            fontFamily: "Poppins Regular",
                                            fontSize: 14
                                        }}
                                        onPress={() => props.navigation.navigate("ScreenCrearCuenta")}>
                                        Crear cuenta
                                    </Link>
                                </HStack>
                                {/* Fin Texto y Link para ir a crear una cuanta*/}

                            </Center>
                        </NativeBaseProvider>
                    </ScrollView>
                </SafeAreaView>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#FFF",
        paddingTop: 0,
    },
    scrollView: {
        backgroundColor: '#FFF',
        marginHorizontal: 5,
    },
    text: {
        textAlign: 'center',
        fontFamily: "Poppins Bold",
        color: "#ED6A5A",
        fontSize: 32
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});