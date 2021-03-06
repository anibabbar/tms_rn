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
import DocScreen from '../screens/DocScreen';
import AddDocs from '../screens/AddDocs';
import UsersScreen from '../screens/UsersScreen';
import AddUser from '../screens/AddUser';
import LeadsScreen from '../screens/LeadsScreen';
import AddLead from '../screens/AddLead';
import DocCatScreen from '../screens/DocCatScreen';
import AddDocCategory from '../screens/AddDocCategory';

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
                <Stack.Screen name="Docs" component={DocScreen} />
                <Stack.Screen name="AddDocs" component={AddDocs} />
                <Stack.Screen name="Users" component={UsersScreen} />
                <Stack.Screen name="AddUser" component={AddUser} />
                <Stack.Screen name="Leads" component={LeadsScreen} />
                <Stack.Screen name="AddLead" component={AddLead} />
                <Stack.Screen name="DocCat" component={DocCatScreen} />
                <Stack.Screen name="AddDocCat" component={AddDocCategory} />
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