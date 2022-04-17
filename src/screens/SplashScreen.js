import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Constants from '../config/Constants';
import { connect } from 'react-redux';
import { Types } from '../constants/actionTypes';

const SplashScreen = (props) => {

    useEffect(() => {
        checkLogin()
    }, [])

    const checkLogin = async () => {
        var isLogin = await AsyncStorage.getItem(Constants.USER_TOKEN);
        if (!!isLogin) {
            var data = JSON.parse(isLogin);
            props.save_user_data({ user: data });
            setTimeout(() => {
                props.navigation.navigate('Dashboard')
            }, 3000);
        } else {
            setTimeout(() => {
                props.navigation.navigate('Login')
            }, 3000);
        }
    
    }


    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/logo.png')}
                resizeMode={'contain'}
                style={styles.image} />
        </View>
    );

}

const styles = StyleSheet.create({
    image: {
        width: Constants.windowWidth * 0.8,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

const mapStateToProps = (state) => ({
    profile: state.user.profile
});

const mapDispatchToProps = (dispatch) => ({
    save_user_data: (data) =>
        dispatch({ type: Types.LOGIN, payload: data }),
});
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);