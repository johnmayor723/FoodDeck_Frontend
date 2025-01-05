import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const images = {
  a1: require('../assets/a1.jpeg'),
  a2: require('../assets/a2.jpeg'),
  a3: require('../assets/a3.jpeg'),
  a4: require('../assets/a4.jpeg'),
  a5: require('../assets/a5.jpeg'),
  a6: require('../assets/a6.jpeg'),
  a7: require('../assets/a7.jpeg'),
  a8: require('../assets/a8.jpg'),
  a9: require('../assets/a9.jpg'),
  a10: require('../assets/a10.jpg'),
};

const CartScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const [suggestedProducts] = useState([
    { id: 3, name: 'Oranges', price: 3.99, image: images.a3 },
    { id: 4, name: 'Grapes', price: 4.99, image: images.a4 },
    { id: 5, name: 'Mangoes', price: 5.99, image: images.a5 },
    { id: 6, name: 'Pineapples', price: 3.49, image: images.a6 },
    { id: 7, name: 'Strawberries', price: 4.99, image: images.a7 },
    { id: 8, name: 'Blueberries', price: 6.99, image: images.a8 },
    { id: 9, name: 'Watermelons', price: 7.99, image: images.a9 },
    { id: 10, name: 'Peaches', price: 5.49, image: images.a10 },
  ]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://api.fooddeckpro.com.ng/api/products');
      setProducts(response.data);
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  const getCartItems = async () => {
    try {
      const cart = await AsyncStorage.getItem('cartItem');
      if (cart) {
        const cartIds = JSON.parse(cart);
        const filteredCartItems = [];
        for (const cartId of cartIds) {
          for (const product of products) {
            const matchingMeasurement = product.measurements.find(measurement => measurement._id === cartId);
            if (matchingMeasurement) {
              filteredCartItems.push({
                ...product,
                measurement: matchingMeasurement,
                quantity: 1,
              });
            }
          }
        }
        setCartItems(filteredCartItems);
      }
    } catch (error) {
      console.log('Error retrieving cart:', error);
    }
  };

  const calculateCartItemCount = () => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(count);
  };

  useEffect(() => {
    calculateCartItemCount();
  }, [cartItems]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      getCartItems();
    }
  }, [products]);

  const handleQuantityChange = (id, newQuantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.measurement._id === id) {
        return { ...item, quantity: Number(newQuantity) };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const handleDeleteItem = (id) => {
    const updatedCartItems = cartItems.filter(item => item.measurement._id !== id);
    setCartItems(updatedCartItems);
    AsyncStorage.setItem('cartItem', JSON.stringify(updatedCartItems.map(item => item.measurement._id)));
  };

  const clearCart = async () => {
    setCartItems([]);
    await AsyncStorage.removeItem('cartItem');
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.measurement.price * item.quantity), 0);

  const handleCheckout = () => {
    navigation.navigate('Payment', { totalAmount, cartItemCount });
  };

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.heroText}>Your Cart</Text>
        <TouchableOpacity onPress={clearCart} style={styles.clearCartButton}>
          <Text style={styles.clearCartText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cartItemsSection}>
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <View key={item.measurement._id} style={styles.cartItem}>
                <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemPrice}>₦{item.measurement.price.toFixed(2)}</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={item.quantity.toString()}
                  keyboardType="numeric"
                  onChangeText={(value) => handleQuantityChange(item.measurement._id, value)}
                />
                <TouchableOpacity onPress={() => handleDeleteItem(item.measurement._id)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>No items in your cart.</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomTab}>
        <Text style={styles.totalText}>Total: ₦{totalAmount.toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroSection: {
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  heroText: {
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold',
  },
  clearCartButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  clearCartText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  cartItemsSection: {
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemText: { flex: 1, fontSize: 16 },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  quantityInput: {
    width: 40,
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    marginRight: 10,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteText: { color: 'white', fontWeight: 'bold' },
  bottomTab: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  checkoutButton: {
    backgroundColor: '#FF7E00',
    borderRadius: 5,
    padding: 10,
    width: '50%',
    alignItems: 'center',
  },
  checkoutText: { color: 'white', fontWeight: 'bold' },
});

export default CartScreen;
