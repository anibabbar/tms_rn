import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar, TouchableOpacity, Text, FlatList, ScrollView } from 'react-native';
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
import CheckBox from '@react-native-community/checkbox';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddLead = (props) => {

    const [noOfAdult, setNoOfAdult] = useState('')
    const [noOfChild, setNoOfChild] = useState('')
    const [noOfInfrants, setNoOfInfrants] = useState('')
    const [noOfNight, setNoOfNight] = useState('')
    const [noOfRoom, setNoOfRoom] = useState('');
    const [mealPlan, setMealPlan] = useState('');

    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [hotelCat, setHotelCat] = useState('');
    const [estimateDeparture, setEstimateDeparture] = useState('');
    const [budget, setBudget] = useState('');

    const [details, setDetails] = useState('');
    const [additionalRequest, setAdditionalReq] = useState('');
    const [purchaseInfo, setPurchaseInfo] = useState('');

    const [assignUserItem, setAssignUserItem] = useState('');
    const [clientItem, setClientItem] = useState('');
    const [leadStatusValue, setLeadStatusValue] = useState('');

    const [isEdit, setEdit] = useState(false);
    const [vendorData, setVendorData] = useState({});

    const [isPackage, setPackage] = useState(false);
    const [flight, setFlight] = useState(false);
    const [hotel, setHotel] = useState(false);
    const [transfers, setTransfers] = useState(false);
    const [singhseeing, setSinghseeing] = useState(false);
    const [insurance, setInsurance] = useState(false);
    const [visa, setVisa] = useState(false);
    const [passport, setPassport] = useState(false);

    const [vendorList, setVendorList] = useState([])
    const [clientList, setUserList] = useState([])
    const leadStatus = ["New Lead", "In Progress", "Confirmed", "Payment Pending", "Cancelled", "Not eligible"]

    useEffect(() => {
        if (!!props.route.params && !!props.route.params.vendorData) {
            setVendorData(props.route.params.vendorData)
            setName(props.route.params.vendorData.name)
            setAltPhone(props.route.params.vendorData.alt_phone)
            setEmail(props.route.params.vendorData.email)
            setPhone(props.route.params.vendorData.phone)
            setAddress(props.route.params.vendorData.address)
            setNote(props.route.params.vendorData.note)
            setEdit(true)
        }
        getUsers();
        getVendors();
    }, []);

    const getUsers = async () => {
        Constants.showLoader.showLoader();
        var headers = {
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.GetApiCall(ApiEndpoint.USERS_LIST, headers);
        if (!!data && !!data.status) {
            setUserList(data.data)
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const getVendors = async () => {
        Constants.showLoader.showLoader();
        var headers = {
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.GetApiCall(ApiEndpoint.CLIENT_LIST, headers);
        console.log(ApiEndpoint.VENDOR_LIST, data, props, 'ApiEndpoint.VENDOR_LIST');
        if (!!data && !!data.status) {
            setVendorList(data.data)
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onMenuPress = () => {
        props.navigation.pop()
    }

    const onAddVendor = async () => {
        if (!name) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid name.');
        }

        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('name', name)
        if (!!phone) {
            formBody.append('phone', phone)
        }
        if (!!email) {
            formBody.append('email', email)
        }
        if (!!altphone) {
            formBody.append('alt_phone', altphone)
        }
        if (!!address) {
            formBody.append('address', address)
        }
        if (!!note) {
            formBody.append('note', note)
        }
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.CLIENT_LIST, formBody, headers);
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'Client added Successfully!');
            EventEmitter.emit("onAddClient");
            props.navigation.pop();
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onEditVendor = async () => {
        if (!name) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid name.');
        }
        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('name', name)
        if (!!phone) {
            formBody.append('phone', phone)
        }
        if (!!email) {
            formBody.append('email', email)
        }
        if (!!altphone) {
            formBody.append('alt_phone', altphone)
        }
        if (!!address) {
            formBody.append('address', address)
        }
        if (!!note) {
            formBody.append('note', note)
        }
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.EDIT_CLIENT + '/' + vendorData.id, formBody, headers);
        console.log(data, 'ApiEndpoint.EDIT_CLIENT', ApiEndpoint.EDIT_CLIENT + '/' + vendorData.id);
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'Client edited Successfully!');
            EventEmitter.emit("onAddClient");
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
                            <Text style={styles.title}>{isEdit ? 'Edit Lead' : 'Add Lead'}</Text>
                        </View>
                        <View></View>
                    </View>
                </View>
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container1}>
                    <View style={styles.rowView}>
                        <View style={styles.checkBoxContainer}>
                            <View style={{ borderWidth: 1, height: 22, width: 22, borderRadius: 5 }}>
                                <CheckBox
                                    boxType={'square'}
                                    hideBox
                                    style={{ height: 20, width: 20 }}
                                    onCheckColor={Constants.COLOR_PRIMARY}
                                    onValueChange={(newValue) => setPackage(newValue)}
                                    value={isPackage} />
                            </View>
                            <Text style={styles.checkBoxText}>Package</Text>
                        </View>
                        <View style={styles.checkBoxContainer}>
                            <View style={{ borderWidth: 1, height: 22, width: 22, borderRadius: 5 }}>
                                <CheckBox
                                    boxType={'square'}
                                    hideBox
                                    style={{ height: 20, width: 20 }}
                                    onCheckColor={Constants.COLOR_PRIMARY}
                                    onValueChange={(newValue) => setFlight(newValue)}
                                    value={flight} />
                            </View>
                            <Text style={styles.checkBoxText}>Flight</Text>
                        </View>
                    </View>
                    <View style={styles.rowView}>
                        <View style={styles.checkBoxContainer}>
                            <View style={{ borderWidth: 1, height: 22, width: 22, borderRadius: 5 }}>
                                <CheckBox
                                    boxType={'square'}
                                    hideBox
                                    style={{ height: 20, width: 20 }}
                                    onCheckColor={Constants.COLOR_PRIMARY}
                                    onValueChange={(newValue) => setHotel(newValue)}
                                    value={hotel} />
                            </View>
                            <Text style={styles.checkBoxText}>Hotel</Text>
                        </View>
                        <View style={styles.checkBoxContainer}>
                            <View style={{ borderWidth: 1, height: 22, width: 22, borderRadius: 5 }}>
                                <CheckBox
                                    boxType={'square'}
                                    hideBox
                                    style={{ height: 20, width: 20 }}
                                    onCheckColor={Constants.COLOR_PRIMARY}
                                    onValueChange={(newValue) => setTransfers(newValue)}
                                    value={transfers} />
                            </View>
                            <Text style={styles.checkBoxText}>Transfers</Text>
                        </View>
                    </View>
                    <View style={styles.rowView}>
                        <View style={styles.checkBoxContainer}>
                            <View style={{ borderWidth: 1, height: 22, width: 22, borderRadius: 5 }}>
                                <CheckBox
                                    boxType={'square'}
                                    hideBox
                                    style={{ height: 20, width: 20 }}
                                    onCheckColor={Constants.COLOR_PRIMARY}
                                    onValueChange={(newValue) => setSinghseeing(newValue)}
                                    value={singhseeing} />
                            </View>
                            <Text style={styles.checkBoxText}>Singht Seeing</Text>
                        </View>
                        <View style={styles.checkBoxContainer}>
                            <View style={{ borderWidth: 1, height: 22, width: 22, borderRadius: 5 }}>
                                <CheckBox
                                    boxType={'square'}
                                    hideBox
                                    style={{ height: 20, width: 20 }}
                                    onCheckColor={Constants.COLOR_PRIMARY}
                                    onValueChange={(newValue) => setInsurance(newValue)}
                                    value={insurance} />
                            </View>
                            <Text style={styles.checkBoxText}>Insurance</Text>
                        </View>
                    </View>
                    <View style={styles.rowView}>
                        <View style={styles.checkBoxContainer}>
                            <View style={{ borderWidth: 1, height: 22, width: 22, borderRadius: 5 }}>
                                <CheckBox
                                    boxType={'square'}
                                    hideBox
                                    style={{ height: 20, width: 20 }}
                                    onCheckColor={Constants.COLOR_PRIMARY}
                                    onValueChange={(newValue) => setVisa(newValue)}
                                    value={visa} />
                            </View>
                            <Text style={styles.checkBoxText}>Visa</Text>
                        </View>
                        <View style={styles.checkBoxContainer}>
                            <View style={{ borderWidth: 1, height: 22, width: 22, borderRadius: 5 }}>
                                <CheckBox
                                    boxType={'square'}
                                    hideBox
                                    style={{ height: 20, width: 20 }}
                                    onCheckColor={Constants.COLOR_PRIMARY}
                                    onValueChange={(newValue) => setPassport(newValue)}
                                    value={passport} />
                            </View>
                            <Text style={styles.checkBoxText}>Passport</Text>
                        </View>
                    </View>

                    <View style={styles.rowView1}>
                        <View style={styles.inputContainer}>
                            <OutlineInput
                                containerStyle={styles.inputFirstView}
                                onChangeText={(text) => {
                                    setNoOfAdult(text)
                                }}
                                value={noOfAdult}
                                placeholder={'Enter No of Adults'} />
                        </View>
                        <View style={styles.inputContainer}>
                            <OutlineInput
                                containerStyle={styles.inputFirstView}
                                onChangeText={(text) => {
                                    setNoOfChild(text)
                                }}
                                value={noOfChild}
                                keyboardType={'phone-pad'}
                                placeholder={'Enter No of Children'} />
                        </View>
                    </View>
                    <View style={styles.rowView1}>
                        <View style={styles.inputContainer}>
                            <OutlineInput
                                containerStyle={styles.inputFirstView}
                                onChangeText={(text) => {
                                    setNoOfInfrants(text)
                                }}
                                value={noOfInfrants}
                                keyboardType={'phone-pad'}
                                placeholder={'Enter No of infants'} />
                        </View>
                        <View style={styles.inputContainer}>
                            <OutlineInput
                                containerStyle={styles.inputFirstView}
                                onChangeText={(text) => {
                                    setNoOfNight(text)
                                }}
                                value={noOfNight}
                                keyboardType={'phone-pad'}
                                placeholder={'Enter No of Nights'} />
                        </View>
                    </View>
                    <View style={styles.rowView1}>
                        <View style={styles.inputContainer}>
                            <OutlineInput
                                containerStyle={styles.inputFirstView}
                                onChangeText={(text) => {
                                    setNoOfRoom(text)
                                }}
                                value={noOfRoom}
                                placeholder={'Enter No of Rooms'} />
                        </View>
                        <View style={styles.inputContainer}>
                            <OutlineInput
                                containerStyle={styles.inputFirstView}
                                onChangeText={(text) => {
                                    setMealPlan(text)
                                }}
                                value={mealPlan}
                                placeholder={'Enter Meal Plan'} />
                        </View>
                    </View>

                    <View style={styles.rowView1}>
                        <View style={styles.inputContainer}>
                            <OutlineInput
                                containerStyle={styles.inputFirstView}
                                onChangeText={(text) => {
                                    setDepartureCity(text)
                                }}
                                value={departureCity}
                                placeholder={'Enter Departure city'} />
                        </View>
                        <View style={styles.inputContainer}>
                            <OutlineInput
                                containerStyle={styles.inputFirstView}
                                onChangeText={(text) => {
                                    setArrivalCity(text)
                                }}
                                value={arrivalCity}
                                placeholder={'Enter Arrival city'} />
                        </View>
                    </View>
                    <View style={styles.rowView1}>
                        <View style={styles.inputContainer}>
                            <OutlineInput
                                containerStyle={styles.inputFirstView}
                                onChangeText={(text) => {
                                    setHotelCat(text)
                                }}
                                value={hotelCat}
                                placeholder={'Enter Hotel Category'} />
                        </View>
                        <View style={styles.inputContainer}>
                            <OutlineInput
                                containerStyle={styles.inputFirstView}
                                onChangeText={(text) => {
                                    setEstimateDeparture(text)
                                }}
                                value={estimateDeparture}
                                keyboardType={'phone-pad'}
                                placeholder={'Enter Estimated Departure'} />
                        </View>
                    </View>
                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setBudget(text)
                        }}
                        value={budget}
                        keyboardType={'phone-pad'}
                        placeholder={'Enter Budget'} />

                    <View style={{ marginHorizontal: 10 }}>
                        <SelectDropdown
                            data={vendorList}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                                setClientItem(selectedItem)
                            }}
                            defaultButtonText={'Select Client'}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.name;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.name;
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

                    <View style={{ marginHorizontal: 10 }}>
                        <SelectDropdown
                            data={clientList}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                                setAssignUserItem(selectedItem)
                            }}
                            defaultButtonText={'Select Assign Team'}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.name;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.name;
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

                    <View style={{ marginHorizontal: 10 }}>
                        <SelectDropdown
                            data={leadStatus}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                                setLeadStatusValue(selectedItem)
                            }}
                            defaultButtonText={'Select Lead Status'}
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

                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setDetails(text)
                        }}
                        textInput={styles.textInput}
                        value={details}
                        multiline={true}
                        numberOfLines={4}
                        placeholder={'Enter Details'} />
                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setAdditionalReq(text)
                        }}
                        textInput={styles.textInput}
                        value={additionalRequest}
                        multiline={true}
                        numberOfLines={4}
                        placeholder={'Enter Additional Requests'} />
                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setPurchaseInfo(text)
                        }}
                        textInput={styles.textInput}
                        value={purchaseInfo}
                        multiline={true}
                        numberOfLines={4}
                        placeholder={'Enter Purchase Info'} />
                    <CustButton
                        containerStyle={styles.btnStyle}
                        onPress={() => {
                            if (isEdit) {
                                onEditVendor()
                            } else {
                                onAddVendor()
                            }
                        }}
                        text={isEdit ? 'Edit Lead' : 'Add Lead'} />
                </ScrollView>
            </View>
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
    checkBoxText: {
        marginStart: 10
    },
    checkBoxContainer: {
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        flex: 1
    },
    rowView1: {
        flexDirection: 'row'
    },
    rowView: {
        flexDirection: 'row',
        marginTop: 10
    },
    textInput: {
        minHeight: 80,
        paddingTop: 10,
    },
    inputFirstView: {
        paddingHorizontal: 10,
        flex: 1
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
        paddingHorizontal: 15,
        paddingBottom: 30,
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
export default connect(mapStateToProps, mapDispatchToProps)(AddLead);