import { StyleSheet, View, Image, Pressable, Linking } from "react-native";
import Text from "./Text";
import { useNavigate, useParams } from "react-router-native";
import useRepository from "../hooks/useRepository";
const styles = StyleSheet.create({
    githubButton: {
        backgroundColor: '#0969da',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    githubButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    item: {
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
    languageBar: {
        flexDirection: "row",
        marginHorizontal: 7,
        justifyContent: "flex-start"
    },
    languageContainer: {
        backgroundColor: '#fbc0faff',
        marginHorizontal: 5,
        marginBottom: 5,
        padding: 5,
        borderRadius: 12,
    },
    language: {
        fontSize: 14,
        textAlign: 'center',
    },
    fullName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        flexShrink: 0,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    stat: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        paddingHorizontal: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
    },
    statText: {
        fontSize: 12,
        color: '#888',
        paddingTop: 2,
    },
    statNumber: {
        fontSize: 12,
        fontWeight: 'bold',
    }
});


const RepositoryItem = ({ item, detailed }) => {
    const navigate = useNavigate()

    const convertNumber = (number) => {
        if (number < 1000) return number
        else if (number < 1000000) return (number / 1000).toFixed(1) + 'k'
        else if (number < 1000000000) return (number / 1000000).toFixed(1) + 'm'
        else return 'BIG'
    }
    return (
        <View testID="repositoryItem" style={styles.item}>
            <View style={styles.header}>
                <View style={styles.info}>
                    <Pressable onPress={() => navigate(`/repositories/${item.id}`)} testID="fullName">
                        <Text style={styles.fullName}>{item.fullName}</Text>
                    </Pressable>
                    <Text testId="description" style={styles.description}>{item.description}</Text>
                </View>
                <Image
                    style={styles.avatar}
                    source={{ uri: item.ownerAvatarUrl }}
                />
            </View>
            <View style={styles.languageBar}>
                <View style={styles.languageContainer}>
                    <Text testId="language" style={styles.language}>{item.language}</Text>
                </View>
            </View>
            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Text testId="stars" style={styles.statNumber}>{convertNumber(item.stargazersCount)}</Text>
                    <Text style={styles.statText}>Stars</Text>
                </View>
                <View style={styles.stat}>
                    <Text testId="forks" style={styles.statNumber}>{convertNumber(item.forksCount)}</Text>
                    <Text style={styles.statText}>Forks</Text>
                </View>
                <View style={styles.stat}>
                    <Text testId="reviews" style={styles.statNumber}>{convertNumber(item.reviewCount)}</Text>
                    <Text style={styles.statText}>Reviews</Text>
                </View>
                <View style={styles.stat}>
                    <Text testId="rating" style={styles.statNumber}>{item.ratingAverage}</Text>
                    <Text style={styles.statText}>Rating</Text>
                </View>
            </View>
            {detailed
                ? <View style={styles.statsContainer}>
                    <Pressable
                        style={styles.githubButton}
                        onPress={() => Linking.openURL(item.url)}
                    >
                        <Text style={styles.githubButtonText}>Open in GitHub</Text>
                    </Pressable>
                </View>
                : null
            }
        </View>
    );
}

export default RepositoryItem