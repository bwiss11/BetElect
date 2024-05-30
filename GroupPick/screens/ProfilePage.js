import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  ActivityIndicatorBase,
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import { getGroup, getUserInfo } from "../backend/firestore";
import MyGroupAvatar from "../components/MyGroupAvatar";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getUserFirestorePicks,
  getFirestoreData,
  logFirestoreData,
  getUserDoc,
  getUserPicksDoc,
  getGroupDataDoc,
  getFirestorePicks,
  getTranslatedFirestorePicks,
  getGroupPicksDoc,
  getTranslatedPicksDoc,
} from "../backend/firestore";

const ProfilePage = ({ navigation }) => {
  const [group, setGroup] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [picksDocID, setPicksDocID] = useState("");
  const [userID, setUserID] = useState("");
  const [groupID, setGroupID] = useState("");
  const [groupDataDocID, setGroupDataDocID] = useState("");
  const [groupPicksDocID, setGroupPicksDocID] = useState("");
  const [translatedPicksDocID, setTranslatedPicksDocID] = useState("");
  const [user, setUser] = useState(null); // Track user authentication state
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user && !picksDocID) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      getUserDoc(uid).then((res) => {
        console.log("res is", uid, res);
        setUserID(res[0]);
        if (res[1].groupId) {
          setGroupID(res[1].groupId);
        } else {
          setGroupID("none");
        }

        getUserPicksDoc(res[0]).then((res) => {
          setPicksDocID(res[0]);
        });
      });

      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log("user is now", user);
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
        // if (isLogin) {
        //   // Sign in
        //   await signInWithEmailAndPassword(auth, email, password);
        //   console.log("User signed in, navigating to tabs");
        //   navigation.navigate("Tabs");
        // } else {
        //   // Sign up
        //   await createUserWithEmailAndPassword(auth, email, password);
        //   console.log("trying to sign up");
        //   console.log("User created!");
        // }
      }
    } catch (error) {
      // console.log("Erroemail and password", email, password);
      console.error("Authentication error:", error.message);
    }
    console.log("returning with user as", user);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    console.log("groupID is", groupID);
    if (groupID && groupID != "none") {
      getGroup(groupID).then((res) => {
        setGroup(res);
      });
    } else if (groupID) {
      setGroup("none");
    }
  }, [groupID]);

  useEffect(() => {
    if (userID) {
      getUserInfo(userID).then((res) => {
        setUserInfo(res);
      });
    }
  }, [userID]);

  if (group && userInfo) {
    let imageSource = userInfo.picUrl;
    return (
      <View style={styles.container}>
        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: "row", marginTop: 50 }}>
            <Avatar.Image
              source={{
                uri: imageSource,
              }}
              size={100}
            />
            <View style={{ marginLeft: 20 }}>
              <Title style={[styles.title, styles.text, { marginTop: 15 }]}>
                {userInfo.firstName} {userInfo.lastName}
              </Title>
              <Caption style={[styles.caption, styles.text]}>
                {userInfo.email}
              </Caption>
            </View>
          </View>
          <View>
            <Button
              title="Logout"
              onPress={handleAuthentication}
              color="#e74c3c"
            />
          </View>
          <View style={styles.groupContainer}>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <View>
                <Title style={[styles.text]}>My Group</Title>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                }}
              >
                {group != "none"
                  ? group.members.map((member, index) => (
                      <View style={styles.groupAvatars} key={index}>
                        <MyGroupAvatar userId={member} />
                      </View>
                    ))
                  : "none"}
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={[styles.text, { marginTop: 30, fontWeight: "bold" }]}
              >
                Bankroll: ${group.bankroll}
              </Text>
              <Text style={[styles.text, { marginTop: 10 }]}>
                Unit Size: ${group.bankroll / 100}
              </Text>
              <Text style={[styles.text, { marginTop: 10 }]}>
                Tier 1 Agreement: {group.tier1Agreement} Votes (
                {group.tier1BetSize} Units)
              </Text>
              <Text style={[styles.text, { marginTop: 10 }]}>
                Tier 2 Agreement: {group.tier2Agreement} Votes (
                {group.tier2BetSize} Units)
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 16,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
  groupContainer: {
    padding: 20,
    marginTop: 100,
    borderRadius: 10,
  },
  groupAvatars: {
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
  },
  text: {
    color: "white",
  },
});
