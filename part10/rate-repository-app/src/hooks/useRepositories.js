import { useQuery } from '@apollo/client';
import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = (order, searchKeyword = "", first = 4) => {
    const variables = {
        orderBy: order[0],
        orderDirection: order[1],
        searchKeyword: searchKeyword,
        first: first
    }


    const { data, error, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
        variables,
        fetchPolicy: 'cache-and-network'
    });

    const handleFetchMore = () => {
        const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;

        if (!canFetchMore) {
            return;
        }

        fetchMore({
            variables: {
                after: data.repositories.pageInfo.endCursor,
                ...variables,
            },
        });
    };

    return {
        repositories: data?.repositories,
        fetchMore: handleFetchMore,
        loading,
        error,
        ...result,
    };
};

export default useRepositories;
