import { useQuery } from "@apollo/client";
import { ME } from "../graphql/queries";

const useUser = (includeReviews) => {
    const { data, error, loading, refetch } = useQuery(ME, {
        variables: { includeReviews },
        fetchPolicy: 'cache-and-network'
    });

    const user = data?.me || null;

    return {
        user,
        loading,
        error,
        refetch
    };
};

export default useUser