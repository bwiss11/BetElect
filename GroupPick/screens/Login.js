import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import { React, useState, useEffect } from "react";
import { createUserDoc } from "../backend/firestore";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdTzGDjbAUQgy8NRhLdTSfSMbz21-sJu0",
  authDomain: "grouppick-74cf0.firebaseapp.com",
  projectId: "grouppick-74cf0",
  storageBucket: "grouppick-74cf0.appspot.com",
  messagingSenderId: "89195551212",
  appId: "1:89195551212:web:d9e338711c2baf3c0708c9",
  measurementId: "G-EXLBQ3SP17",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const AuthScreen = ({
  email,
  setEmail,
  password,
  setPassword,
  isLogin,
  setIsLogin,
  handleAuthentication,
  firstName,
  setFirstName,
  lastName,
  setLastName,
}) => {
  return (
    <View>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <MaterialCommunityIcons name="vote" size={40} color="white" />
          <View style={styles.name}>
            <Text style={styles.logoText}>BETELECT</Text>
            <Text style={[styles.text, styles.subText]}>
              Group Sports Betting
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.authContainer}>
        <Text style={styles.title}>{isLogin ? "Sign In" : "Sign Up"}</Text>
        {isLogin ? (
          <View>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
            />
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
            />
          </View>
        )}

        {isLogin ? (
          <Pressable style={styles.button} onPress={handleAuthentication}>
            <View>
              <Text style={[styles.text, styles.buttonText]}>SIGN IN</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable style={styles.button} onPress={handleAuthentication}>
            <View>
              <Text style={[styles.text, styles.buttonText]}>SIGN UP</Text>
            </View>
          </Pressable>
        )}

        <View style={styles.bottomContainer}>
          {isLogin ? (
            <View style={styles.signInUp}>
              <View>
                <Text style={styles.text}>Need an account? </Text>
              </View>
              <Pressable
                style={styles.toggleText}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={[styles.text, styles.clickableText]}>
                  {" "}
                  Sign Up
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.signInUp}>
              <View>
                <Text style={styles.text}>Already have an account? </Text>
              </View>
              <Pressable
                style={styles.toggleText}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={[styles.text, styles.clickableText]}>
                  {" "}
                  Sign In
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    // Change the logged in/logged out state of the user
    try {
      if (user) {
        // If user is already authenticated, log out
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Signs the user in
          try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (error) {
            // console.log("ERROR is", error);
            console.log("invalid credentials");
            setEmail("");
            setPassword("");
          }
        } else {
          // Signs the user up by creating them a new account in Firebase Auth
          res = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          ).then((data) => {
            createUserDoc(data.user.uid, email, firstName, lastName);
            navigation.navigate("Tabs");
          });
        }
      }
    } catch (error) {
      // Couldn't authenticate user
      console.error("Authentication error:", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {user ? (
        navigation.navigate("Tabs")
      ) : (
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  outermostContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    height: "100%",
    justifyContent: "center",
    backgroundColor: "black",
  },

  buttonText: {
    padding: 10,
    fontWeight: 700,
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    backgroundColor: "green",
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 40,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 5,
    marginBottom: 5,
    minWidth: 300,
  },
  inputLabel: { fontSize: 17, fontWeight: "600", color: "white" },
  emailInput: {
    backgroundColor: "grey",
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 15,
    fontWeight: "500",
    color: "black",
    marginTop: 5,
    marginBottom: 20,
    width: "100%",
    maxWidth: 500,
  },
  passwordInput: {
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 15,
    fontWeight: "500",
    color: "black",
    marginTop: 5,
    width: "70%",
    maxWidth: 500,
  },
  bypass: {
    marginTop: 30,
    alignSelf: "center",
  },
  toggleText: {
    color: "white",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  authContainer: {
    alignItems: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "rgb(60, 90, 190)",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 2,
    marginTop: 5,
    marginBottom: 5,
    minWidth: 300,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    height: 80,
  },
  logo: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgb(60, 90, 190)",
    height: "100%",
    width: 225,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
    marginBottom: 5,
  },
  logoText: {
    marginLeft: 10,
    color: "white",
    fontSize: 30,
  },
  text: {
    color: "white",
  },
  name: { justifyContent: "center", alignItems: "center" },
  subText: {
    fontSize: 12,
  },
  signInUp: {
    flex: 1,
    flexDirection: "row",
    marginTop: 3,
    maxHeight: 20,
  },
  clickableText: { fontWeight: 700 },
});
