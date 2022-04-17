import React, { Component } from 'react';
import { View, ActivityIndicator, Text,StyleSheet } from 'react-native';
import Constants from '../config/Constants';

export default class CustLoader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			color: '',
			message: 'Loading...',
			showLoader: false
		};
	}

	showLoader = (message, color) => {
		this.setState({
			isVisible: true,
			color: Constants.COLOR_PRIMARY,
			message: message ? message : 'Loading...'
		});
	};

	hideLoader = () => {
		this.setState({
			isVisible: false
		});
	};

	render() {
		const { isVisible } = Object.keys(this.props).length > 0 ? this.props : this.state;

		return (
			<View
				style={{
					elevation: 10,
					position: 'absolute',
					width: isVisible ? '100%' : '0%',
					height: isVisible ? '100%' : '0%',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 10,
					backgroundColor: 'transparent'
				}}
			>
				{isVisible && (
					<View
						style={styles.innerview}
					>
						<ActivityIndicator size={this.state.message ? 'small' : 'large'} color={'#fff'} />
						<Text
							style={styles.lodingtxt}
						>
							{this.state.message}
						</Text>
					</View>
				)}
			</View>
		);
	}
}
const styles = StyleSheet.create({
	
	innerview:{
		maxHeight: 200,
		backgroundColor: Constants.COLOR_PRIMARY,
		justifyContent: 'space-evenly',
		alignItems: 'center',
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 10,
		shadowColor: '#AEAEAE',
		shadowOffset: {
			width: 2,
			height: 2
		},
		shadowRadius: 6,
		shadowOpacity: 1,
		elevation: 21
	},
	lodingtxt:{
		color: 'white',
		fontSize: 15,
		marginTop: 10
	},
  });
  