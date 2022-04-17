import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, StatusBar, Dimensions, Text, TouchableOpacity } from 'react-native';
import Constants from '../config/Constants';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker'
import CustButton from '../components/CustButton';
import ApiServices from '../config/ApiServices';
import ApiEndpoint from '../config/ApiEndpoint';
import { connect } from 'react-redux';
import { Types } from '../constants/actionTypes';

const HomeScreen = (props) => {
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [type, setType] = useState('')
    const [vendorList, setVendorList] = useState([])
    const [reportType, setReportType] = useState('Vendor Report')
    const countries = ["Vendor Report", "Lead Report", "Inwards Payment Report", "Vendor Payment Report"]
    const leadStatus = ["In Progress", "Confirmed", "Payment Pending", "Cancelled", "Not eligible"]
    const inWardPaymentStatus = ["Recieved", "Pending"]
    const vendorPaymentStatus = ["Paid", "Pending"]

    useEffect(() => {
        getVendors()
    }, [])

    const getVendors = async () => {
        Constants.showLoader.showLoader();
        var headers = {
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.GetApiCall(ApiEndpoint.VENDOR_LIST, headers);
        console.log(ApiEndpoint.VENDOR_LIST, data, props, 'ApiEndpoint.VENDOR_LIST');
        if (!!data && !!data.status) {
            setVendorList(data.data)
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onMenuPress = () => {
        props.navigation.openDrawer()
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={false} backgroundColor={Constants.COLOR_PRIMARY} barStyle={'dark-content'} />
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => { onMenuPress() }}>
                            <Icon name={'menu'} size={25} color={'black'} />
                        </TouchableOpacity>

                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Dashboard</Text>
                        </View>

                        <View style={styles.badgeIconView}>
                        </View>
                    </View>

                </View>
                <View style={styles.container1}>
                    <SelectDropdown
                        data={countries}
                        onSelect={(selectedItem, index) => {
                            setReportType(selectedItem)
                            console.log(selectedItem, index, 'selectedItem');
                        }}
                        defaultValueByIndex={0}
                        defaultButtonText={'Select Report Type'}
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
                    <TouchableOpacity
                        onPress={() => {
                            setDate(!!startDate ? startDate : new Date())
                            setType('start')
                            setOpen(true)
                        }}
                        style={styles.dropdown1BtnStyle1}>
                        <Text style={styles.dropdown1BtnTxtStyle}>{!!startDate ? moment(startDate).format('DD/MM/YYYY') : 'Select Start Date'}</Text>
                        <MaterialCommunityIcons name={'calendar'} color={'#444'} size={22} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setDate(!!endDate ? endDate : new Date())
                            setType('end')
                            setOpen(true)
                        }}
                        style={styles.dropdown1BtnStyle1}>
                        <Text style={styles.dropdown1BtnTxtStyle}>{!!endDate ? moment(endDate).format('DD/MM/YYYY') : 'Select End Date'}</Text>
                        <MaterialCommunityIcons name={'calendar'} color={'#444'} size={22} />
                    </TouchableOpacity>

                    {reportType == 'Vendor Report' && <SelectDropdown
                        data={vendorList}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                        }}
                        defaultButtonText={'Select Vendor'}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.company_name;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item.company_name;
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
                    />}

                    {reportType == 'Lead Report' && <SelectDropdown
                        data={leadStatus}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
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
                    />}

                    {reportType == 'Lead Report' && <SelectDropdown
                        data={countries}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                        }}
                        defaultButtonText={'Select Assigned Team'}
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
                    />}

                    {reportType == 'Inwards Payment Report' && <SelectDropdown
                        data={inWardPaymentStatus}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                        }}
                        defaultButtonText={'Select Payment Status'}
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
                    />}

                    {reportType == 'Vendor Payment Report' && <SelectDropdown
                        data={vendorPaymentStatus}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                        }}
                        defaultButtonText={'Select Payment Status'}
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
                    />}

                    <CustButton
                        containerStyle={styles.btnStyle}
                        text={'View Report'} />
                </View>

            </View>
            <DatePicker
                modal
                open={open}
                date={date}
                mode={'date'}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                    if (type == 'start') {
                        setStartDate(date)
                    } else {
                        setEndDate(date)
                    }
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    btnStyle: {
        marginTop: 40
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
    dropdown1BtnStyle: {
        width: '100%',
        height: 50,
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    boxSubTitle1: {
        color: 'white',
        fontSize: 14,
        marginTop: 3,
        opacity: 0.7,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    boxSubTitle: {
        color: 'white',
        fontSize: 9,
        marginTop: 3,
        textAlign: 'center'
    },
    boxTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    boxView1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRowThird1: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        flex: 1
    },
    boxView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'white',
    },
    marginTopView: {
        marginTop: 15,
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    headerRowThird: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: 'white',
        flex: 1
    },
    dateText1: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 5
    },
    dateText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 5
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    badgetext: {
        height: 18,
        fontSize: 10,
        paddingVertical: 2,
        paddingHorizontal: 6,
        textAlign: 'center'
    },
    badgeIconView: {
        position: 'relative',
        padding: 5,
    },
    badge: {
        color: Constants.COLOR_PRIMARY,
        position: 'absolute',
        zIndex: 10,
        top: -2,
        right: -4,
        padding: 1,
        borderRadius: 10,
        backgroundColor: 'black',
    },
    subTitle: {
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold'
    },
    title: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold'
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center'
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
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);