import { connect } from 'react-redux'
import React, { Component } from 'react';
import { change } from 'redux-form/immutable';
import Icon from 'react-native-vector-icons/EvilIcons';
import {
    View, StyleSheet, Text, FlatList, Image, TouchableOpacity, ActivityIndicator
} from 'react-native';

import ActionButton from '../../components/common/action-button';
import * as actions from '../../actions/restaurant-actions/category-item-actions';
import { fetchCategoryListAction } from '../../actions/restaurant-actions/home-actions';
import * as selectors from '../../selectors/restaurant-selectors/category-item-selectors';
import { makeSelectCategoryList } from '../../selectors/restaurant-selectors/home-selectors';

class ItemContainer extends Component {
    componentWillReceiveProps (nextProps) {
        const { parent } = this.props;
        if (nextProps.success) {
            // parent.refs.toast.show('Menu Item deleted successfully', 2000);
            this.props.fetchList();
        }
        if (nextProps.failed) {
            // parent.refs.toast.show('Some thing wrong, failed to delete Item', 2000);
        }
    }

    initializeValues = item => {
        this.props.change('name', item.name);
        this.props.change('price', item.price.toString());
        this.props.change('description', item.description);
    }

    _renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                this.initializeValues(item);
                const { navigation } = this.props;
                navigation.navigate('CreateItemScreen', {
                    itemId: item.id,
                    catId: this.props.catId,
                    imageUrl: item.imageUrl
                });

            }}
        >
            <View style={styles.itemStyling}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 70, height: 70, borderRadius: 10 }}
                />
                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 20, }}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text numberOfLines={2} style={styles.description}>
                        {item.description}
                    </Text>
                </View>
                <View style={{ padding: 8 }}>
                    <TouchableOpacity
                        onPress={() => {
                            const { catId } = this.props;
                            this.props.removeItem(catId, item.id)
                        }}
                    >
                        <Icon
                            size={20}
                            name={'close'}
                            color={'#b2b2b2'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    render () {
        const { navigation, catId, deleteLoading, categories } = this.props;
        const category = categories && categories.filter(row => row.id === catId);
        if (deleteLoading) {
            return <ActivityIndicator size={'large'} color={'#1BA2FC'} />
        }
        return (
            <View style={styles.container}>
                {category && category[0].menu_items.length ?
                    <FlatList
                        data={category[0].menu_items}
                        extraData={category}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this._renderItem}
                    /> : <View style={styles.message}>
                        <Text style={[styles.title, { fontWeight: '400' }]}>
                            Item is not created yet!.
                        </Text>
                    </View>
                }
                <ActionButton
                    onPress={() => {
                        navigation.navigate('CreateItemScreen', {
                            catId: catId
                        })
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 10,
        justifyContent: 'space-between'
    },
    itemStyling: {
        flex: 1,
        marginTop: 10,
        paddingBottom: 10,
        shadowRadius: 20,
        shadowOpacity: 0.1,
        shadowColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000'
    },
    description: {
        fontSize: 13,
        fontWeight: '300',
        color: '#cccccc'
    },
    message: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const mapStateToProps = state => ({
    categories: makeSelectCategoryList()(state),
    deleteLoading: selectors.makeSelectDeleteLoading()(state),
    success: selectors.makeSelectSuccessStatus()(state),
    failed: selectors.makeSelectDeleteFailed()(state)
});

const mapDispatchToProps = dispatch => {
    return {
        removeItem: (catId, id) => {
            dispatch(actions.removeItemAction(catId, id));
        },
        fetchList: () => dispatch(fetchCategoryListAction()),
        change: (fieldName, value) => dispatch(change('MenuItemForm', fieldName, value)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemContainer);