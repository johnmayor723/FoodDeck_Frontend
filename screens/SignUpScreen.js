import React, { useState, useContext} from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext'; // Import the AuthContext


const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for loader
  const { login } = useContext(AuthContext); // Access the login function from the AuthContext

  const handleSignup = async () => {
    setIsLoading(true); // Show loader

    try {
      const endpoint = 'http://api.fooddeckpro.com.ng/api/auth/register';
      const payload = { name, email, password };

      // Make the API request using axios
      const response = await axios.post(endpoint, payload);

      const { token, user } = response.data;

      // Store the token and user in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert('Signup successful!', `Welcome ${user.name}`);
      setIsLoading(false); // Hide loader
      login();
      //navigation.replace('Main'); // Navigate to Home or another screen after auth
    } catch (error) {
      setIsLoading(false); // Hide loader
      console.error(error);
      Alert.alert('Signup failed', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/mainlogo.png')} style={styles.logo} />

      {/* Welcome text */}
      <Text style={styles.welcomeText}>Join FoodDeck</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Signup Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
        <Text style={styles.signupText}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2D7B30',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#2D7B30',
    borderRadius: 25, // Rounded corners
    marginBottom: 20,
    color: '#2D7B30',
  },
  button: {
    backgroundColor: '#FF7E00',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
    color: '#2D7B30',
    fontSize: 16,
  },
});

export default SignupScreen;
