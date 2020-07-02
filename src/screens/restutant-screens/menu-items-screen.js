import React, { Component } from 'react';
import { View, StatusBar, BackHandler } from 'react-native';
import Toast from 'react-native-easy-toast';

import { PageHeader } from '../../components/common/header';
import ItemContainer from '../../containers/restaurant-containers/items-container';

class MenuItemsScreen extends Component {
	constructor(props) {
		super(props);

		//Binding handleBackButtonClick function with this
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}

	componentWillMount () {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentWillUnmount () {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick () {
		this.props.navigation.navigate('HomeScreen');
		return true;
	}

	render () {
		const { params } = this.props.navigation.state;

		return (
			<View style={{ flex: 1 }}>
				<StatusBar hidden={false} />
				<PageHeader
					navigation={this.props.navigation}
					title={'Menu Items'}
				/>
				<ItemContainer
					parent={this}
					catId={params.catId}
					navigation={this.props.navigation}
					items={params && params.items ? params.items : []}
				/>
				<Toast
					ref="toast"
					position='bottom'
					fadeOutDuration={3000}
					textStyle={{ color: '#fff' }}
				/>
			</View>
		)
	}
}

export default MenuItemsScreen 