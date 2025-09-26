
import { StyleSheet, View } from 'react-native';
import RepositoryList from './RepositoryList';
import AppBar from './AppBar';
import { Route, Routes, Navigate } from 'react-router-native';
import SignIn from './SignIn';
import SignOut from './SignOut';
import SingleRepository from './SingleRepository';
import AddReview from './ReviewForm';
import AddUser from './CreateUserForm';
import ReviewList from './ReviewList'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}> 
      <AppBar />
      <Routes>
        <Route path="/repositories" element={<RepositoryList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/signup" element={<AddUser />} />
        <Route path="/add-review" element={<AddReview />} />
        <Route path="/repositories/:id" element={<SingleRepository />} />
        <Route path="/reviews" element={<ReviewList />} />
        <Route path="*" element={<Navigate to="/repositories" replace />} />
      </Routes>
    </View>
  );
};

export default Main;