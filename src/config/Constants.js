import { Dimensions } from 'react-native';

const is_in_beta = true;

const BASEURL = is_in_beta
	? 'https://travelagentsolutions.org/tms20/public/'
	: 'https://travelagentsolutions.org/tms20/public/';

const API_BASEURL = is_in_beta
	? BASEURL + 'api/v1/'
	: BASEURL + 'api/v1/';

export default ({
    BASEURL : BASEURL,
    API_BASEURL: API_BASEURL,
    API_KEY: 'demo',
    COLOR_PRIMARY: '#2ca34c',
    COLOR_TEXT_INPUT: '#daebf7',
    COLOR_PLACEHOLDER: '#7c7c7c',
    COLOR_WHITE: '#FFFFFF',
    COLOR_BLACK: '#000000',
    COLOR_BLACK_TEXT: '#323232',
    COLOR_DIVIDER: '#dedede',
    COLOR_GRAY_TEXT: '#707070',
    COLOR_TRANSPARENT: 'rgba(0,0,0,0)',
    emailReg: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    windowWidth: Dimensions.get('window').width,
    windowHeight: Dimensions.get('window').height,
    ROOT_NAVIGATION: null,
    showLoader: '',
    showDialog: '',
    showAlert: '',
    USER_TOKEN : 'USER_TOKEN',
    USER_DATA: {
        token: ''
    }

})