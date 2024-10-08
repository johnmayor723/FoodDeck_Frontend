// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import CartScreen from './screens/CartScreen';
import ContactUsScreen from './screens/ContactScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen'; 
import PaymentScreen from './screens/PaymentScreen'; 

// Stack Navigator
const Stack = createStackNavigator();

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Drawer Navigator
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
                    } else if (route.name === 'TabProfile') {
                        iconName = 'person';
                    } else if (route.name === 'TabCart') {
                        iconName = 'cart';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#FF7E00',  // Active icon color
                tabBarInactiveTintColor: 'gray',   // Inactive icon color
                tabBarStyle: { backgroundColor: '#fff' },  // Tab bar background color
            })}
        >
            <Tab.Screen name="TabHome" component={HomeScreen} options={{ title: "Home" }} />
            <Tab.Screen name="TabProfile" component={UserProfileScreen} options={{ title: "Profile" }} />
            <Tab.Screen name="TabCart" component={CartScreen} options={{ title: "Cart" }} />
        </Tab.Navigator>
    );
}

// Drawer Navigator Component
function DrawerNavigator() {
    return (
        <Drawer.Navigator initialRouteName="DrawerHome">
            <Drawer.Screen 
                name="DrawerHome" 
                component={BottomTabNavigator} 
                options={{ title: "Home", headerShown: true }} 
            />
            <Drawer.Screen 
                name="DrawerProfile" 
                component={UserProfileScreen} 
                options={{ title: "Profile", headerShown: true }} 
            />
            <Drawer.Screen 
                name="DrawerCart" 
                component={CartScreen} 
                options={{ title: "Cart", headerShown: true }} 
            />
            <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
            <Drawer.Screen name="Order Tracking" component={OrderTrackingScreen} />
        </Drawer.Navigator>
    );
}

// Main App Component
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{ headerShown: false }}  // Hides the header
                />
                <Stack.Screen
                    name="Auth"
                    component={AuthScreen}
                    options={{ headerShown: false }}  // Hides the header
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                    options={{ headerShown: false }}  // Hides the header
                />
                <Stack.Screen
                    name="Main"
                    component={DrawerNavigator}
                    options={{ headerShown: false }}  // Disable the header for the main drawer stack
                />
                <Stack.Screen
                    name="Payment"
                    component={PaymentScreen}
                    options={{ headerShown: false }}  // Disable the header for the payment stack
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
