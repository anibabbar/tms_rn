import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgetPassword from '../screens/ForgetPassword';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContentComponent from '../components/CustomDrawerContentComponent'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VendorScreen from '../screens/VendorScreen';
import AddVendor from '../screens/AddVendor';
import ClientScreen from '../screens/ClientScreen';
import AddClient from '../screens/AddClient';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (
        <Drawer.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false,
                presentation: "card"
            }}
            drawerContent={(props) => <CustomDrawerContentComponent {...props} />}>
            <Drawer.Screen
                options={{
                    title: 'Dashboard',
                    drawerIcon: ({ focused, size }) => (
                        <MaterialIcons
                            name="view-dashboard"
                            size={20} />
                    )
                }}
                name="Home"
                component={HomeScreen} />
        </Drawer.Navigator>
    );
}

const MainNavigator = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    gestureEnabled: false,
                    headerShown: false,
                    presentation: "card"
                }}
                initialRouteName='Splash'>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name='Dashboard' component={MyDrawer} />
                <Stack.Screen name="Vendors" component={VendorScreen} />
                <Stack.Screen name="AddVendor" component={AddVendor} />
                <Stack.Screen name="Clients" component={ClientScreen} />
                <Stack.Screen name="AddClient" component={AddClient} />
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerTitle: 'Forget Password'
                    }}
                    name='Forget'
                    component={ForgetPassword} />
            </Stack.Navigator>
        </NavigationContainer>
    );

}

const styles = StyleSheet.create({
    imageIcon: {
        width: 14,
        height: 14
    },
});


export default MainNavigator;