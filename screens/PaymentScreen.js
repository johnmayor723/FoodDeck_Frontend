import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Log route parameters for debugging
  console.log('Route Params:', route.params);

  // Extracting cart items count and total amount from route params
  const { cartItemCount = 0, totalAmount = 0 } = route.params || {};
  
  // Convert totalAmount to Naira format
  const formattedTotalAmount = `₦${totalAmount.toFixed(2)}`;
  
  

  const handleCheckout = async () => {
  try {
    // Fetch user from AsyncStorage
    const userData = await AsyncStorage.getItem("user");
    if (!userData) {
      console.log("No user data found.");
      navigation.navigate("Checkout", { totalAmount, noCoupon: true });
      return;
    }

    const user = JSON.parse(userData);
    console.log("User:", user);

    // Ensure correct user ID format
    const userId = user._id || user.id;
    if (!userId) {
      console.log("User ID not found.");
      navigation.navigate("Checkout", { totalAmount, noCoupon: true });
      return;
    }

    // Validate coupon
    const response = await axios.post("https://api.foodliie.com/api/auth/validate-coupon", { userId });

    // Log full API response
    console.log("API Response:", response.data);

    let finalAmount = totalAmount;
    let noCoupon = true;

    // Explicitly check if coupon is null or missing
    if (!response.data.coupon) {
      console.log("No valid coupon found.");
      navigation.navigate("Checkout", { totalAmount, noCoupon: true });
      return;
    }

    // Apply discount if coupon exists
    const couponValue = response.data.coupon.value;
    const discount = Math.min(totalAmount * 0.2, couponValue);
    finalAmount -= discount;
    noCoupon = false;

    // Navigate to checkout with final amount
    navigation.navigate("Checkout", { totalAmount: finalAmount, noCoupon });

  } catch (error) {
    console.error("Error handling checkout:", error);
    if (error.response) {
      console.log("Error Response Data:", error.response.data);
    }
    // Fallback to normal checkout in case of any error
    navigation.navigate("Checkout", { totalAmount, noCoupon: true });
  }
};


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* First Section: Search Form */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search product"
          />
        </View>

        {/* Second Section: Delivery Options */}
        <Text style={styles.deliveryHeader}>How would you like your order delivered?</Text>

        {/* Delivery Option Boxes */}
        <View style={styles.deliveryOptionsContainer}>
          {/* Home Delivery Box */}
          <View style={styles.deliveryBox}>
            <Ionicons name="home-outline" size={24} color="black" />
            <Text style={styles.boxTitle}>Home Delivery</Text>
            <Text style={styles.boxText}>Pay now and have your order delivered at home.</Text>
          </View>

          {/* Store Pickup Box */}
          <View style={styles.deliveryBox}>
            <Ionicons name="storefront-outline" size={24} color="black" />
            <Text style={styles.boxTitle}>Store Pickup</Text>
            <Text style={styles.boxText}>Pay now and pick up your item at our store.</Text>
          </View>

          {/* Payment on Delivery Box */}
          <View style={styles.deliveryBox}>
            <Ionicons name="cash-outline" size={24} color="black" />
            <Text style={styles.boxTitle}>Payment on Delivery</Text>
            <Text style={styles.boxText}>Pay for your order upon delivery.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Third Section: Bottom Tab */}
      <View style={styles.bottomTab}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartText}>Your cart has {cartItemCount} items</Text>
          <Text style={styles.totalAmount}>{formattedTotalAmount}</Text>
        </View>
        <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Check Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    paddingBottom: 80, // Ensure space for the bottom tab
  },
  searchContainer: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 25,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 10,
  },
  deliveryHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF7E00', // Amber orange for header text
  },
  deliveryOptionsContainer: {
    marginHorizontal: 16,
  },
  deliveryBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  boxTitle: {
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#4CAF50', // Green color for titles
  },
  boxText: {
    color: '#555',
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  cartInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cartText: {
    color: 'black',
  },
  totalAmount: {
    color: 'black',
  },
  checkoutButton: {
    backgroundColor: '#FF7E00', // Amber orange for checkout button
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
