import { View, TextInput, Pressable, StyleSheet } from "react-native";
import Text from "./Text";
import { useFormik } from "formik";
import * as yup from 'yup';
import { useNavigate } from "react-router-native";
import useCreateUser from "../hooks/useCreateUser";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    card: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, // Fixed: was "repositoryName: 2"
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 15,
        marginBottom: 5,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF5F5',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginBottom: 15,
        marginLeft: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(5, 'Username must be >= 5 characters')
    .max(30, 'Username must be <= 30 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be >= 5 characters')
    .max(50, 'Password must be <= 50 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null])
    .required('Password confirm is required')
});


const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
};

const UserForm = ({ onSubmit }) => {
    const formik = useFormik({
        onSubmit,
        validationSchema,
        initialValues
    });

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Add User</Text>

                <TextInput
                    style={[
                        styles.input,
                        formik.touched.username && formik.errors.username && styles.inputError
                    ]}
                    placeholder="Username"
                    value={formik.values.username}
                    onChangeText={formik.handleChange('username')}
                    onBlur={formik.handleBlur('username')}
                />
                {formik.touched.username && formik.errors.username && (
                    <Text style={styles.errorText}>{formik.errors.username}</Text>
                )}

                <TextInput
                    style={[
                        styles.input,
                        formik.touched.password && formik.errors.password && styles.inputError
                    ]}
                    placeholder="Password"
                    value={formik.values.password}
                    onChangeText={formik.handleChange('password')}
                    onBlur={formik.handleBlur('password')}
                //secureTextEntry={true}
                />
                {formik.touched.password && formik.errors.password && (
                    <Text style={styles.errorText}>{formik.errors.password}</Text>
                )}

                <TextInput
                    style={[
                        styles.input,
                        formik.touched.confirmPassword && formik.errors.confirmPassword && styles.inputError
                    ]}
                    placeholder="Confirm password"
                    value={formik.values.confirmPassword}
                    onChangeText={formik.handleChange('confirmPassword')}
                    onBlur={formik.handleBlur('confirmPassword')}
                //secureTextEntry={true}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
                )}

                <Pressable style={styles.button} onPress={formik.handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    );
};

export const AddUserContainer = ({ submit }) => {

    return <UserForm onSubmit={submit} />;
}

const AddUser = () => {
    const [createUser, result] = useCreateUser()
    const navigate = useNavigate()

    const submit = async (values) => {
        
        const { username, password, confirmPassword } = values;
        try {
            const { data } = await createUser(username, password);
            console.log(data)
            if (data) {
                navigate(`/signin`)
            }
        } catch (e) {
            console.log(e);
        }

    };

    return <AddUserContainer submit={submit} />;
};

export default AddUser;