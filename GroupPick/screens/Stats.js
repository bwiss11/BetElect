import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Button,
  ScrollView,
} from "react-native";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const Stats = () => {
  const [user, setUser] = useState(null); // Track user authentication state
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);
  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log("User logged out!");
        await signOut(auth);
        navigation.navigate("Login");
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log("User signed in, navigating to tabs");
          navigation.navigate("Tabs");
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log("trying to sign up");
          console.log("User created!");
        }
      }
    } catch (error) {
      // console.log("Erroemail and password", email, password);
      console.error("Authentication error:", error.message);
    }
    console.log("returning with user as", user);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stats Page Placeholder</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});

export default Stats;
