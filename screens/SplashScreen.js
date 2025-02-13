// screens/SplashScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Auth'); // Replace 'Auth' with your initial screen
        }, 2000); // 2 seconds

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/foodlogo.png')} // Make sure you have a logo in the assets folder
                style={styles.logo}
            />
            <Text style={styles.title}>Welcome to FoodDeck-pro</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Customize the background color
    },
    logo: {
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FF7E00', // Customize the text color
    },
});

export default SplashScreen;
