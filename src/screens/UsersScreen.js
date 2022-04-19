import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar, TouchableOpacity, Text, FlatList, Alert } from 'react-native';
import Constants from '../config/Constants';
import { connect } from 'react-redux';
import { Types } from '../constants/actionTypes';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiEndpoint from '../config/ApiEndpoint';
import ApiServices from '../config/ApiServices';
import CustButton from '../components/CustButton';
import { SwipeListView } from 'react-native-swipe-list-view';
import EventEmitter from "react-native-eventemitter";

const UsersScreen = (props) => {

    const [vendorList, setVendorList] = useState([])


    useEffect(() => {
        getVendorList()
        EventEmitter.on("onAddUser", onAddUser);

        return () => {
            EventEmitter.removeListener("onAddUser", onAddUser);
        }
    }, [])

    const onAddUser = () => {
        getVendorList()
    }

    const getVendorList = async () => {
        Constants.showLoader.showLoader();
        var headers = {
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.GetApiCall(ApiEndpoint.USERS_LIST, headers);
        if (!!data && !!data.status) {
            var newArray = [];
            for (let index = 0; index < data.data.length; index++) {
                const element = data.data[index];
                element.key = index;
                newArray.push(element)
            }
            setVendorList(newArray)
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onMenuPress = () => {
        props.navigation.pop()
    }

    const onAddVendor = () => {
        props.navigation.navigate('AddUser');
    }

    const onVendorClick = () => {
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => onVendorClick()}
                style={styles.cardView}>
                <Text style={styles.textCard}>Name: {item.name}</Text>
                {<Text style={styles.textCard}>Email: {!!item.email ? item.email : '-'}</Text>}
                {<Text style={styles.textCard}>Phone: {!!item.phone ? item.phone : '-'}</Text>}
            </TouchableOpacity>
        )
    }

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const onDeleteVendor = async (rowMap, rowKey) => {
        Constants.showLoader.showLoader();
        var headers = {
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.USERS_LIST + '/' + rowMap[rowKey].props.item.id + '/delete', null, headers);
        if (!!data && !!data.status) {
            const newData = [...vendorList];
            const prevIndex = vendorList.findIndex(item => item.key === rowKey);
            newData.splice(prevIndex, 1);
            setVendorList(newData);
            Constants.showAlert.alertWithType('success', 'Success', 'User deleted Successfully!');
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const deleteRow = (rowMap, rowKey) => {
        Alert.alert(
            "Delete Vendor",
            "Are you sure you want to delete vendor?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => onDeleteVendor(rowMap, rowKey)
                }
            ]
        );
        closeRow(rowMap, rowKey);
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    const updateItem = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        props.navigation.navigate('AddUser', {
            vendorData: rowMap[rowKey].props.item
        })
    }

    const renderHiddenItem = (data, rowMap) => (
        <View
            style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft, { right: props.profile.id !== data.item.id ? 75 : 0, borderTopRightRadius: props.profile.id !== data.item.id ? 0 : 10, borderBottomRightRadius: props.profile.id !== data.item.id ? 0 : 10, width: props.profile.id !== data.item.id ? 75 : 150 }]}
                onPress={() => updateItem(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Update</Text>
            </TouchableOpacity>
            {props.profile.id !== data.item.id && <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight, { borderTopRightRadius: 10, borderBottomRightRadius: 10 }]}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>}
        </View>
    );

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
                            <Text style={styles.title}>Users</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => { onAddVendor() }}>
                            <Icon name={'account-plus'} size={25} color={'black'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.container1}>
                    {/* <CustButton
                        containerStyle={styles.btnStyle}
                        text={'Add Vendor'} /> */}
                    <SwipeListView
                        data={vendorList}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-150}
                        previewRowKey={'0'}
                        previewOpenValue={-40}
                        showsVerticalScrollIndicator={false}
                        previewOpenDelay={3000}
                        onRowDidOpen={onRowDidOpen} />
                </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        marginVertical: 7,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        borderColor: "#DEDEDE"
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    textCard: {
        fontSize: 12,
        marginBottom: 5,
        flex: 1
    },
    cardView: {
        marginVertical: 7,
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: "#DEDEDE",
        elevation: 3,
        shadowColor: '#444444',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 10
    },
    btnStyle: {
        marginTop: 20,
        marginHorizontal: 10,
        paddingHorizontal: 10
    },
    image: {
        width: Constants.windowWidth * 0.8,
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
export default connect(mapStateToProps, mapDispatchToProps)(UsersScreen);