import React, { useRef, useState, useEffect } from 'react';
import { DeviceEventEmitter, StatusBar, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Constants from '../config/Constants';

const OutlineButton: (props) => Node = (props) => {

    const { containerStyle, btnText, onPress } = props

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, containerStyle]}>
            <Text style={styles.btnText}>{btnText}</Text>
        </TouchableOpacity>
    );

}

export default OutlineButton;

const styles = StyleSheet.create({
    btnText : {
        fontSize : 20,
        padding : 10,
        alignSelf : 'center',
        color : Constants.COLOR_WHITE,
        fontWeight : '400'
    },
    container: {
        backgroundColor : Constants.COLOR_PRIMARY
    }
});
