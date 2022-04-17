import React, { Component } from 'react';
import { TextInput, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Constants from '../config/Constants';


export default class CustButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: props.password
        };
    }


    render() {
        const {
            text,
            containerStyle,
            onPress,
            isImage,
            isRightImage
        } = this.props;

        return (
            <TouchableOpacity
                style={[styles.hostView, containerStyle]}
                onPress={onPress}>
                <Text style={styles.buttonText}>{text}</Text>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    closeImage: {
        width: 16,
        alignSelf: 'center',
        height: 16,
        marginLeft: 10
    },
    calenderImage: {
        width: 20,
        alignSelf: 'center',
        height: 20,
        marginEnd: 10
    },
    buttonText: {
        alignSelf: 'center',
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    hostView: {
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: Constants.COLOR_PRIMARY
    }
})