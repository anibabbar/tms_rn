import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, SafeAreaView, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import CustButton from '../components/CustButton';
import CustInput from '../components/CustInput';
import Constants from '../config/Constants';

const ForgetPassword = (props) => {


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden={false} backgroundColor={Constants.COLOR_PRIMARY} barStyle={'dark-content'} />
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    resizeMode={'contain'}
                    source={require('../assets/images/logo.png')} />
                <CustInput
                    containerStyle={styles.inputFirstView}
                    onChangeText={(text) => { }}
                    keyboardType={'email-address'}
                    drawableRight={require('../assets/images/eye.png')}
                    placeholder={'Email'} />
                <CustButton
                    text={'SUBMIT'}
                    onPress={() => {
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
        alignItems: 'center',
        backgroundColor: 'white'
    },
});

export default ForgetPassword;