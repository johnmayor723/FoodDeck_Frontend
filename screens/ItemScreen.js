import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cart constructor function
function Cart(initItems) {
    this.items = initItems || {}; // Initialize items to an empty object if not provided
    this.totalQty = 0;
    this.totalPrice = 0;

    if (this.items) {
        for (var key in this.items) {
            this.totalQty += this.items[key].qty;
            this.totalPrice += this.items[key].qty * this.items[key].item.price;
        }
    }

    // Add function to add items to the cart
    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { qty: 0, item: item, price: 0, imagePath: "" };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        storedItem.imagePath = storedItem.item.imagePath;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    // Generate array of items in the cart
    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
}

const ItemScreen = ({ route }) => {
    const { product } = route.params;
    const [cart, setCart] = useState(null); // State to hold cart

    useEffect(() => {
        loadCart();
    }, []);

    // Load cart from AsyncStorage or create a new one
    const loadCart = async () => {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            setCart(new Cart(parsedCart.items));
        } else {
            const newCart = new Cart();
            setCart(newCart);
        }
    };

    // Save the cart to AsyncStorage
    const saveCart = async (cart) => {
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
    };

    // Handle adding product to the cart
    const handleAddToCart = async () => {
        if (cart) {
            cart.add(product, product.id);
            setCart(cart);
            await saveCart(cart);
            Alert.alert('Success', `${product.title} has been added to the cart!`);
        }
    };

    // Function to render recommended items
    const renderRecommendedItem = ({ item }) => (
        <View style={styles.recommendedCard}>
            <Image source={item.image} style={styles.recommendedImage} />
            <Text style={styles.recommendedTitle}>{item.title}</Text>
            <Text style={styles.recommendedPrice}>₦{item.price}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.topBarText}>{product.title}</Text>
            </View>

            {/* Product Image and Wishlist */}
            <View style={styles.imageSection}>
                <Image source={product.image} style={styles.productImage} />
                <TouchableOpacity style={styles.wishlistButton}>
                    <Text style={styles.wishlistText}>Add to Wishlist</Text>
                </TouchableOpacity>
            </View>

            {/* Product Details */}
            <View style={styles.detailsSection}>
                <Text style={styles.price}>₦{product.price}</Text>
                <Text style={styles.description}>
                    This is the detailed description of the product {product.title}. Replace this with dynamic content.
                </Text>
                <Text style={styles.rating}>⭐⭐⭐⭐⭐ (5.0)</Text>
            </View>

            {/* Recommended Products */}
            <View style={styles.recommendedSection}>
                <Text style={styles.recommendedTitle}>Products You May Like</Text>
                <FlatList
                    data={recommendedProducts}
                    renderItem={renderRecommendedItem}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <Text style={styles.totalPrice}>Total: ₦{product.price}</Text>
                <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
                    <Text style={styles.cartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    topBar: { height: 40, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' },
    topBarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    imageSection: { position: 'relative' },
    productImage: { width: '100%', height: 250 },
    wishlistButton: { position: 'absolute', top: 10, right: 10, backgroundColor: '#FF7E00', padding: 8, borderRadius: 5 },
    wishlistText: { color: '#fff', fontWeight: 'bold' },
    detailsSection: { padding: 20 },
    price: { fontSize: 24, fontWeight: 'bold', color: 'green', marginBottom: 10 },
    description: { fontSize: 16, color: '#666', marginBottom: 10 },
    rating: { fontSize: 16, color: '#FFD700' },
    recommendedSection: { paddingHorizontal: 20, paddingBottom: 120 },
    recommendedTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'green' },
    recommendedCard: { marginRight: 10, width: 120, alignItems: 'center' },
    recommendedImage: { width: 100, height: 100, borderRadius: 5 },
    recommendedPrice: { fontSize: 16, fontWeight: 'bold', color: '#666' },
    bottomBar: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ccc' },
    totalPrice: { fontSize: 18, fontWeight: 'bold', flex: 1, color: 'green' },
    cartButton: { backgroundColor: '#FF7E00', padding: 10, borderRadius: 5, marginRight: 10 },
    cartButtonText: { color: '#fff', fontWeight: 'bold' },
    buyButton: { backgroundColor: 'green', padding: 10, borderRadius: 5 },
    buyButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ItemScreen;
