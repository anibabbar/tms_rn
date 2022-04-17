import React, { useRef, useState, useEffect } from 'react';
import { DeviceEventEmitter, StatusBar, StyleSheet, View } from 'react-native';
import Constants from '../config/Constants';
import CustDialog from './CustDialog';
import DropdownAlert from 'react-native-dropdownalert';
import CustLoader from './CustLoader';

const RootComponent: (props) => Node = (props) => {

    useEffect(() => {
        Constants.showLoader = this.showLoader;
        Constants.showDialog = this.showDialog;
        Constants.showAlert = this.dropDownAlertRef;
    }, [])

    return (
        <View style={styles.container}>
            {props.children}
            <CustLoader ref={(showLoader) => (this.showLoader = showLoader)} />
            <CustDialog ref={(showDialog) => (this.showDialog = showDialog)} />
            <DropdownAlert
             ref={showAlert => this.dropDownAlertRef = showAlert} />
        </View>
    );

}

export default RootComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
