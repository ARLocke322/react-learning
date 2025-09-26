import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
    query ($orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, $searchKeyword: String, $first: Int, $after:String){
        repositories (orderBy:$orderBy, orderDirection:$orderDirection, searchKeyword:$searchKeyword, first:$first, after:$after) {
            edges {
                node {
                    id
                    fullName
                    description
                    language
                    forksCount
                    stargazersCount
                    ratingAverage
                    reviewCount
                    ownerAvatarUrl
                }
            }
            pageInfo {
                endCursor
                startCursor
                hasNextPage
            }
            totalCount
        }
    }
`;

export const GET_REPOSITORY = gql`
    query ($id: ID!, $first: Int, $after:String){
        repository(id: $id) {
            id
            fullName
            url
            description
            language
            stargazersCount
            forksCount
            ratingAverage
            reviewCount
            ownerAvatarUrl
            reviews (first:$first, after:$after) {
                edges {
                    node {
                        id
                        text
                        rating
                        createdAt
                        user {
                            id
                            username
                        }
                    }
                }
                pageInfo {
                    endCursor
                    startCursor
                    hasNextPage
                }
                totalCount
            }
        }   
    }
`;



export const ME = gql`
    query getCurrentUser($includeReviews: Boolean = false) {
        me {
            id
            username    
            reviews @include(if: $includeReviews) {
                edges {
                    node {
                        id
                        text
                        rating
                        createdAt
                        user {
                            id
                            username
                        }
                        repository {
                        fullName
                        id
                        }
                    }
                }
            }
        }
    }
`

// other queries...