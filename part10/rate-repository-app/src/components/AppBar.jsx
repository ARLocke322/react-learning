import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import Text from "./Text";
import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';
const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        // ...
    },
    statusBar: {
        flexDirection: "row",
        marginHorizontal: 10,
        justifyContent: "center"
    },
    button: {
        marginHorizontal: 5,
        marginBottom: 5,
        padding: 5,
        backgroundColor: '#d7e9fbff',
        borderRadius: 8,
    }
});

const AppBar = () => {
    const { data, error, loading, refetch } = useQuery(ME, {
        fetchPolicy: 'cache-and-network'
    });

    if (loading) {
        return <Text>Loading user...</Text>
    }
    if (error) {
        return <Text>Error loading user</Text>
    }
    console.log(data)

    return (
        <View style={styles.container}>
            <ScrollView horizontal>
                <View style={styles.statusBar}>
                    <Link to="/repositories" style={styles.button}>
                        <Text>Repositories</Text>
                    </Link>
                    <Link to="/add-review" style={styles.button}>
                        <Text>Add Review</Text>
                    </Link>
                    {data.me
                        ?
                        <Link to="/signout" style={styles.button}>
                            <Text>Sign Out</Text>
                        </Link>
                        :

                        <Link to="/signin" style={styles.button}>
                            <Text>Sign In</Text>
                        </Link>

                    }
                    {data.me ?
                    <Link to="/reviews" style={styles.button}>
                        <Text>My reviews</Text>
                    </Link> 
                    : 
                    <Link to="/signup" style={styles.button}>
                        <Text>Sign Up</Text>
                    </Link>
                    }

                </View>
            </ScrollView>

        </View>
    );
};

export default AppBar;