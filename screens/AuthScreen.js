import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only needed for signup
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  
  const handleLogin = async () => {
      const endpoint = 'https://pantry-hub-server.onrender.com/api/auth/login'
      const payload = {name, email, password}

         // Make the API request using axios
      const response = await axios.post(endpoint, payload);

      const { token, user } = response.data;

      // If response is successful, store the token and user in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert(isLogin ? 'Login successful!' : 'Signup successful!', `Welcome ${user.name}`);
      navigation.navigate('Home'); // Navigate to Home or another screen after auth

    } catch (error) {
      console.error(error);
      Alert.alert(isLogin ? 'Login failed' : 'Signup failed', error.response?.data?.message || 'Something went wrong');
    }
  
    navigation.navigate('Main'); // Navigate to Home on login
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/Logo1.png')} style={styles.logo} />

      {/* Welcome text */}
      <Text style={styles.welcomeText}>Welcome to FoodDeck</Text>

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

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Navigate to Signup */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupText}>Don't have an account? Sign up here</Text>
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
    fontSize: 24,
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

export default AuthScreen;
