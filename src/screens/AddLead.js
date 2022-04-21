import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
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
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { actions, getContentCSS, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import ClientHistory from '../components/ClientHistory';
import PayementTree from '../components/PayementTree';
import VendorPaymentTree from '../components/VendorPaymentTree';

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
    const [estimateDeparture, setEstimateDeparture] = useState(new Date());
    const [budget, setBudget] = useState('');
    const [open, setOpen] = useState(false)

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

    const [clientDefault, setClintDefault] = useState('');
    const [assignUserDefault, setAssignUserDefaulr] = useState('');

    const [vendorList, setVendorList] = useState([])
    const [clientList, setUserList] = useState([])
    const leadStatus = ["New Lead", "In Progress", "Confirmed", "Payment Pending", "Cancelled", "Not eligible"]

    const [hotelFormat, setHotelFormat] = useState('')
    const hotelFormatRichEditor = useRef()

    useEffect(() => {
        if (!!props.route.params && !!props.route.params.vendorData) {
            setVendorData(props.route.params.vendorData)
            setEdit(true)

            setPackage(props.route.params.vendorData.package_format == 1 ? true : false)
            setFlight(props.route.params.vendorData.flight == 1 ? true : false)
            setHotel(props.route.params.vendorData.hotel == 1 ? true : false)
            setTransfers(props.route.params.vendorData.transfers == 1 ? true : false)
            setSinghseeing(props.route.params.vendorData.sightseeing == 1 ? true : false)
            setInsurance(props.route.params.vendorData.insurance == 1 ? true : false)
            setVisa(props.route.params.vendorData.visa == 1 ? true : false)
            setPassport(props.route.params.vendorData.passport == 1 ? true : false)

            setDetails(props.route.params.vendorData.details)
            setAdditionalReq(props.route.params.vendorData.requests)
            setPurchaseInfo(props.route.params.vendorData.purchase_info)
            setLeadStatusValue(props.route.params.vendorData.status)

            setDepartureCity(props.route.params.vendorData.departure_city)
            setArrivalCity(props.route.params.vendorData.arrival_city)
            setHotelCat(props.route.params.vendorData.hotel_category)
            setEstimateDeparture(new Date(props.route.params.vendorData.estimated_dep))
            setBudget(props.route.params.vendorData.budget)

            setNoOfAdult(!!props.route.params.vendorData.adults ? props.route.params.vendorData.adults.toString() : '')
            setNoOfChild(!!props.route.params.vendorData.children ? props.route.params.vendorData.children.toString() : '')
            setNoOfInfrants(!!props.route.params.vendorData.infants ? props.route.params.vendorData.infants.toString() : '')
            setNoOfNight(!!props.route.params.vendorData.no_of_nights ? props.route.params.vendorData.no_of_nights.toString() : '')
            setNoOfRoom(!!props.route.params.vendorData.no_of_rooms ? props.route.params.vendorData.no_of_rooms.toString() : '')
            setMealPlan(!!props.route.params.vendorData.mealPlan ? props.route.params.vendorData.mealPlan.toString() : '')

            setHotelFormat(props.route.params.vendorData.hotel_format)
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
            if (!!props.route.params && !!props.route.params.vendorData) {
                for (let index = 0; index < data.data.length; index++) {
                    const element = data.data[index];
                    if (element.id == props.route.params.vendorData.assigned_user) {
                        setAssignUserItem(element)
                        setAssignUserDefaulr(element)
                    }
                }
            }
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
            if (!!props.route.params && !!props.route.params.vendorData) {
                for (let index = 0; index < data.data.length; index++) {
                    const element = data.data[index];
                    if (element.id == props.route.params.vendorData.client_id) {
                        setClientItem(element)
                        setClintDefault(element)
                    }
                }
            }
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onMenuPress = () => {
        props.navigation.pop()
    }

    const onAddVendor = async () => {
        if (!noOfAdult) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid no of adult.');
        } else if (!noOfRoom) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid no of room.');
        } else if (!departureCity) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid departure city.');
        } else if (!arrivalCity) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid arrival city.');
        } else if (!leadStatusValue) {
            Constants.showAlert.alertWithType('error', 'Error', 'Select Lead status.');
        }

        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('adults', noOfAdult)
        formBody.append('no_of_rooms', noOfRoom)
        formBody.append('departure_city', departureCity)
        formBody.append('arrival_city', arrivalCity)
        formBody.append('status', leadStatusValue)
        if (!!clientItem && !!clientItem.id) {
            formBody.append('client_id', clientItem.id)
        }
        if (!!assignUserItem && !!assignUserItem.id) {
            formBody.append('assigned_id', assignUserItem.id)
        }
        if (!!hotelCat) {
            formBody.append('hotel_category', hotelCat)
        }
        console.log(moment(estimateDeparture).format('YYYY-MM-DD HH:mm:ss'));
        if (!!estimateDeparture) {
            formBody.append('estimated_dep', moment(estimateDeparture).format('YYYY-MM-DD HH-mm-ss'))
        }
        if (!!budget) {
            formBody.append('budget', budget)
        }
        if (!!details) {
            formBody.append('details', details)
        }
        if (!!purchaseInfo) {
            formBody.append('purchase_info', purchaseInfo)
        }
        formBody.append('flight', flight ? 1 : 0)

        formBody.append('transfers', transfers ? 1 : 0)

        formBody.append('sightseeing', singhseeing ? 1 : 0)

        formBody.append('insurance', insurance ? 1 : 0)
        if (!!noOfNight) {
            formBody.append('no_of_nights', noOfNight)
        }
        if (!!additionalRequest) {
            formBody.append('requests', additionalRequest)
        }
        if (!!mealPlan) {
            formBody.append('mealPlan', mealPlan)
        }
        formBody.append('hotel', hotel ? 1 : 0)

        formBody.append('visa', visa ? 1 : 0)

        formBody.append('passport', passport ? 1 : 0)

        formBody.append('package', isPackage ? 1 : 0)

        if (!!hotelFormat) {
            console.log(hotelFormat, 'hotelFormat');
            formBody.append('hotel_format', hotelFormat)
        }

        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.LEAD_LIST, formBody, headers);
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'Lead added Successfully!');
            EventEmitter.emit("onAddLead");
            props.navigation.pop();
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onEditVendor = async () => {
        if (!noOfAdult) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid no of adult.');
        } else if (!noOfRoom) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid no of room.');
        } else if (!departureCity) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid departure city.');
        } else if (!arrivalCity) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid arrival city.');
        } else if (!leadStatusValue) {
            Constants.showAlert.alertWithType('error', 'Error', 'Select Lead status.');
        }

        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('adults', noOfAdult)
        formBody.append('no_of_rooms', noOfRoom)
        formBody.append('departure_city', departureCity)
        formBody.append('arrival_city', arrivalCity)
        formBody.append('status', leadStatusValue)
        if (!!clientItem && !!clientItem.id) {
            formBody.append('client_id', clientItem.id)
        }
        if (!!assignUserItem && !!assignUserItem.id) {
            formBody.append('assigned_id', assignUserItem.id)
        }
        if (!!hotelCat) {
            formBody.append('hotel_category', hotelCat)
        }
        console.log(moment(estimateDeparture).format('YYYY-MM-DD HH:mm:ss'));
        if (!!estimateDeparture) {
            formBody.append('estimated_dep', moment(estimateDeparture).format('YYYY-MM-DD HH-mm-ss'))
        }
        if (!!budget) {
            formBody.append('budget', budget)
        }
        if (!!details) {
            formBody.append('details', details)
        }
        if (!!purchaseInfo) {
            formBody.append('purchase_info', purchaseInfo)
        }
        formBody.append('flight', flight ? 1 : 0)

        formBody.append('transfers', transfers ? 1 : 0)

        formBody.append('sightseeing', singhseeing ? 1 : 0)

        formBody.append('insurance', insurance ? 1 : 0)
        if (!!noOfNight) {
            formBody.append('no_of_nights', noOfNight)
        }
        if (!!additionalRequest) {
            formBody.append('requests', additionalRequest)
        }
        if (!!mealPlan) {
            formBody.append('mealPlan', mealPlan)
        }
        formBody.append('hotel', hotel ? 1 : 0)

        formBody.append('visa', visa ? 1 : 0)

        formBody.append('passport', passport ? 1 : 0)

        formBody.append('package', isPackage ? 1 : 0)

        if (!!hotelFormat) {
            console.log(hotelFormat, 'hotelFormat');
            formBody.append('hotel_format', hotelFormat)
        }
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.EDIT_LEAD + '/' + vendorData.id, formBody, headers);
        console.log(data, 'ApiEndpoint.EDIT_LEAD', ApiEndpoint.EDIT_LEAD + '/' + vendorData.id);
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'Lead edited Successfully!');
            EventEmitter.emit("onAddLead");
            props.navigation.pop();
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onEditorInitialized = () => {
        hotelFormatRichEditor.current?.registerToolbar(function (items) {
            // console.log('Toolbar click, selected items (insert end callback):', items);
        });
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
                            <TouchableOpacity
                                onPress={() => {
                                    setOpen(true)
                                }}
                                style={[styles.dropdown1BtnStyle1, { marginHorizontal: 10, width: undefined, flex: 1 }]}>
                                <Text style={styles.dropdown1BtnTxtStyle}>{!!estimateDeparture ? moment(estimateDeparture).format('DD/MM/YYYY') : 'Departure Date'}</Text>
                                <MaterialCommunityIcons name={'calendar'} color={'#444'} size={22} />
                            </TouchableOpacity>
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
                            defaultValue={clientDefault}
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
                            defaultValue={assignUserDefault}
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
                            defaultValue={leadStatusValue}
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

                    {hotel && <>
                        <View style={[styles.inputFirstView, { marginTop: 20 }]}>
                            <RichToolbar
                                editor={hotelFormatRichEditor}
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
                            ref={hotelFormatRichEditor}
                            initialContentHTML={hotelFormat}
                            placeholder={'Hotel Format'}
                            editorInitializedCallback={() => onEditorInitialized()}
                            onChange={(text) => {
                                setHotelFormat(text);
                                console.log(desc);
                            }}
                        />
                    </>}

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

                    {isEdit && <ClientHistory props={props} />}

                    <View height={80} />

                    {isEdit && <PayementTree props={props} />}

                    <View height={10} />
                    
                    {isEdit && <VendorPaymentTree props={props} />}
                </ScrollView>
            </View>
            <DatePicker
                modal
                open={open}
                date={estimateDeparture}
                mode={'date'}
                onConfirm={(date) => {
                    setOpen(false)
                    setEstimateDeparture(date)
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
        paddingBottom: 200,
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