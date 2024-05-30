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
import { React, useState, useEffect } from "react";
import { signUp, signIn, createUserDoc } from "../backend/firestore";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { NavigationHelpersContext } from "@react-navigation/native";

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

const auth = getAuth();

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

      <View style={styles.buttonContainer}>
        <Button
          title={isLogin ? "Sign In" : "Sign Up"}
          onPress={() => handleAuthentication()}
          color="#3498db"
        />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Need an account? Sign Up"
            : "Already have an account? Sign In"}
        </Text>
        <Button
          title="Bypass Login"
          onPress={() => navigation.navigate("Tabs")}
        ></Button>
      </View>
    </View>
  );
};

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
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
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     const uid = user.uid;
  //     console.log("current user on Login page is", uid);
  //     // ...
  //     // handleAuthentication();
  //     // navigation.navigate("Tabs");
  //   } else {
  //     // User is signed out
  //     // ...
  //   }
  // });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    // console.log("on reload user is", user);
  }, []);

  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log("User logged out!");
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          signInWithEmailAndPassword(auth, email, password);
          console.log("User signed in, navigating to tabs");
          navigation.navigate("Tabs");
        } else {
          // Sign up
          res = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          ).then((data) => {
            console.log("uid", data.user.uid);
            console.log("User created!");
            createUserDoc(data.user.uid, email, firstName, lastName);
            navigation.navigate("Tabs");
          });
        }
      }
    } catch (error) {
      // console.log("Erroemail and password", email, password);
      console.error("Authentication error:", error.message);
    }
    console.log("returning with user as", user);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        // Show user's email if user is authenticated
        // <AuthenticatedScreen
        //   user={user}
        //   handleAuthentication={handleAuthentication}
        // />
        navigation.navigate("Tabs")
      ) : (
        // <AuthenticatedScreen
        //   user={user}
        //   handleAuthentication={handleAuthentication}
        // />
        // Show sign-in or sign-up form if user is not authenticated
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
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  outermostContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  container: { height: "100%", justifyContent: "center", alignItems: "center" },
  buttonText: {
    color: "white",
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 50,
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
  //   container: {
  //     flex: 1,
  //     width: "100%",
  //     backgroundColor: "black",
  //     alignItems: "center",
  //     paddingBottom: 100,
  //   },
});

// const Login = ({ navigation }) => {
//   return (
//     <View style={styles.outermostContainer}>
//       <Pressable onPress={() => navigation.navigate("Tabs")}>
//         <Text style={styles.buttonText}>Login Button</Text>
//       </Pressable>
//       <Pressable onPress={signUp()}>
//         <Text style={styles.buttonText}>Test Button</Text>
//       </Pressable>
//     </View>
//   );
// };
