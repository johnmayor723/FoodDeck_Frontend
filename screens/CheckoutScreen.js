import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";

const CheckoutScreen = () => {
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();

  const { totalAmount = 0, noCoupon = false } = route.params || {};

  useEffect(() => {
    const fetchData = async () => {
      console.log("Total amount:", totalAmount);
      setFinalAmount(totalAmount); // Default amount before applying discount
      const storedCart = await AsyncStorage.getItem("cart");
      if (storedCart) setCart(JSON.parse(storedCart));
    };
    fetchData();
  }, []);

  // Validate discount code
  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      Alert.alert("Error", "Please enter a coupon code.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://api.foodliie.com/api/agent/verify-couponCode",
        { couponCode: discountCode }
      );
      console.log("Api call response:",response.data);

      if (response.data.couponCode?.isValid) {
        await activateCoupon();
      } else {
        Alert.alert("Invalid Coupon", "The entered coupon code is not valid.");
      }
    } catch (error) {
      console.error(
        "Error validating coupon:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Error", "Failed to validate coupon.");
    } finally {
      setLoading(false);
    }
  };

  // Activate discount coupon
  const activateCoupon = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        Alert.alert("Error", "User not found.");
        return;
      }

      const user = JSON.parse(userData);
      const userId = user._id || user.id;

      axios.post("http://api.foodliie.com/api/auth/activate-coupon", {
    userId,
    couponCode: discountCode,
})
.then((response) => {
    console.log("response is:", response.data);
})
.catch((error) => {
    console.error("Error activating coupon:", error);
});

      // Apply 20% discount
      const discount = totalAmount * 0.2;
      const discountedTotal = totalAmount - discount;

      setFinalAmount(discountedTotal);
      setDiscountApplied(true);

      Alert.alert("Success", `Coupon activated! Discounted amount: ₦${discountedTotal.toFixed(2)}`);
    } catch (error) {
      console.error(
        "Error activating coupon:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Error", "Failed to activate coupon.");
    }
  };

  // Proceed to final payment
  const proceedToFinalPayment = () => {
    navigation.navigate("FinalCheckout", {
      totalAmount: finalAmount,
      discountApplied,
    });
  };

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
          placeholder="Mobile"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
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
          keyboardType="email-address"
          style={styles.input}
        />

        {/* Display discount info if applied */}
        {discountApplied && (
          <Text style={styles.discountInfo}>
            Discount Applied! New Total: ₦{finalAmount.toFixed(2)}
          </Text>
        )}

        {/* Show discount input only if noCoupon is true & no discount has been applied */}
        {noCoupon && !discountApplied && (
          <View style={styles.discountContainer}>
            <TextInput
              placeholder="Activate Coupon"
              value={discountCode}
              onChangeText={setDiscountCode}
              style={styles.input}
            />
            <Button title="Apply Coupon" onPress={validateDiscountCode} />
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#FE9801" />
        ) : (
          <Button
            title="Proceed to Payment"
            onPress={proceedToFinalPayment}
            color="#2D7B30"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    backgroundColor: "#FE9801",
    padding: 15,
    alignItems: "center",
  },
  topBarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  discountContainer: {
    marginBottom: 15,
  },
  discountInfo: {
    backgroundColor: "#DFF6DD",
    color: "#2D7B30",
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default CheckoutScreen;
