import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
//import { addToCart} from '../services/cartService';

const recommendedProducts = [
    { id: '1', title: 'Carrots', price: '200', image: require('../assets/a3.jpeg') },
    { id: '2', title: 'Cabbage', price: '300', image: require('../assets/a4.jpeg') },
    { id: '3', title: 'Onions', price: '100', image: require('../assets/a6.jpeg') },
];
const addToCart = async id => {
   /*let itemArray = await AsyncStorage.getItem('cartItem');
    itemArray = JSON.parse(itemArray);
    if (itemArray) {
      let array = itemArray;
      array.push(id);
      console.log(array)

      try {
        await AsyncStorage.setItem('cartItem', JSON.stringify(array));
       /* ToastAndroid.show(
          'Item Added Successfully to cart',
          ToastAndroid.SHORT,
        );
        Alert.alert("Item Added To Cart", JSON.stringify(array, null, 2))
          console.log( array )
       // navigation.navigate('Cart');
      } catch (error) {
        return error;
      }*/
        let itemArray = await AsyncStorage.getItem('cartItem');
itemArray = JSON.parse(itemArray) || []; // Initialize as an empty array if null

console.log('Initial cart items:', itemArray); // Log the current items in the cart

if (itemArray) {
  let array = itemArray;
  
  // Add the new id to the array
  array.push(id);
  
  console.log('Updated cart items:', array); // Log the updated array
  
  try {
    // Save the updated array back to AsyncStorage
    await AsyncStorage.setItem('cartItem', JSON.stringify(array));
    
    // Use alert or toast to notify the user
    Alert.alert('Item Added To Cart', JSON.stringify(array, null, 2));
    
    console.log('Final cart items:', array); // Log the final array after storing
    
    // Optionally navigate to the Cart screen
    // navigation.navigate('Cart');
  } catch (error) {
    console.error('Error saving cart items:', error); // Log any error
    return error;
  }
    } else {
      let array = [];
      array.push(id);
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(array));
        /*ToastAndroid.show(
          'Item Added Successfully to cart',
          ToastAndroid.SHORT,
        );*/
        Alert.alert("Item Added To Cart", JSON.stringify(array, null, 2))
          console.log(array)
       // navigation.navigate('Cart');
        //navigation.navigate('Cart');
      } catch (error) {
        return error;
      }
    }
  };
const ItemScreen = ({ route }) => {
    const navigation = useNavigation();
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1); // Manage quantity
    
  /*  const handleAddToCart = async () => {
        try {
            const cartItems = await AsyncStorage.getItem('cart');
            const cart = cartItems ? JSON.parse(cartItems) : [];
            
            // Check if the product is already in the cart
            const existingProduct = cart.find(item => item.id === product.id);
            
            if (existingProduct) {
                // Update the quantity of the existing product
                existingProduct.quantity += quantity;
            } else {
                // Add new product to the cart
                const newProduct = {
                    ...product,
                    quantity,
                    total: product.price * quantity, // calculate total price
                };
                cart.push(newProduct);
            }

            await AsyncStorage.setItem('cart', JSON.stringify(cart));
            Alert.alert('Success', 'Product added to cart!');
            navigation.navigate("Cart", { product });
        } catch (error) {
            console.error('Error adding product to cart:', error);
            Alert.alert('Error', 'Could not add product to cart');
        }
    };
    const handleAddToCart = async () => {
    try {
        const cartItems = await AsyncStorage.getItem('cart');
        const cart = cartItems ? JSON.parse(cartItems) : [];

        // Ensure product price is a number
        const productPrice = Number(product.price);

        // Check if the product is already in the cart
        const existingProduct = cart.find(item => item.id === product.id);
        
        if (existingProduct) {
            // Update the quantity of the existing product
            existingProduct.quantity += quantity;
            existingProduct.total = existingProduct.quantity * productPrice;
        } else {
            // Add new product to the cart
            const newProduct = {
                ...product,
                quantity,
                price: productPrice, // Ensure price is a number
                total: productPrice * quantity, // Calculate total price
            };
            cart.push(newProduct); // Add new product
        }

        await AsyncStorage.setItem('cart', JSON.stringify(cart));
        Alert.alert('Success', 'Product added to cart!');
        navigation.navigate("Cart", { product });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        Alert.alert('Error', 'Could not add product to cart');
    }
        */
  const handleAddToCart = () => {
    
   product.quantity = quantity;
   //console.log(product.id)
   //Alert.alert(product.id)
    addToCart(product._id);
    //console.log(cart)
    navigation.navigate("Cart")
  };

    const renderRecommendedItem = ({ item }) => (
        <View style={styles.recommendedCard}>
            <Image source={item.image} style={styles.recommendedImage} />
            <Text style={styles.recommendedTitle}>{item.title}</Text>
            <Text style={styles.recommendedPrice}>₦{item.price}</Text>
        </View>
    );

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
                <Text style={styles.price}>₦{product.price}</Text>
                <Text style={styles.description}>
                    This is the detailed description of the product {product.title}. You can later replace this with dynamic content from your backend.
                </Text>
                <Text style={styles.rating}>⭐⭐⭐⭐⭐ (5.0)</Text>
            </View>

            {/* Products You May Like */}
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

            {/* Fixed Bottom Bar */}
            <View style={styles.bottomBar}>
                <Text style={styles.totalPrice}>Total: ₦{product.price * quantity}</Text>

                {/* Quantity Management */}
                <View style={styles.quantitySection}>
                    <TouchableOpacity onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} style={styles.quantityButton}>
                        <Text style={styles.quantityText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{quantity}</Text>
                    <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.quantityButton}>
                        <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Add to Cart Button */}
                <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
                    <Text style={styles.cartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
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
