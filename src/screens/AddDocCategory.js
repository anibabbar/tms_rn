import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
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
import { actions, getContentCSS, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

const AddDocCategory = (props) => {

    const [type, setType] = useState('')
    const [isEdit, setEdit] = useState(false);
    const [vendorData, setVendorData] = useState({});

    useEffect(() => {
        if (!!props.route.params && !!props.route.params.vendorData) {
            setVendorData(props.route.params.vendorData)
            setType(props.route.params.vendorData.type)
            setEdit(true)
        }
    }, [])

    const onMenuPress = () => {
        props.navigation.pop()
    }

    const onAddVendor = async () => {
        if (!type) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid type.');
        }

        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('type', type)
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.DOC_CAT_LIST, formBody, headers);
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'Doc category added Successfully!');
            EventEmitter.emit("onAddDocCat");
            props.navigation.pop();
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onEditVendor = async () => {
        if (!type) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid type.');
        }
        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('type', type)
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.EDIT_DOC_CAT + '/' + vendorData.id, formBody, headers);
        console.log(data, 'ApiEndpoint.EDIT_CLIENT', ApiEndpoint.EDIT_DOC_CAT + '/' + vendorData.id);
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'Doc category edited Successfully!');
            EventEmitter.emit("onAddDocCat");
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
                            <Text style={styles.title}>{isEdit ? 'Edit Doc category' : 'Add Doc category'}</Text>
                        </View>
                        <View></View>
                    </View>
                </View>
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container1}>
                    <OutlineInput
                        containerStyle={styles.inputFirstView}
                        onChangeText={(text) => {
                            setType(text)
                        }}
                        value={type}
                        placeholder={'Enter Type'} />

                    <CustButton
                        containerStyle={styles.btnStyle}
                        onPress={() => {
                            if (isEdit) {
                                onEditVendor()
                            } else {
                                onAddVendor()
                            }
                        }}
                        text={isEdit ? 'Edit Doc category' : 'Add Doc category'} />
                </ScrollView>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    textInput: {
        minHeight: 80,
        paddingTop: 10,
    },
    inputFirstView: {
        paddingHorizontal: 10,
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
        paddingBottom: 100,
        flexGrow: 1,
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
export default connect(mapStateToProps, mapDispatchToProps)(AddDocCategory);