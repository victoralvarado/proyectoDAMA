import React, { useState, useEffect } from "react";
import { Button, StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Text,Input, Dimensions, Image, Pressable } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

export default function ScreenCrearCuenta(props) {
    function press() {
        console.log("crear");
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                <View>
                    <Text style={styles.text}>Crear Cuenta</Text>
                </View>
                <View style={{ marginTop: 14 }}>
                    <Text style={{ fontFamily: "Poppins Medium", fontSize: 16, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                    Ingresa tus datos para crear una cuenta
                    </Text>
                </View>
                <View style={{ alignItems: 'center', marginTop: 44 }}>
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