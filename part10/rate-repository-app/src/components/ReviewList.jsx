import { FlatList } from "react-native";
import useUser from "../hooks/useUser";
import ReviewItem from "./ReviewItem";
import Text from "./Text";
import { useNavigate } from "react-router-native";
import useDeleteReview from "../hooks/useDeleteReview";


const ReviewList = () => {
    const { user, loading, error, refetch } = useUser(true)
    const navigate = useNavigate()
    const [deleteReview, result] = useDeleteReview()

    const handleDelete = async (reviewId) => {
        try {
            await deleteReview(reviewId)
            refetch()
        } catch (error) {
            console.error('Delete failed:', error);
        }
    }

    //if (loading) return <Text>Loading...</Text>
    if (error) return <Text>Error loading User</Text>
    if (!user || !user.reviews || !user.reviews.edges) {
        return <Text>No reviews found</Text>;
    }
    //console.log(user)

    return (
        <FlatList
            data={user.reviews.edges}
            renderItem={({ item }) => <ReviewItem
                review={item.node}
                navigate={navigate}
                repositoryName={item.node.repository.fullName}
                repositoryId={item.node.repository.id}
                handleDelete={handleDelete}
            />}
        //keyExtractor={({ item }) => item.node.id}
        //ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
        // ...
        />
    );
};

export default ReviewList