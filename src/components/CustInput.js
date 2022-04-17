import React, { Component } from 'react';
import { TextInput, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Constants from '../config/Constants';


export default class CustInput extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			password: props.password
		};
	}


	render() {
		const {
			label,
			placeholder,
			drawableLeft,
			password,
			containerStyle,
			drawableRight,
			onChangeText,
			keyboardType
		} = this.props;

		return (
			<View style={[styles.hostView, containerStyle]}>
				<View style={styles.inputMainView}>
					<TextInput
						style={styles.textInput}
						placeholder={placeholder}
						autoCapitalize={'none'}
						keyboardType={keyboardType ? keyboardType : 'default'}
						secureTextEntry={this.state.password}
						onChangeText={(text) => { onChangeText(text) }}
						placeholderTextColor={Constants.COLOR_PLACEHOLDER} />
					{password && <TouchableOpacity
						style={styles.drawableLeft}
						onPress={() => {
							this.setState({
								password: !this.state.password
							});
						}}>
						<Image
							style={styles.drawableLeft}
							source={drawableRight} />
					</TouchableOpacity>}
				</View>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	drawableLeft: {
		width: 12,
		height: 12,
		paddingEnd: 20,
		resizeMode: 'contain',
		alignSelf: 'center'
	},
	inputMainView: {
		flexDirection: 'row',
		borderRadius: 20,
		backgroundColor: Constants.COLOR_TEXT_INPUT
	},
	hostView: {
		paddingHorizontal: 20
	},
	textInput: {
		paddingHorizontal: 20,
		paddingVertical: 14,
		color: 'black',
		fontSize: 12,
		flex: 1,
		color: Constants.COLOR_TEXT,
	},
	inputText: {
		fontSize: 13,
		color: Constants.COLOR_TEXT
	},
})