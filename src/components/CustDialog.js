import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Dialog, { SlideAnimation, DialogContent, FadeAnimation } from 'react-native-popup-dialog';
import Constants from '../config/Constants';
import OutlineButton from './OutlineButton';

export default class CustDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currInd: 0,
      visible: false,
      onPressClose: null,
      containerStyle: null,
      isTwoButton: false,
      container1: null,
      onButtonPress: null,
      image: null,
      title: null,
      text: null,
      actionText: null,
      onNagativeButton: null,
      onPositiveButton: null,
      nagativeText: null,
      positiveText: null,
      isError: false
    };
  }

  showDialog = (
    onPressClose,
    isTwoButton,
    onButtonPress,
    image,
    title,
    text,
    actionText,
    onNagativeButton,
    onPositiveButton,
    nagativeText,
    positiveText,
  ) => {
    console.log('show');
    this.setState({
      onPressClose: onPressClose,
      isTwoButton: isTwoButton,
      onButtonPress: onButtonPress,
      image: image,
      title: title,
      text: text,
      actionText: actionText,
      onNagativeButton: onNagativeButton,
      onPositiveButton: onPositiveButton,
      nagativeText: nagativeText,
      positiveText: positiveText,
      visible: true,
    });
  };

  showErrorDialog = (title, body) => {
    console.log('show');
    this.setState({
      onPressClose: () => {
        Constants.showDialog.hideDialog();
      },
      isTwoButton: false,
      onButtonPress: () => {
        Constants.showDialog.hideDialog();
      },
      image: require('../assets/images/errorAlertIcon.png'),
      title: title,
      text: body,
      actionText: 'OK',
      onNagativeButton: null,
      onPositiveButton: null,
      nagativeText: null,
      positiveText: null,
      visible: true,
      isError: true
    });
  };

  hideDialog = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      visible,
      onPressClose,
      containerStyle,
      isTwoButton,
      container1,
      onButtonPress,
      image,
      title,
      text,
      actionText,
      onNagativeButton,
      onPositiveButton,
      nagativeText,
      positiveText,
    } = Object.keys(this.props).length > 0 ? this.props : this.state;
    return (
      <Dialog
        visible={visible}
        onTouchOutside={onPressClose}
        dialogAnimation={
          new FadeAnimation({
            initialValue: 0,
            animationDuration: 150,
            useNativeDriver: true,
          })
        }
        width={1}
        height={1}
        containerStyle={containerStyle}
        dialogStyle={styles.dialogStyle}>
        <DialogContent style={[styles.dialogContent, { ...container1 },]}>
          <View>
            <View>
              {false && !!image && <Image
                style={styles.imageView}
                resizeMode={'contain'}
                source={image}
              />}
              {false && <Text style={styles.boldText}>{title}</Text>}
              <Text style={styles.inputText}>{text}</Text>
            </View>
            {isTwoButton && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.outlineButton}
                  onPress={onNagativeButton}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: Constants.COLOR_PRIMARY },
                    ]}>
                    {nagativeText}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={onPositiveButton}>
                  <Text style={styles.buttonText}>{positiveText}</Text>
                </TouchableOpacity>
              </View>
            )}
            {!isTwoButton && (
              <OutlineButton
                onPress={onButtonPress}
                btnText={actionText}
                containerStyle={styles.hostView} />
            )}
          </View>
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  outlineButton: {
    flex: 1,
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: 15,
    borderWidth: 1,
    marginEnd: 5,
    paddingVertical: 3,
    borderColor: Constants.COLOR_PRIMARY,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginStart: 7,
    marginTop: 5,
  },
  smallButton: {
    flex: 1,
    alignSelf: 'center',
    borderRadius: 5,
    paddingVertical: 3,
    marginStart: 5,
    marginTop: 15,
    borderWidth: 1,
    borderColor: Constants.COLOR_PRIMARY,
    backgroundColor: Constants.COLOR_PRIMARY,
  },
  buttonText: {
    alignSelf: 'center',
    paddingVertical: 7,
    fontSize: 14,
    color: 'white',
  },
  hostView: {
    alignSelf: 'center',
    marginTop: 25,
    width: '80%',
  },
  inputText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    color: Constants.COLOR_BLACK,
  },
  boldText: {
    fontSize: 18,
    color: Constants.COLOR_PRIMARY,
    alignSelf: 'center',
    marginTop: 15,
  },
  imageView: {
    width: 40,
    height: 40,
    marginTop: 20,
    alignSelf: 'center',
  },
  dialogStyle: {
    backgroundColor: Constants.COLOR_TRANSPARENT,
    borderRadius: 0
  },
  dialogContent: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    opacity: 0.85
  },
});
