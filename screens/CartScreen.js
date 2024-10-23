import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CartScreen = () => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all products from the API
                const response = await axios.get('https://pantry-hub-server.onrender.com/api/products');
                const products = response.data; // Assume this returns an array of products

                // Get cart product IDs from AsyncStorage
                const storedCart = await AsyncStorage.getItem('cart');
                const cartArray = storedCart ? JSON.parse(storedCart) : [];

                // Filter products to create the cart based on stored product IDs
                const cartItems = products.filter(product => cartArray.includes(product.id));
                setCart(cartItems);

                // Calculate total price
                const total = cartItems.reduce((acc, item) => acc + (parseInt(item.price) * item.quantity || 1), 0);
                setTotalPrice(total);
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Failed to fetch products");
            }
        };

        fetchProducts();
    }, []);

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Text style={styles.cartItemTitle}>{item.title}</Text>
            <Text style={styles.cartItemPrice}>â‚¦{item.price}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Cart</Text>
            <FlatList
                data={cart}
                renderItem={renderCartItem}
                keyExtractor={item => item.id}
            />
            <Text style={styles.totalPrice}>Total: â‚¦{totalPrice}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'green',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cartItemTitle: {
        fontSize: 18,
    },
    cartItemPrice: {
        fontSize: 18,
        color: 'green',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'right',
    },
});

export default CartScreen;
