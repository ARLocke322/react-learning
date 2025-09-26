import { useMutation } from "@apollo/client"
import { CREATE_USER } from "../graphql/mutations"


const useCreateUser = () => {
    const [mutate, result] = useMutation(CREATE_USER)

    const createUser = async (username, password) => {

        const response = await mutate({
            variables: { username, password }
        });
        
        return response;
    }

    return [createUser, result]
}

export default useCreateUser