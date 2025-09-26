import { StyleSheet, View, Image, Pressable, Linking, FlatList } from "react-native";
import Text from "./Text";
import useRepository from "../hooks/useRepository";
import RepositoryItem from "./RepositoryItem";
import ReviewItem from "./ReviewItem";

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

const RepositoryInfo = ({ repository }) => {
    return <RepositoryItem item={repository} detailed={true} />
};


const SingleRepository = () => {
    const { repository, loading, error, fetchMore } = useRepository(3)
    if (loading) return <Text>Loading...</Text>
    if (error) return <Text>Error loading repository</Text>

    const onEndReach = () => {
        fetchMore()
        
    }
    return (
        <FlatList
            data={repository.reviews.edges} 
            renderItem={({ item }) => <ReviewItem 
            review={item.node} 
            repositoryName={repository.fullName}
            repositoryId={repository.id}
            />}
            keyExtractor={(item) => item.node.id}  
            ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
            onEndReached={onEndReach}
            onEndReachedThreshold={0.5}
        // ...
        />
    );
};

export default SingleRepository;