import React, { useState, useEffect } from "react";
import { Button, StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Dimensions, Image, Pressable, Text } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { Input, Stack, Center, NativeBaseProvider, FormControl, extendTheme, HStack, Link, Icon, } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup'
export default function ScreenInicio(props) {

    const [show, setShow] = React.useState(false);
    const SignupSchema = yup.object().shape({
        correo: yup
            .string()
            .email('Ingrese un correo valido')
            .required('El correo es requerido'),
        clave: yup
            .string()
            .required('La clave es requerida')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                "Debe contener 8 caracteres, uno en mayúscula, uno en minúscula, un número y un carácter especial"
            ),
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
                console.log(values);
            }}
        >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                        <NativeBaseProvider theme={theme}>
                            <Center flex={1}>

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
                                    <Input
                                        style={{ color: "#5D576B" }}
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
                                    <Input
                                        style={{
                                            color: "#5D576B"
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
                                            <Pressable onPress={() => setShow(!show)}>
                                                <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="primary.1" />
                                            </Pressable>
                                        }
                                    />
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
        backgroundColor: "#E6EBE0"
    },
    scrollView: {
        backgroundColor: '#E6EBE0',
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