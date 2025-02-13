import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext, AuthProvider } from './contexts/AuthContext';

// Import Screens
import AboutScreen from "./screens/AboutScreen.js";
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import CartScreen from './screens/CartScreen';
import ContactScreen from './screens/ContactScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import HelpScreen from './screens/HelpScreen';
import TrackingScreen from './screens/TrackingScreen';
import ItemScreen from './screens/ItemScreen.js';
import CategoriesScreen from './screens/CategoriesScreen.js';
import FruitsScreen from './screens/FruitsScreen.js';
import VegetablesScreen from './screens/VegetablesScreen.js';
import DairyScreen from './screens/DairyScreen.js';
import MeatScreen from './screens/MeatScreen.js';
import OilProductsScreen from './screens/OilProductsScreen.js';
import SnacksScreen from './screens/SnacksScreen.js';
import LogoutScreen from './screens/LogoutScreen'; // New logout screen
import CheckoutScreen from "./screens/CheckoutScreen";
import SuccessScreen from "./screens/SuccessScreen.js";
import FinalCheckoutScreen from "./screens/FinalCheckoutScreen.js";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator Component
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'TabHome') {
            iconName = 'home';
          } else if (route.name === 'TabCategories') {
            iconName = 'grid-outline';
          } else if (route.name === 'TabProfile') {
            iconName = 'person';
          } else if (route.name === 'TabCart') {
            iconName = 'cart';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF7E00',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#fff' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="TabHome" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="TabCategories" component={CategoriesScreen} options={{ title: "Categories" }} />
      <Tab.Screen name="TabProfile" component={UserProfileScreen} options={{ title: "Profile" }} />
      <Tab.Screen name="TabCart" component={CartScreen} options={{ title: "Cart" }} />
    </Tab.Navigator>
  );
}

// Drawer Navigator Component
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="DrawerHome"
      drawerStyle={{
        backgroundColor: 'rgba(255, 126, 0, 0.5)',
      }}
    >
      <Drawer.Screen name="DrawerHome" component={BottomTabNavigator} options={{ title: "Menu", headerShown: true }} />
      <Drawer.Screen name="DrawerAbout" component={AboutScreen} options={{ title: "About", headerShown: true }} />
      <Drawer.Screen name="DrawerProfile" component={UserProfileScreen} options={{ title: "Profile", headerShown: true }} />
      <Drawer.Screen name="DrawerContact" component={HelpScreen} options={{ title: "Help", headerShown: true }} />
      <Drawer.Screen name="DrawerTracking" component={TrackingScreen} options={{ title: "Tracking", headerShown: true }} />
      <Drawer.Screen name="DrawerLogout" component={LogoutScreen} options={{ title: "Logout", headerShown: true }} />
    </Drawer.Navigator>
  );
}

const AppNavigator = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error fetching user from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen name="Single Product" component={ItemScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="TrackingResult" component={OrderTrackingScreen} />
          <Stack.Screen name="Fruit" component={FruitsScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Vegetable" component={VegetablesScreen} />
          <Stack.Screen name="Meat" component={MeatScreen} />
          <Stack.Screen name="Snack" component={SnacksScreen} />
          <Stack.Screen name="Oil Product" component={OilProductsScreen} />
          <Stack.Screen name="Dairy" component={DairyScreen} />
          <Stack.Screen name="FinalCheckout" component={FinalCheckoutScreen} />
  
          <Stack.Screen name="Success" component={SuccessScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
