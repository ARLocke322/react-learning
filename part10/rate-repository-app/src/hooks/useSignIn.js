import { useApolloClient, useMutation } from "@apollo/client"
import { AUTHENTICATE } from "../graphql/mutations"
import useAuthStorage from '../hooks/useAuthStorage';
const useSignIn = () => {
    const authStorage = useAuthStorage();
    const apolloClient = useApolloClient()
    const [mutate, result] = useMutation(AUTHENTICATE)

    const signIn = async ({ username, password }) => {
        const response = await mutate({
            variables: { username, password }
        });
        if (response.data) {
            await authStorage.setAccessToken(response.data.authenticate.accessToken)
            await apolloClient.resetStore()
        }
        
        
        return response;
    }

    return [signIn, result]
}

export default useSignIn