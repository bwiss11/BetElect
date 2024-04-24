import { useEffect, useState } from "react";
import { Text, StyleSheet, View, ActivityIndicatorBase } from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 50 }}>
          <Avatar.Image
            source={{
              uri: "https://as2.ftcdn.net/v2/jpg/00/75/13/25/1000_F_75132523_xkLZqbPQkUvVzWSftTf3nAGBjBFkcKuP.jpg",
            }}
            size={100}
          />
          <View style={{ marginLeft: 20 }}>
            <Title style={[styles.title, styles.text, { marginTop: 15 }]}>
              FirstName LastName
            </Title>
            <Caption style={[styles.caption, styles.text]}>@username</Caption>
          </View>
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
              <View style={styles.groupAvatars}>
                <Avatar.Image
                  source={{
                    uri: "https://as2.ftcdn.net/v2/jpg/00/75/13/25/1000_F_75132523_xkLZqbPQkUvVzWSftTf3nAGBjBFkcKuP.jpg",
                  }}
                  size={70}
                />
                <Text style={styles.text}>FirstName</Text>
              </View>
              <View style={styles.groupAvatars}>
                <Avatar.Image
                  source={{
                    uri: "https://i.fbcd.co/products/resized/resized-750-500/l010e-6-e08-mainpreview-1543b1db1c818443c5135ba0c3dd8f3cdb03ffd96d1177c659d823cdb2d7477d.webp",
                  }}
                  size={70}
                />
                <Text style={styles.text}>Name1</Text>
              </View>
              <View style={styles.groupAvatars}>
                <Avatar.Image
                  source={{
                    uri: "https://cdn.vectorstock.com/i/1000x1000/01/77/woman-face-portrait-generic-app-profile-picture-vector-42000177.webp",
                  }}
                  size={70}
                />
                <Text style={[styles.text]}>Name2</Text>
              </View>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.text, { marginTop: 30, fontWeight: "bold" }]}>
              Bankroll: $1000
            </Text>
            <Text style={[styles.text, { marginTop: 10 }]}>Unit Size: $10</Text>
            <Text style={[styles.text, { marginTop: 10 }]}>
              Tier 1 Agreement: 1 Unit
            </Text>
            <Text style={[styles.text, { marginTop: 10 }]}>
              Tier 2 Agreement: 1.5 Units
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
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
});
