import { FlatList, View, StyleSheet, TextInput } from 'react-native';
import RepositoryItem from './RepositoryItem';
import React, { useState, useEffect } from 'react';
import useRepositories from '../hooks/useRepositories';
import Text from './Text';
import { Picker } from '@react-native-picker/picker';
import { useDebouncedCallback } from 'use-debounce';


const styles = StyleSheet.create({
    separator: {
        height: 10,
    },
    card: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, // Fixed: was "password: 2"
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 15,
        marginBottom: 5,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
});


const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryFilter = ({ order, setOrder, debounced, searchKeyword }) => {
    const [newSearchKeyword, setNewSearchKeyword] = useState(searchKeyword)
    return (
        <View>
            <Picker
                selectedValue={order}
                style={{ height: 100, justifyContent: 'center' }}
                onValueChange={(itemValue, itemIndex) => {
                    setOrder(itemValue.split(','))
                }
                }>
                <Picker.Item label="Latest repositories" value="CREATED_AT,DESC" />
                <Picker.Item label="Highest rated repositories" value="RATING_AVERAGE,DESC" />
                <Picker.Item label="Lowest rated repositories" value="RATING_AVERAGE,ASC" />
            </Picker>
            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="Filter"
                    value={newSearchKeyword}
                    onChangeText={(text) => {
                        setNewSearchKeyword(text)
                        debounced(text)
                    }}
                //secureTextEntry={true}
                />
            </View>
        </View>
    )
}
export class RepositoryListContainer extends React.Component {

    renderHeader = () => {
        const { loading, error, order, setOrder, debounced, searchKeyword } = this.props
        //if (loading) return <Text>Loading...</Text>;
        //if (error) return <Text>Error loading repositories</Text>;


        return (
            <RepositoryFilter
                order={order} setOrder={setOrder} searchKeyword={searchKeyword} debounced={debounced}
            />
        )
    }

    render() {
        const { repositories, onEndReached } = this.props
        const repositoryNodes = repositories && repositories.edges
            ? repositories.edges.map((edge) => edge.node)
            : [];

        return (
            <FlatList
                data={repositoryNodes}
                ItemSeparatorComponent={ItemSeparator}
                ListHeaderComponent={this.renderHeader}
                renderItem={({ item }) => <RepositoryItem item={item} />}
                keyExtractor={(item) => item.id}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
            />
        );
    }

}

const RepositoryList = () => {
    const [order, setOrder] = useState(["CREATED_AT", "DESC"])
    const [searchKeyword, setSearchKeyword] = useState('')

    const debounced = useDebouncedCallback((filter) => setSearchKeyword(filter), 300)
    const { repositories, fetchMore, loading, error } = useRepositories(order, searchKeyword, 3);

    const onEndReach = () => {

        console.log('onEndReached triggered');
        fetchMore()
    }
    return (
        <RepositoryListContainer
            repositories={repositories}
            loading={loading}
            error={error}
            order={order} setOrder={setOrder}
            searchKeyword={searchKeyword} debounced={debounced}
            onEndReached={onEndReach}

        />
    );
};






export default RepositoryList;