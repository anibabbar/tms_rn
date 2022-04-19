import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar, TouchableOpacity, Text, FlatList } from 'react-native';
import Constants from '../config/Constants';
import { connect } from 'react-redux';
import { Types } from '../constants/actionTypes';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiEndpoint from '../config/ApiEndpoint';
import ApiServices from '../config/ApiServices';
import CustButton from '../components/CustButton';
import { SwipeListView } from 'react-native-swipe-list-view';
import CustInput from '../components/CustInput';
import OutlineInput from '../components/OutlineInput';
import EventEmitter from "react-native-eventemitter";

const AddUser = (props) => {

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [isEdit, setEdit] = useState(false);
    const [vendorData, setVendorData] = useState({});

    useEffect(() => {
        if (!!props.route.params && !!props.route.params.vendorData) {
            setVendorData(props.route.params.vendorData)
            setName(props.route.params.vendorData.name)
            setEmail(props.route.params.vendorData.email)
            setPhone(props.route.params.vendorData.phone)
            setEdit(true)
        }
    }, [])

    const onMenuPress = () => {
        props.navigation.pop()
    }

    const onAddVendor = async () => {
        if (!name) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid name.');
        } else if (!email) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid email.');
        } else if (!password) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid password.');
        } else if (!phone) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid phone.');
        }
        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('name', name)
        formBody.append('email', email)
        formBody.append('password', password)
        formBody.append('phone', phone)
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.USERS_LIST, formBody, headers);
        console.log(ApiEndpoint.USERS_LIST, 'ApiEndpoint.VENDOR_LIST');
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'User added Successfully!');
            EventEmitter.emit("onAddUser");
            props.navigation.pop();
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onEditVendor = async () => {
        if (!name) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid name.');
        } else if (!email) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid email.');
        } else if (!phone) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid phone.');
        }
        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('name', name)
        formBody.append('email', email)
        if (!!password) {
            formBody.append('password', password)
        }
        if (!!phone) {
            formBody.append('phone', phone)
        }
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.USERS_LIST + '/' + vendorData.id, formBody, headers);
        console.log(ApiEndpoint.VENDOR_LIST, 'ApiEndpoint.VENDOR_LIST');
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'User edited Successfully!');
            EventEmitter.emit("onAddUser");
            props.navigation.pop();
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={false} backgroundColor={Constants.COLOR_PRIMARY} barStyle={'dark-content'} />
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => { onMenuPress() }}>
                            <Icon name={'arrow-left'} size={25} color={'black'} />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{isEdit ? 'Edit User' : 'Add User'}</Text>
                        </View>
                        <View></View>
                    </View>
                </View>
                <View style={styles.container1}>
                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setName(text)
                        }}
                        value={name}
                        placeholder={'Enter Name'} />
                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setEmail(text)
                        }}
                        value={email}
                        keyboardType={'email-address'}
                        placeholder={'Enter Email'} />
                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setPassword(text)
                        }}
                        password={true}
                        drawableRight={require('../assets/images/eye.png')}
                        value={password}
                        placeholder={'Enter password'} />
                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setPhone(text)
                        }}
                        value={phone}
                        keyboardType={'phone-pad'}
                        placeholder={'Enter Phone'} />

                    <CustButton
                        containerStyle={styles.btnStyle}
                        onPress={() => {
                            if (isEdit) {
                                onEditVendor()
                            } else {
                                onAddVendor()
                            }
                        }}
                        text={isEdit ? 'Edit User' : 'Add User'} />
                </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    inputFirstView: {
        paddingHorizontal: 10
    },
    btnStyle: {
        marginTop: 30,
        marginHorizontal: 10,
        paddingHorizontal: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold'
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    headerRowSecond: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: Dimensions.get('window').height * 0.035,
        alignItems: 'center'
    },
    headerView: {
        paddingTop: getStatusBarHeight(true),
        paddingBottom: 10
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    container1: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: 'white'
    }
});

const mapStateToProps = (state) => ({
    profile: state.user.profile
});

const mapDispatchToProps = (dispatch) => ({
    save_user_data: (data) =>
        dispatch({ type: Types.LOGIN, payload: data }),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddUser);