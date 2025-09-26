import { StyleSheet, View, Image, Pressable, Alert, } from "react-native";
import Text from "./Text";
const styles = StyleSheet.create({
    repo: {
        padding: 15,
        backgroundColor: '#f8f9fa',
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    info: {
        flexDirection: 'column',
        flex: 1,
        marginRight: 10,
        paddingRight: 5,
    },
    fullName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    ratingContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#0969da',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0969da',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        flexWrap: 'wrap',
    },

    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },


});
export const ReviewItem = ({ review, navigate, repositoryName, repositoryId, handleDelete }) => {
    return (
        <View style={styles.repo}>
            <View style={styles.header}>
                <View style={styles.info}>
                    {navigate ?
                        <Pressable onPress={() => navigate(`/repositories/${repositoryId}`)} testID="fullName">
                            <Text style={styles.fullName}>{repositoryName}</Text>
                        </Pressable>
                        : <Text style={styles.fullName}>{review.user.username}</Text>
                    }
                    <Text style={styles.description}>{review.createdAt.split('T')[0]}</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{review.rating}</Text>
                </View>
            </View>
            <View style={styles.statsContainer}>
                <Text style={styles.description}>{review.text}</Text>
            </View>
            {navigate ?
                <Pressable style={styles.button} onPress={
                    () => {
                        Alert.alert('Delete Review', 'Are you sure you want to delete this review?', [
                            {
                                text: 'cancel',
                                onPress: () => {
                                    console.log('Delete cancelled')
                                }
                            },
                            {
                                text: 'delete',
                                onPress: () => {
                                    handleDelete(review.id)
                                }
                            }
                        ])
                    }
                }>
                    <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
                : null}
        </View>
    )
}

export default ReviewItem