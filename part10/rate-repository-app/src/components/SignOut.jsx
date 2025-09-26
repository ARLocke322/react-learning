import { Pressable, StyleSheet } from "react-native";
import { useNavigate } from "react-router-native";
import Text from "./Text";
import useAuthStorage from "../hooks/useAuthStorage";
import { useApolloClient } from "@apollo/client";

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FF3B30', // Red background for sign out
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        // Elevation for Android
        elevation: 3,
    },
    buttonPressed: {
        backgroundColor: '#D70015', // Darker red when pressed
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});

const SignOut = () => {
    const navigate = useNavigate()
    const authStorage = useAuthStorage();
    const apolloClient = useApolloClient();

    const signout = async () => {
        try {
            await authStorage.removeAccessToken();
            await apolloClient.resetStore();
            navigate("/signin");
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };



    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed
            ]}
            onPress={signout}
        >
            <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
    );
};

export default SignOut;