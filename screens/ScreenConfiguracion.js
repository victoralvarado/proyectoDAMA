import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Pressable, Text } from "react-native";
import { Input, Center, NativeBaseProvider, FormControl, extendTheme, HStack, Link, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from 'formik';
import * as yup from 'yup'
export default function ScreenConfiguracion(props) {
    const [show, setShow] = React.useState(false);
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
                console.log(values);
            }}
        >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                        <NativeBaseProvider theme={theme}>
                            <Center flex={1}>
                                <View>
                                    <Text style={styles.text}>Configuración</Text>
                                </View>
                                <View style={{ marginTop: 14 }}>
                                    <Text style={{ fontFamily: "Poppins Medium", fontSize: 16, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                                        Gestion de productos y horarios
                                    </Text>
                                </View>
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
                                        onPress={() => props.navigation.navigate("ScreenProductos")} disabled={!isValid}>
                                        <Text style={{ fontFamily: "Poppins SemiBold", fontSize: 16, color: "#5D576B" }}>Productos</Text>
                                    </Pressable>
                                </View>
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
                                        onPress={() => props.navigation.navigate("ScreenHorarios")} disabled={!isValid}>
                                        <Text style={{ fontFamily: "Poppins SemiBold", fontSize: 16, color: "#5D576B" }}>Horarios</Text>
                                    </Pressable>
                                </View>

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