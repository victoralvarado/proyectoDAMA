import React, { useState, useEffect } from "react";
import { Button, StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Text, Dimensions, Image, Pressable } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
export default function ScreenInicio(props) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                <View>
                    <Text style={styles.text}>nombreapp</Text>
                </View>
                <View style={{ marginTop: 50 }}>
                    <Image
                        style={styles.img}
                        source={
                            require('../assets/image/motor-del-coche.png')
                        }
                    />
                </View>
                <View style={{ marginTop: 30 }}>
                    <Text style={{ fontFamily: "Poppins Bold", fontSize: 20, textAlign: 'center', color: "#5D576B" }}>
                        ¡Bienvenido!
                    </Text>
                </View>
                <View style={{ marginTop: 3 }}>
                    <Text style={{ fontFamily: "Poppins Regular", fontSize: 14, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                        No busque más! Tenemos la solución para su vehículo
                    </Text>
                </View>
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
                    ]} onPress={() => props.navigation.navigate("ScreenIniciarSesion")}>
                        <Text style={{ fontFamily: "Poppins SemiBold", fontSize: 16, color: "#5D576B" }}>Iniciar Sesión</Text>
                    </Pressable>
                </View>
                <View style={{ marginTop: 44, alignItems: "center", marginBottom:10 }}>
                    <Pressable style={({ pressed }) => [
                        {
                            backgroundColor: pressed
                                ? 'rgb(210, 230, 255)'
                                : '#F4F1BB',
                            fontFamily: "",
                            width: 265,
                            height: 64,
                            borderRadius: 15,
                            alignItems: "center",
                            justifyContent: 'center'
                        },
                        styles.wrapperCustom
                    ]} onPress={() => props.navigation.navigate("ScreenCrearCuenta")}>
                        <Text style={{ fontFamily: "Poppins SemiBold", fontSize: 16, color: "#5D576B" }}>Crear Cuenta</Text>
                    </Pressable>
                </View>
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
        fontSize: 40
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});