import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
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
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker'
import { actions, getContentCSS, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

const ClientHistory = ({ props }) => {

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [isEdit, setEdit] = useState(false);
    const [vendorData, setVendorData] = useState({});
    const [startDate, setStartDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const notesRichEditor = useRef()
    const [notes, setNotes] = useState('')

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

    const onEditorInitialized = () => {
        notesRichEditor.current?.registerToolbar(function (items) {
            // console.log('Toolbar click, selected items (insert end callback):', items);
        });
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={false} backgroundColor={Constants.COLOR_PRIMARY} barStyle={'dark-content'} />
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Text style={styles.title}>{'Client History'}</Text>
                </View>
                <View style={styles.container1}>
                    <View style={{ marginHorizontal: 10 }}>
                        <TouchableOpacity
                            onPress={() => {
                                setOpen(true)
                            }}
                            style={styles.dropdown1BtnStyle1}>
                            <Text style={styles.dropdown1BtnTxtStyle}>{!!startDate ? moment(startDate).format('DD/MM/YYYY') : 'Select Date'}</Text>
                            <MaterialCommunityIcons name={'calendar'} color={'#444'} size={22} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.inputFirstView, { marginTop: 20 }]}>
                        <RichToolbar
                            editor={notesRichEditor}
                            actions={[
                                actions.setBold,
                                actions.setItalic,
                                actions.insertBulletsList,
                                actions.insertOrderedList,
                            ]}
                        />
                    </View>

                    <RichEditor
                        style={{ minHeight: 100 }}
                        containerStyle={[styles.inputFirstView, { borderWidth: 1, borderColor: 'gray', marginHorizontal: 10, borderRadius: 10, minHeight: 100 }]}
                        ref={notesRichEditor}
                        initialContentHTML={notes}
                        placeholder={'Enter notes'}
                        editorInitializedCallback={() => onEditorInitialized()}
                        onChange={(text) => {
                            setNotes(text);
                        }}
                    />

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
            <DatePicker
                modal
                open={open}
                date={startDate}
                mode={'date'}
                onConfirm={(date) => {
                    setOpen(false)
                    setStartDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    dropdown1BtnStyle1: {
        width: '100%',
        height: 50,
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdown1BtnTxtStyle: {
        color: '#444',
        textAlign: 'left',
        fontSize: 14
    },
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
        paddingTop: 25,
        paddingBottom: 10,
        paddingHorizontal: 10
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    container1: {
        flex: 1,
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
export default connect(mapStateToProps, mapDispatchToProps)(ClientHistory);