import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const recommendedProducts = [
    { id: '1', title: 'Carrots', price: '200', image: require('../assets/a3.jpeg') },
    { id: '2', title: 'Cabbage', price: '300', image: require('../assets/a4.jpeg') },
    { id: '3', title: 'Onions', price: '100', image: require('../assets/a6.jpeg') },
];

const ItemScreen = ({ route, navigation}) => {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1); // Manage quantity

    const handleAddToCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem('cart');
            const cartArray = storedCart ? JSON.parse(storedCart) : []; // Load existing cart or create new
            const productId = product.id;

            // Add product ID to cart array if not already present
            if (!cartArray.includes(productId)) {
                cartArray.push(productId);
                await AsyncStorage.setItem('cart', JSON.stringify(cartArray));
            }

            navigation.navigate("Cart");
            Alert.alert("Success", "Product added to cart!");
            
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to add product to cart");
        }
    };

    return (
        <View style={styles.container}>
            {/* Fixed Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.topBarText}>{product.title}</Text>
            </View>

            {/* Product Image with Add to Wishlist button */}
            <View style={styles.imageSection}>
                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                <TouchableOpacity style={styles.wishlistButton}>
                    <Text style={styles.wishlistText}>Add to Wishlist</Text>
                </TouchableOpacity>
            </View>

            {/* Product Details */}
            <View style={styles.detailsSection}>
                <Text style={styles.price}>â‚¦{product.price}</Text>
                <Text style={styles.description}>
                    This is the detailed description of the product {product.title}. You can later replace this with dynamic content from your backend.
                </Text>
                <Text style={styles.rating}>â­â­â­â­â­ (5.0)</Text>
            </View>

            {/* Products You May Like */}
            <View style={styles.recommendedSection}>
                <Text style={styles.recommendedTitle}>Products You May Like</Text>
                {/* Suggested products would be displayed here */}
            </View>

            {/* Fixed Bottom Bar */}
            <View style={styles.bottomBar}>
                {/* Quantity Management and Add to Cart Button */}
                <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
                    <Text style={styles.cartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles remain the same
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topBar: {
        height: 40,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageSection: {
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: 250,
        resizeMode: 'cover', // Ensures the image covers the area properly
    },
    wishlistButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF7E00',
        padding: 8,
        borderRadius: 5,
    },
    wishlistText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    detailsSection: {
        padding: 20,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    rating: {
        fontSize: 16,
        color: '#FFD700',
    },
    recommendedSection: {
        paddingHorizontal: 20,
        paddingBottom: 120, // Extra space to accommodate the fixed bottom bar
    },
    recommendedTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'green',
    },
    recommendedCard: {
        marginRight: 10,
        width: 120,
        alignItems: 'center',
    },
    recommendedImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    recommendedPrice: {
        marginTop: 5,
        color: 'green',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
    },
    quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#FF7E00',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    quantityText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    quantityValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cartButton: {
        backgroundColor: '#2D7B30',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    cartButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ItemScreen;
