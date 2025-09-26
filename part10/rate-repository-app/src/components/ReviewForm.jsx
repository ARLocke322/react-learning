import { View, TextInput, Pressable, StyleSheet } from "react-native";
import Text from "./Text";
import { useFormik } from "formik";
import * as yup from 'yup';
import useSignIn from "../hooks/useSignIn";
import { useNavigate } from "react-router-native";
import useCreateReview from "../hooks/useCreateReview";


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
  ownerName: yup
    .string()
    .min(3, 'Username must be >= 3 characters')
    .required('Username is required'),
  repositoryName: yup
    .string()
    .min(3, 'Repository name must be >= 3 characters')
    .required('Repository name is required'),
  rating: yup
    .number()
    .min(0, 'Rating must be >= 0') 
    .max(100, 'Rating must be <= 100') 
    .required('Rating is required'),
  text: yup
    .string()
});


const initialValues = {
    ownerName: '',
    repositoryName: '',
    rating: 0,
    text: ''
};

const ReviewForm = ({ onSubmit }) => {
    const formik = useFormik({
        onSubmit,
        validationSchema,
        initialValues
    });

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Add Review</Text>

                <TextInput
                    style={[
                        styles.input,
                        formik.touched.ownerName && formik.errors.ownerName && styles.inputError
                    ]}
                    placeholder="Owner"
                    value={formik.values.ownerName}
                    onChangeText={formik.handleChange('ownerName')}
                    onBlur={formik.handleBlur('ownerName')}
                />
                {formik.touched.ownerName && formik.errors.ownerName && (
                    <Text style={styles.errorText}>{formik.errors.ownerName}</Text>
                )}

                <TextInput
                    style={[
                        styles.input,
                        formik.touched.repositoryName && formik.errors.repositoryName && styles.inputError
                    ]}
                    placeholder="Repository Name"
                    value={formik.values.repositoryName}
                    onChangeText={formik.handleChange('repositoryName')}
                    onBlur={formik.handleBlur('repositoryName')}
                //secureTextEntry={true}
                />
                {formik.touched.repositoryName && formik.errors.repositoryName && (
                    <Text style={styles.errorText}>{formik.errors.repositoryName}</Text>
                )}

                <TextInput
                    style={[
                        styles.input,
                        formik.touched.rating && formik.errors.rating && styles.inputError
                    ]}
                    placeholder="Rating"
                    value={formik.values.rating}
                    onChangeText={formik.handleChange('rating')}
                    onBlur={formik.handleBlur('rating')}
                //secureTextEntry={true}
                />
                {formik.touched.rating && formik.errors.rating && (
                    <Text style={styles.errorText}>{formik.errors.rating}</Text>
                )}

                <TextInput
                    style={[
                        styles.input,
                        formik.touched.text && formik.errors.text && styles.inputError
                    ]}
                    placeholder="Text"
                    value={formik.values.text}
                    onChangeText={formik.handleChange('text')}
                    onBlur={formik.handleBlur('text')}
                //secureTextEntry={true}
                />
                {formik.touched.text && formik.errors.text && (
                    <Text style={styles.errorText}>{formik.errors.text}</Text>
                )}

                <Pressable style={styles.button} onPress={formik.handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    );
};

export const AddReviewContainer = ({ submit }) => {

    return <ReviewForm onSubmit={submit} />;
}

const AddReview = () => {
    const [createReview, result] = useCreateReview()
    const navigate = useNavigate()

    const submit = async (values) => {
        
        const { ownerName, repositoryName, rating, text } = values;
        try {
            const { data } = await createReview({ ownerName, rating: parseInt(rating), repositoryName, text });
            if (data) {
                navigate(`/repositories/${data.createReview.repository.id}`)
            }
        } catch (e) {
            console.log(e);
        }

    };

    return <AddReviewContainer submit={submit} />;
};

export default AddReview;