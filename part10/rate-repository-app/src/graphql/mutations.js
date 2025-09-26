import { gql } from '@apollo/client';

export const AUTHENTICATE = gql`
    mutation authenticate($username: String!, $password: String!) {
        authenticate(credentials: { username: $username, password: $password }) {
            accessToken
        }
    }
`;

export const CREATE_REVIEW = gql`
    mutation($review: CreateReviewInput) {
        createReview(review: $review) {
            repository {
                id
            }
        }
    } 
`;

export const CREATE_USER = gql`
    mutation CreateUser($username: String!, $password: String!) {
        createUser(user: { username: $username, password: $password }) {
        username
        }
    }
`;

export const DELETE_REVIEW = gql`
    mutation ($deleteReviewId: ID!) {
        deleteReview(id: $deleteReviewId) 
    }
`