import { View, TextInput, Pressable, StyleSheet } from "react-native";
import Text from "./Text";
import { useFormik } from "formik";
import * as yup from 'yup';
import useSignIn from "../hooks/useSignIn";
import { useNavigate } from "react-router-native";

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .min(3, 'Username must be >= 3 characters')
        .required('Username is required'),
    password: yup
        .string()
        .min(3, 'Password must be >= 3 characters')
        .required('Password is required'),
});

const initialValues = {
    username: '',
    password: '',
};

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
        shadowOffset: { width: 0, height: 2 }, // Fixed: was "password: 2"
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
const SignInForm = ({ onSubmit }) => {
    const formik = useFormik({
        onSubmit,
        validationSchema,
        initialValues
    });

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Sign In</Text>

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

                <Pressable style={styles.button} onPress={formik.handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    );
};

export const SignInContainer = ({submit}) => {

    return <SignInForm onSubmit={submit} />;
}

const SignIn = () => {
    const [signIn, result] = useSignIn()
    const navigate = useNavigate()
    const submit = async (values) => {
        const { username, password } = values;

        try {
            const { data } = await signIn({ username, password });

            if (data) {
                navigate("/repositories")
            }
        } catch (e) {
            console.log(e);
        }
    };



    return <SignInContainer submit={submit} />;
};

export default SignIn;