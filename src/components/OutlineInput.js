import React, { Component } from 'react';
import { TextInput, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Constants from '../config/Constants';


export default class OutlineInput extends React.Component {

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
			keyboardType,
			textInput
		} = this.props;

		return (
			<View style={[styles.hostView, containerStyle]}>
				<View style={styles.inputMainView}>
					<TextInput
						style={[styles.textInput, textInput]}
						placeholder={placeholder}
						autoCapitalize={'none'}
						keyboardType={keyboardType ? keyboardType : 'default'}
						secureTextEntry={this.state.password}
						onChangeText={(text) => { onChangeText(text) }}
						placeholderTextColor={Constants.COLOR_PLACEHOLDER} 
						{...this.props}/>
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
    inputMainView: {
        width: '100%',
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
	drawableLeft: {
		width: 12,
		height: 12,
		paddingEnd: 20,
		resizeMode: 'contain',
		alignSelf: 'center'
	},
	hostView: {
		paddingHorizontal: 20
	},
	textInput: {
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