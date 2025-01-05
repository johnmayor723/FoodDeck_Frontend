import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const CheckoutScreen = () => {
    //const [totalAmount, setTotalAmount] = useState();
    const [cart, setCart] = useState([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [authUrl, setAuthUrl] = useState('');
    const [loading, setLoading] = useState(false);
    
    const route = useRoute();
    const navigation = useNavigation();
    console.log('Route Params:', route.params);
    const { totalAmount = 0 } = route.params || {};

    useEffect(() => {
        const fetchData = async () => {
            //setTotalAmount(route.params.totalAmount);
            console.log("total amount:", totalAmount)
            const storedCart = await AsyncStorage.getItem('cart');
            if (storedCart) setCart(JSON.parse(storedCart));
        };
        fetchData();
    }, []);
    
const initializePayment = async () => {
    setLoading(true);
    try {
        const response = await axios.post(
            'http://api.fooddeckpro.com.ng/api/orders/initialize',
            { amount:totalAmount*100, email }
        );
        console.log("API call response:", response);
        setAuthUrl(response.data.authUrl);
    } catch (error) {
        console.error("Error initializing payment:", error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to initialize payment');
    } finally {
        setLoading(false);
    }
};
    

const handleOrderCreation = async () => {
        try {
            await axios.post('http://api.fooddeckpro.com.ng/api/orders', {
                name,
                email,
                address,
                cart,
                amount: totalAmount
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to create order');
        }
    };

const handlePaymentCompletion = () => {
        handleOrderCreation();
    console.log("Transaction successfully processed ");
        navigation.replace('SuccessScreen');
    };

if (authUrl) {
        return (
            <WebView
                source={{ uri: authUrl }}
                onNavigationStateChange={(state) => {
                    if (state.url.includes('success')) handlePaymentCompletion();
                }}
            />
        );
 }

return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.topBarText}>Checkout</Text>
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#FE9801" />
                ) : (
                    <Button title="Pay Now" onPress={initializePayment} color="#2D7B30" />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topBar: {
        backgroundColor: '#FE9801',
        padding: 15,
        alignItems: 'center',
    },
    topBarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    formContainer: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default CheckoutScreen;
