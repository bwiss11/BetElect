import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { React, useState } from "react";
import { signUp } from "../backend/firestore";

const Login = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  return (
    <KeyboardAvoidingView style={styles.outermostContainer}>
      <View style={styles.container}>
        <Text>hi</Text>
        <View>
          <Text style={styles.title}>Sign in to GroupPick</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput style={styles.emailInput} value={form.email}></TextInput>
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.passwordInput}
              value={form.email}
            ></TextInput>
          </View>
        </View>
        <Pressable
          style={styles.bypass}
          onPress={() => navigation.navigate("Tabs")}
        >
          <Text style={styles.buttonText}>Bypass Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
    // backgroundColor: "green",
  },
  input: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  inputLabel: { fontSize: 17, fontWeight: "600", color: "white" },
  emailInput: {
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 15,
    fontWeight: "500",
    color: "black",
    marginTop: 5,
    marginBottom: 20,
    width: "70%",
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
