import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const recommendedProducts = [
    { id: '1', title: 'Carrots', price: '200', image: require('../assets/a3.jpeg') },
    { id: '2', title: 'Cabbage', price: '300', image: require('../assets/a4.jpeg') },
    { id: '3', title: 'Onions', price: '100', image: require('../assets/a6.jpeg') },
];

const ItemScreen = ({ route }) => {
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
    // Your existing styles...
});

export default ItemScreen;
