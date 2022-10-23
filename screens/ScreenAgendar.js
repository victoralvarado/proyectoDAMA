import React, { useState, useEffect } from "react";
import { Button, StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Text, Dimensions, Image, Pressable } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
export default function ScreenAgendar(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Agendar</Text>
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