import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import addToCartService from "../services/addToCartService"

// Categories Data
const categories = [
    { id: '1', title: 'Fruits', icon: '🍏' },
    { id: '2', title: 'Vegetables', icon: '🥕' },
    { id: '3', title: 'Meat', icon: '🍗' },
    { id: '4', title: 'Dairy', icon: '🥛' },
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    

    const handleAddToCart = async (productId) => {
    const result = await addToCartService(productId, products, setCartItems);
    console.log('Cart items after add:', result.cartItems);
    console.log('Number of items in cart:', result.cartItemsCount);
  };
 

    // Render each product item
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Single Product', { product: item })}>
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardPrice}>From ₦{item.price}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Single Product', { product: item })}>
            <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    // Fetching products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://api.fooddeckpro.com.ng/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }

    // Render categories
    const renderCategory = ({ item }) => (
        <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={styles.categoryText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
                <Image source={require('../assets/hero.jpeg')} style={styles.heroImage} />
            </View>

            {/* Categories Section */}
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            />

            {/* Featured Section */}
            <Text style={styles.featuredTitle}>Featured Products</Text>

            {/* Products Section */}
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                scrollEnabled={false} // Prevent internal FlatList scrolling
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 20, // Adding marginTop to keep it away from the top
    },
    heroImage: {
        width: '100%',
        height: 130, // Reduced the height by 20px (was 150)
        borderRadius: 10,
    },
    categoriesContainer: {
        paddingVertical: 10,
        marginTop: 10, // Adding marginTop to keep the categories icons away from hero section
    },
    categoryButton: {
        backgroundColor: '#F0F0F0',
        borderRadius: 15,
        padding: 8,
        marginRight: 10,
        alignItems: 'center',
        width: 80,
    },
    categoryIcon: {
        fontSize: 20,
    },
    categoryText: {
        marginTop: 3,
        textAlign: 'center',
    },
    featuredTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D7B30',
        textAlign: 'center',
        marginVertical: 10,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        elevation: 3,
        width: '48%',
    },
    cardImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    cardTitle: {
        fontWeight: 'bold',
        marginVertical: 5,
    },
    cardPrice: {
        color: '#2D7B30',
    },
    addButton: {
        backgroundColor: '#2D7B30',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    row: {
        justifyContent: 'space-between',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
