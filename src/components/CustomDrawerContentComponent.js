import React, { useEffect, useState } from 'react';
import { DrawerItemList, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { ScrollView, View, Text, Image, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import Constants from '../config/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';

const noti_Data1 = [
    {
        labelName: 'Dashboard',
        screenName: 'Home',
        iconName: "view-dashboard",
    },
    {
        labelName: 'Client',
        screenName: 'Clients',
        iconName: 'account',
    },
    {
        labelName: `Vendors`,
        screenName: 'Vendors',
        iconName: 'account',
    },
    {
        labelName: 'Docs',
        screenName: 'Docs',
        iconName: 'file-document',
    },
    {
        labelName: 'Leads',
        screenName: 'Leads',
        iconName: 'chart-line-variant',
    },
    {
        labelName: 'Users',
        screenName: 'Users',
        iconName: 'account',
    },
    {
        labelName: 'Company',
        screenName: 'Company',
        iconName: 'office-building',
    },
    {
        labelName: 'About Us',
        screenName: 'AboutUs',
        iconName: null,
        image: require('../assets/images/logo.png')
    }
];


const CustomDrawerContentComponent = (props) => {
    const [isExtraSettings, setExtraSetting] = React.useState(false)
    const [noti_Data, setNotiData] = useState(noti_Data1)

    const onLogoutUser = () => {
        props.navigation.closeDrawer();
        Alert.alert(
            "Lgout",
            "Are you sure you want to logout?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => logoutUser()
                }
            ]
        );
    }

    const logoutUser = () => {
        AsyncStorage.removeItem(Constants.USER_TOKEN);
        Constants.showAlert.alertWithType('success', 'Success', 'Logout Successfully!');
        props.navigation.navigate('Login')
    }

    return (
        <SafeAreaView>
            <ScrollView
                bounces={false}
                {...props}>
                <View
                    style={styles.containerView}>
                    <View style={styles.drawerHeader}>
                        <View style={{ flex: 1 }}>
                            <Image
                                source={require('../assets/images/logo.png')}
                                resizeMode={'contain'}
                                style={styles.drawerImage} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={styles.drawerHeaderText}>TMS</Text>
                        </View>
                        <View style={styles.dividerStyle} />
                    </View>

                    <FlatList
                        style={{}}
                        data={noti_Data}
                        extraData={isExtraSettings}
                        renderItem={({ item, index }) => (
                            <View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {

                                    }}
                                    style={{ flex: 1, flexDirection: "row", paddingHorizontal: 15, alignItems: 'center' }}>
                                    <View>
                                        {!!item.iconName ? <Icon name={item.iconName} size={20} /> :
                                            <Image
                                                source={item.image}
                                                resizeMode={'contain'}
                                                style={{ height: 20, width: 20 }} />}
                                    </View>
                                    <View style={{ width: '85%' }}>
                                        <DrawerItem
                                            label={item.labelName}
                                            labelStyle={{ color: '#454545', fontWeight: 'bold' }}
                                            onPress={() => {
                                                if (!item.subMenu) {
                                                    props.navigation.closeDrawer();
                                                    props.navigation.navigate(item.screenName);
                                                } else {
                                                    for (let i = 0; i < noti_Data.length; i++) {
                                                        if (i == index) {
                                                            noti_Data[i].isOpen = noti_Data[i].isOpen == 1 ? 0 : 1;
                                                        } else {
                                                            noti_Data[i].isOpen = 0;
                                                        }
                                                    }
                                                    setNotiData(noti_Data)
                                                    setExtraSetting(!isExtraSettings)
                                                }
                                            }}
                                        />
                                    </View>
                                    {!!item.subMenu && <View>
                                        <Icon name={item.isOpen == 1 ? 'chevron-up' : 'chevron-down'} size={20} />
                                    </View>}
                                </TouchableOpacity>
                                {!!item.subMenu && item.isOpen == 1 && <View>
                                    <FlatList
                                        style={{ marginLeft: 20 }}
                                        data={item.subMenu}
                                        renderItem={({ item, index }) => (
                                            <View>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    onPress={() => {

                                                    }}
                                                    style={{ flex: 1, flexDirection: "row", paddingHorizontal: 15, alignItems: 'center' }}>
                                                    <View>
                                                        {!!item.iconName ? <Icon name={item.iconName} size={20} /> :
                                                            <Image
                                                                source={item.image}
                                                                style={{ width: 20, height: 20 }} />}
                                                    </View>
                                                    <View style={{ width: '85%' }}>
                                                        <DrawerItem
                                                            key={index}
                                                            label={item.labelName}
                                                            labelStyle={{ color: '#454545', fontWeight: 'bold' }}
                                                            onPress={() => {
                                                                if (!item.subMenu) {
                                                                    if (item.labelName == 'About Us') {
                                                                        props.navigation.navigate(item.screenName, { header: 'About Us', url: 'https://exammo.in/about-us' });
                                                                    } else {
                                                                        props.navigation.navigate(item.screenName);
                                                                    }
                                                                } else {
                                                                    setExtraSetting(!isExtraSettings)
                                                                }
                                                            }}
                                                        />
                                                    </View>
                                                    {!!item.subMenu && <View>
                                                        <Icon name={isExtraSettings ? 'chevron-up' : 'chevron-down'} size={20} />
                                                    </View>}
                                                </TouchableOpacity>
                                                {!!item.subMenu && isExtraSettings && <View>
                                                    <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
                                                        <View style={{ paddingLeft: 15 }}>
                                                            <Icon name={'lock-closed-outline'} size={20} />
                                                        </View>
                                                        <View style={{ width: '80%' }}>
                                                            <DrawerItem
                                                                key={index}
                                                                label={'Privacy'}
                                                                labelStyle={{ color: '#454545', fontWeight: 'bold' }}
                                                                onPress={() => {
                                                                }}
                                                            />

                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
                                                        <View style={{ paddingLeft: 15 }}>
                                                            <Icon name={'document-outline'} size={20} />
                                                        </View>
                                                        <View style={{ width: '80%' }}>
                                                            <DrawerItem
                                                                key={index}
                                                                label={'Terms & Condition'}
                                                                labelStyle={{ color: '#454545', fontWeight: 'bold' }}
                                                                onPress={() => {

                                                                }}
                                                            />

                                                        </View>
                                                    </View>
                                                </View>}
                                            </View>
                                        )}
                                        keyExtractor={(data, i) => i}
                                        numColumns={1}
                                    />
                                </View>}
                            </View>
                        )}
                        keyExtractor={(data, i) => i}
                        numColumns={1}
                    />
                    <TouchableOpacity onPress={() => { onLogoutUser() }} style={{ flexDirection: "row", paddingHorizontal: 15, paddingVertical: 15, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ paddingLeft: 15 }}>
                            <Icon name='exit-to-app' size={20} />
                        </View>
                        <View style={{ width: '95%', left: 15 }}>
                            <Text style={{ color: '#454545', fontWeight: 'bold' }}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )

};

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        top: -5,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgb(240,243,252)',
    },
    headerNavigation: {
        height: 54,
        backgroundColor: '#0390AE',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomBtnView: {
        height: 54,
        // backgroundColor: 'white',
        justifyContent: 'center',
        // flexDirection: 'row',
        alignItems: 'center',
        bottom: 58,
    },
    leftSideHeader: {
        width: '20%',
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:"red"
    },
    labelContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
    },
    bottomBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 178,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgb(218,224,229)',
        backgroundColor: 'rgb(240,243,252)',
    },
    userName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        top: -35,
        left: 5
    },
    userEmail: {
        fontSize: 14,
        // fontWeight: 'bold',
        color: 'white',
        top: -30,
        left: 5
    },
    label: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#324755',
    },
    logoutTxt: {
        fontSize: 14,
        // fontWeight: 'bold',
        color: '#334856',
    },
    versionTxt: {
        fontSize: 12,
        top: 12,
        color: '#6E8CA0',
    },
    rightSideHeader: {
        width: '20%',
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:"red"
    },
    notificationView: {
        width: '100%',
        // borderRadius:25,
        // paddingHorizontal:15,
        // marginHorizontal:1
        // marginBottom: 1,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(240,240,240)',
    },
    noti_list: {
        flex: 1,
        // backgroundColor: 'red',
        paddingHorizontal: 15,
        paddingTop: 30,
        // borderRadius:25,
        // borde
    },
    notificationList: {
        // flexDirection: 'row',
        flex: 1,
        // backgroundColor: 'red',
        justifyContent: 'flex-start',
    },
    examTitleView: {
        width: '100%',
        paddingHorizontal: 15,
        paddingTop: 25,
    },
    examTitle: {
        color: '#334856',
        fontSize: 17,
        fontWeight: 'bold',
    },
    dateEndTxt: {
        color: '#0390AE',
        left: 15,
        fontSize: 16,
    },
    inProgressTxt: {
        color: '#0390AE',
        paddingVertical: 5,
        fontWeight: '500',
        fontSize: 16,
    },
    userTxt: {
        color: '#334856',
        paddingVertical: 5,
        fontWeight: 'bold',
        fontSize: 16,
    },
    bottomListView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        alignItems: 'center',
    },
    progressBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    EditIconView: {
        height: 35,
        width: 35,
        borderRadius: 17.5,
        top: -70,
        left: 60,
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    userIconView: {
        width: 90,
        height: 90,
        borderRadius: 30,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: -20,
    },
    swiperImg: {
        width: 90,
        borderRadius: 30,
        height: 90,
    },
    userImageArea: {
        width: '100%',
        backgroundColor: '#0390AE',
        height: 200,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
        // flex:1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 30,
    },
    dividerStyle: {
        height: 0.5,
        flex: 1,
        width: '100%',
        marginTop: 10,
        backgroundColor: Constants.COLOR_DIVIDER
    },
    drawerHeader: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10
    },
    drawerImage: {
        height: 50,
        marginTop: 10,
        marginBottom: 10
    },
});

export default CustomDrawerContentComponent;