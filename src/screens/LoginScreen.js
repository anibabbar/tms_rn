import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import CustButton from '../components/CustButton';
import CustInput from '../components/CustInput';
import Constants from '../config/Constants';
import { connect } from 'react-redux';
import { Types } from '../constants/actionTypes';
import ApiEndpoint from '../config/ApiEndpoint';
import ApiServices from '../config/ApiServices';
import AsyncStorage from '@react-native-community/async-storage';

const LoginScreen = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onLoginPress = async () => {
        if (!email) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid email.');
        } else if (!password) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid password.');
        }
        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('email', email)
        formBody.append('password', password)
        var headers = {
            "Content-Type": "multipart/form-data"
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.LOGIN_USER, formBody, headers);
        if (!!data && !!data.access_token) {
            AsyncStorage.setItem(Constants.USER_TOKEN, JSON.stringify(data))
            props.save_user_data({ user: data });
            Constants.showAlert.alertWithType('success', 'Success', 'Login Successfully!');
            props.navigation.navigate('Dashboard');
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden={false} backgroundColor={Constants.COLOR_PRIMARY} barStyle={'dark-content'} />
            <View style={styles.container}>
                <Image
                    resizeMode={'contain'}
                    style={styles.image}
                    source={require('../assets/images/logo.png')} />
                <CustInput
                    containerStyle={styles.inputFirstView}
                    onChangeText={(text) => {
                        setEmail(text)
                    }}
                    keyboardType={'email-address'}
                    drawableRight={require('../assets/images/eye.png')}
                    placeholder={'Enter Email'} />
                <CustInput
                    containerStyle={styles.inputSecondView}
                    password={true}
                    onChangeText={(text) => {
                        setPassword(text)
                    }}
                    drawableRight={require('../assets/images/eye.png')}
                    placeholder={'Enter password'} />
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('Forget')
                    }}
                    style={styles.forgetView}>
                    <Text style={styles.forgetText}>Forget Password?</Text>
                </TouchableOpacity>
                <CustButton
                    text={'Login'}
                    onPress={() => {
                        onLoginPress()
                    }}
                    containerStyle={styles.btnView} />
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    btnView: {
        marginTop: Constants.windowHeight * 0.04,
        width: Constants.windowWidth - 60,
    },
    forgetText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: Constants.COLOR_BLACK_TEXT
    },
    forgetView: {
        marginTop: Constants.windowHeight * 0.04,
    },
    inputFirstView: {
        width: Constants.windowWidth,
        marginTop: Constants.windowHeight * 0.05,
        paddingHorizontal: 30
    },
    inputSecondView: {
        width: Constants.windowWidth,
        marginTop: Constants.windowHeight * 0.025,
        paddingHorizontal: 30
    },
    image: {
        width: Constants.windowWidth * 0.5,
        marginTop: Constants.windowHeight * 0.1
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
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
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);