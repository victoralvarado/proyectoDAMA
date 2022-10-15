import React, { useState, useEffect } from "react";
import { Button, StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Dimensions, Image, Pressable, Text } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { Input, Stack, Center, NativeBaseProvider, FormControl, extendTheme, HStack, Link } from "native-base";

export default function ScreenInicio(props) {
    function press() {
        console.log("inicio");
    }
    const theme = extendTheme({
        colors: {
            // Add new color
            primary: {
                1: '#5D576B',
                2: '#9BC1BC',
                3: '#ED6A5A',
                3: '#E6EBE0',
                3: '#F4F1BB',
            },
            // Redefining only one shade, rest of the color will remain same.
            amber: {
                400: '#d97706'
            }
        },
        config: {
            // Changing initialColorMode to 'dark'
            initialColorMode: 'light'
        }
    });
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                <NativeBaseProvider theme={theme}>
                    <Center flex={1} px="3">
                        <View>
                            <Text style={styles.text}>Iniciar Sesión</Text>
                        </View>
                        <View style={{ marginTop: 14 }}>
                            <Text style={{ fontFamily: "Poppins Medium", fontSize: 16, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                                Bienvenido de Regreso, inicia Sesión para continuar
                            </Text>
                        </View>
                        <FormControl w="100%" maxW="400px" mx="auto" style={{ marginTop: 44 }}>
                            <FormControl.Label _text={{
                                fontSize: 15,
                                fontWeight: "500",
                                fontFamily: "Poppins Medium",
                                color: "primary.1"
                            }} >Correo</FormControl.Label>
                            <Input _focus={{
                                backgroundColor: "primary.2",
                                color: "primary.1"
                            }} size="2xl" variant="outline" placeholder="Correo" />
                        </FormControl>
                        <FormControl w="100%" maxW="400px" mx="auto" style={{ marginTop: 10 }}>
                            <FormControl.Label _text={{
                                fontSize: 15,
                                fontFamily: "Poppins Medium",
                                color: "primary.1"
                            }} >Clave</FormControl.Label>
                            <Input _focus={{
                                backgroundColor: "primary.2",
                                color: "primary.1"
                            }} size="2xl" variant="outline" placeholder="Clave" />
                        </FormControl>
                        <View style={{ marginTop: 50, alignItems: "center" }}>
                            <Pressable style={({ pressed }) => [
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
                            ]} onPress={press}>
                                <Text style={{ fontFamily: "Poppins SemiBold", fontSize: 16, color: "#5D576B" }}>Iniciar Sesión</Text>
                            </Pressable>
                        </View>
                        <HStack mt="6" style={{ marginTop: 14 }} justifyContent="center">
                            <Text style={{ fontFamily: "Poppins Regular", fontSize: 14, color: "#5D576B" }}>
                                ¿No tienes una cuenta?{" "}
                            </Text>
                            <Link _text={{
                                color: "primary.3",
                                fontFamily: "Poppins Regular",
                                fontSize: 14
                            }} href="#">
                                Crear cuenta
                            </Link>
                        </HStack>
                    </Center>
                </NativeBaseProvider>
            </ScrollView>
        </SafeAreaView>
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