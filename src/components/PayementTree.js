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
import SelectDropdown from 'react-native-select-dropdown';

const PayementTree = ({ props }) => {

    const [amount, setAmount] = useState('')
    const [mode, setMode] = useState('')
    const [status, setStatus] = useState('')
    const [isEdit, setEdit] = useState(false);
    const [vendorData, setVendorData] = useState({});
    const [startDate, setStartDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const statusList = ['Received', 'Pending']
    useEffect(() => {
        if (!!props.route.params && !!props.route.params.vendorData) {
            setVendorData(props.route.params.vendorData)
            setEdit(true)
        }
    }, [])

    const onMenuPress = () => {
        props.navigation.pop()
    }

    const onAddVendor = async () => {
        if (!startDate) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid date.');
        } else if (!amount) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid amount.');
        } else if (!status) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid status.');
        } else if (!mode) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid mode.');
        }
        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('date', moment(startDate).format('YYYY-MM-DD HH-mm-ss'))
        formBody.append('amount', amount)
        formBody.append('status', status)
        formBody.append('mode', mode)
        formBody.append('client_id', props.route.params.vendorData.client_id)
        formBody.append('lead_id', props.route.params.vendorData.id)
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.PAYMENT_TREE, formBody, headers);
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'Payment Tree added Successfully!');
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onEditVendor = async () => {
        if (!startDate) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid date.');
        } else if (!amount) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid amount.');
        } else if (!status) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid status.');
        } else if (!mode) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid mode.');
        }
        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('date', moment(startDate).format('YYYY-MM-DD HH-mm-ss'))
        formBody.append('amount', amount)
        formBody.append('status', status)
        formBody.append('mode', mode)
        formBody.append('client_id', props.route.params.vendorData.client_id)
        formBody.append('lead_id', props.route.params.vendorData.id)
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.PAYMENT_TREE, formBody, headers);
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'Payment Tree added Successfully!');
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
                    <Text style={styles.title}>{'Payment Tree'}</Text>
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

                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setAmount(text)
                        }}
                        value={amount}
                        keyboardType={'phone-pad'}
                        placeholder={'Enter Amount'} />

                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setMode(text)
                        }}
                        value={mode}
                        placeholder={'Enter Mode'} />

                    <View style={{ marginHorizontal: 10 }}>
                        <SelectDropdown
                            data={statusList}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                                setStatus(selectedItem)
                            }}
                            defaultButtonText={'Select status'}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                            buttonStyle={styles.dropdown1BtnStyle}
                            buttonTextStyle={styles.dropdown1BtnTxtStyle}
                            renderDropdownIcon={isOpened => {
                                return <MaterialCommunityIcons name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={22} />;
                            }}
                            dropdownIconPosition={'right'}
                            dropdownStyle={styles.dropdown1DropdownStyle}
                            rowStyle={styles.dropdown1RowStyle}
                            rowTextStyle={styles.dropdown1RowTxtStyle}
                        />
                    </View>

                    <CustButton
                        containerStyle={styles.btnStyle}
                        onPress={() => {
                            if (isEdit) {
                                onEditVendor()
                            } else {
                                onAddVendor()
                            }
                        }}
                        text={isEdit ? 'Add Payment Tree' : 'Add Payment Tree'} />
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
    dropdown1BtnStyle: {
        width: '100%',
        height: 50,
        marginTop: 20,
        alignSelf: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
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
    dropdown1DropdownStyle: {
        backgroundColor: '#EFEFEF'
    },
    dropdown1RowStyle: {
        backgroundColor: '#EFEFEF',
        borderBottomColor: '#C5C5C5'
    },
    dropdown1RowTxtStyle: {
        color: '#444',
        textAlign: 'left'
    },
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
export default connect(mapStateToProps, mapDispatchToProps)(PayementTree);