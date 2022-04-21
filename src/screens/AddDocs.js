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
import SelectDropdown from 'react-native-select-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddDocs = (props) => {

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [notes, setNotes] = useState('')
    const [isEdit, setEdit] = useState(false);
    const [vendorData, setVendorData] = useState({});
    const [docCat, setDocCat] = useState([]);
    const [catItem, setCatItem] = useState({});
    const descRichEditor = useRef()
    const notesRichEditor = useRef()

    useEffect(() => {
        if (!!props.route.params && !!props.route.params.vendorData) {
            setVendorData(props.route.params.vendorData)
            setTitle(props.route.params.vendorData.title)
            setDesc(props.route.params.vendorData.description)
            setNotes(props.route.params.vendorData.notes)
            setEdit(true)
        }
        getDocCat()
    }, [])

    const getDocCat = async () => {
        Constants.showLoader.showLoader();
        var headers = {
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.GetApiCall(ApiEndpoint.DOC_CAT_LIST, headers);
        if (!!data && !!data.status) {
            setDocCat(data.data)
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onMenuPress = () => {
        props.navigation.pop()
    }

    const onAddVendor = async () => {
        if (!title) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid title.');
        }

        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('title', title)
        if (!!desc) {
            formBody.append('description', desc)
        }
        if (!!notes) {
            formBody.append('notes', notes)
        }
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.DOC_LIST, formBody, headers);
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'Doc added Successfully!');
            EventEmitter.emit("onAddDoc");
            props.navigation.pop();
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onEditVendor = async () => {
        if (!title) {
            Constants.showAlert.alertWithType('error', 'Error', 'Enter valid title.');
        }
        Constants.showLoader.showLoader();
        var formBody = new FormData();
        formBody.append('title', title)
        if (!!desc) {
            formBody.append('description', desc)
        }
        if (!!notes) {
            formBody.append('notes', notes)
        }
        var headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": props.profile.token_type + ' ' + props.profile.access_token
        }
        let data = await ApiServices.PostApiCall(ApiEndpoint.EDIT_DOC + '/' + vendorData.id, formBody, headers);
        console.log(data, 'ApiEndpoint.EDIT_CLIENT', ApiEndpoint.EDIT_DOC + '/' + vendorData.id);
        if (!!data && !!data.status) {
            Constants.showAlert.alertWithType('success', 'Success', 'Doc edited Successfully!');
            EventEmitter.emit("onAddDoc");
            props.navigation.pop();
        } else {
            Constants.showAlert.alertWithType('error', 'Error', data.message);
        }
        Constants.showLoader.hideLoader();
    }

    const onEditorInitialized = () => {
        descRichEditor.current?.registerToolbar(function (items) {
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
                            <Text style={styles.title}>{isEdit ? 'Edit Doc' : 'Add Doc'}</Text>
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
                            setTitle(text)
                        }}
                        value={title}
                        placeholder={'Enter Title'} />
                    <View style={{ marginHorizontal: 10 }}>
                        <SelectDropdown
                            data={docCat}
                            onSelect={(selectedItem, index) => {
                                setCatItem(selectedItem)
                            }}
                            defaultButtonText={'Select Doc Category'}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.type;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.type;
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
                    <View style={[styles.inputFirstView, { marginTop: 20 }]}>
                        <RichToolbar
                            editor={descRichEditor}
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
                        ref={descRichEditor}
                        initialContentHTML={desc}
                        placeholder={'Enter Description'}
                        editorInitializedCallback={() => onEditorInitialized()}
                        onChange={(text) => {
                            setDesc(text);
                            console.log(desc);
                        }}
                    />


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
                        placeholder={'Enter Private notes'}
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
                        text={isEdit ? 'Edit Doc' : 'Add Doc'} />
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
        height: 50,
        width: '100%',
        marginTop: 20,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
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
export default connect(mapStateToProps, mapDispatchToProps)(AddDocs);