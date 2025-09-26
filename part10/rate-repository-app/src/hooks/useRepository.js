import { useQuery } from '@apollo/client';
import { GET_REPOSITORY } from '../graphql/queries';
import { useParams } from 'react-router-native';

const useRepository = (first = 4) => {
    const { id } = useParams()

    const variables = {
        id,
        first
    }

    const { data, error, loading, refetch, fetchMore, ...result } = useQuery(GET_REPOSITORY, {
        variables,
        fetchPolicy: 'cache-and-network'
    });

    const handleFetchMore = () => {
        const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;

        if (!canFetchMore) {
            return;
        }

        fetchMore({
            variables: {
                after: data.repository.reviews.pageInfo.endCursor,
                ...variables,
            },
        });
    };



    return {
        repository: data?.repository,
        error,
        loading,
        refetch,
        fetchMore: handleFetchMore,
        ...result,
    };
};

export default useRepository;