import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { Avatar, Title, Caption } from "react-native-paper";
import { getGroup, getUserInfo } from "../backend/firestore";
import MyGroupAvatar from "../components/MyGroupAvatar";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getUserDoc,
  getUserPicksDoc,
  createGroup,
  joinGroup,
} from "../backend/firestore";

const ProfilePage = ({ navigation }) => {
  const [group, setGroup] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [picksDocID, setPicksDocID] = useState("");
  const [userID, setUserID] = useState("");
  const [groupID, setGroupID] = useState("");
  const [joinGroupID, setJoinGroupID] = useState("");
  const [bankroll, setBankroll] = useState("");
  const [user, setUser] = useState(null); // Track user authentication state
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user && !picksDocID) {
      // User is signed in and their picks document id has not yet been recorded
      // Gets user's picks document
      const uid = user.uid;
      getUserDoc(uid).then((res) => {
        if (res) {
          // Set state for UserID, groupID, and picksDocID
          setUserID(res[0]);
          if (res[1].groupID) {
            setGroupID(res[1].groupID);
          } else {
            setGroupID("none");
          }
          getUserPicksDoc(res[0]).then((res) => {
            setPicksDocID(res[0]);
          });
        }
      });
    } else {
      // User is signed out
    }
  });

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
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
    }
  };

  useEffect(() => {
    // Sets the group
    if (groupID && groupID != "none") {
      getGroup(groupID).then((res) => {
        setGroup(res);
      });
    } else if (groupID) {
      setGroup("none");
    }
  }, [groupID]);

  useEffect(() => {
    // Gets user info and sets associated state variable
    if (userID) {
      getUserInfo(userID).then((res) => {
        setUserInfo(res);
      });
    }
  }, [userID]);

  const handleJoinGroup = () => {
    // Adds a user to the group
    joinGroup(joinGroupID, userID).then((res) => {
      setGroupID(res);
    });
  };

  const handleCreateGroup = () => {
    // Creates a new group
    createGroup(userID, bankroll).then((res) => {
      setGroupID(res);
    });
  };

  if (group && userInfo) {
    let imageSource = userInfo.picUrl;
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 50,
                alignItems: "center",
              }}
            >
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
            <View style={styles.logoutButton}>
              <Pressable style={styles.button} onPress={handleAuthentication}>
                <View>
                  <Text style={[styles.text, styles.buttonText]}>LOGOUT</Text>
                </View>
              </Pressable>
            </View>
          </View>
          <View style={styles.groupContainer}>
            <View
              style={{
                alignItems: "center",
              }}
            >
              {group != "none" ? (
                <View>
                  <Title style={[styles.text]}>My Group</Title>
                </View>
              ) : (
                ""
              )}

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                }}
              >
                {group != "none" ? (
                  group.members.map((member, index) => (
                    <View style={styles.groupAvatars} key={index}>
                      <MyGroupAvatar userId={member} />
                    </View>
                  ))
                ) : (
                  <View style={styles.newGroup}>
                    <Text style={[styles.text, styles.titleText]}>
                      Join or Create a Group!
                    </Text>
                    <View style={[styles.buttonHolder, styles.createGroup]}>
                      <View>
                        <Text style={styles.text}>Create a Group</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        value={bankroll}
                        onChangeText={setBankroll}
                        placeholder="$ Bankroll"
                        autoCapitalize="none"
                      />
                      <Pressable
                        style={styles.button}
                        onPress={handleCreateGroup}
                      >
                        <View>
                          <Text style={[styles.text, styles.buttonText]}>
                            CREATE GROUP
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                    <View style={styles.buttonHolder}>
                      <View>
                        <Text style={styles.text}>Join a Group</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        value={joinGroupID}
                        onChangeText={setJoinGroupID}
                        placeholder="Group Password"
                        autoCapitalize="none"
                      />
                      <Pressable
                        style={styles.button}
                        onPress={handleJoinGroup}
                      >
                        <View>
                          <Text style={[styles.text, styles.buttonText]}>
                            JOIN GROUP
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </View>
            {group != "none" ? (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={[styles.text, { marginTop: 30, fontWeight: "bold" }]}
                >
                  Bankroll: ${group.bankroll}
                </Text>
                <Text style={[styles.text, { marginTop: 10 }]}>
                  Unit Size: ${group.unitSize}
                </Text>
                <Text style={[styles.text, { marginTop: 10 }]}>
                  Group Password: {group.password}
                </Text>
              </View>
            ) : (
              ""
            )}
          </View>
        </View>
      </ScrollView>
    );
  } else {
    return "";
  }
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    marginTop: 25,
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
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 40,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 10,
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
  buttonHolder: {
    width: "100%",
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 20,
  },
  newGroup: {
    alignItems: "center",
  },
  createGroup: {
    marginBottom: 50,
  },
  titleText: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgb(60, 90, 190)",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 2,
  },
  buttonText: {
    margin: 10,
  },
});
