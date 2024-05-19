import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SoloPicks from "../screens/SoloPicks";
import GroupPicks from "../screens/GroupPicks";
import Stats from "../screens/Stats";
import ProfilePage from "../screens/ProfilePage";
import Tracker from "../screens/Tracker";
import { FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  tabBarActiveTintColor: "rgb(150, 150, 255, 100)",
  tabBarInactiveTintColor: "white",
  headerStyle: {
    backgroundColor: "black",
  },
  headerTitleStyle: {
    color: "white",
  },
  right: 10,
  height: 900,
  tabBarStyle: {
    backgroundColor: "black",
    color: "white",
  },
};
const Tabs = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Solo"
        component={SoloPicks}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <FontAwesome6
                  name="person"
                  size={24}
                  color={focused ? "white" : "grey"}
                />
                <Text
                  style={
                    focused
                      ? {
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "white",
                        }
                      : {
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "grey",
                        }
                  }
                >
                  Solo
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Group"
        component={GroupPicks}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <FontAwesome6
                  name="handshake"
                  size={24}
                  color={focused ? "white" : "grey"}
                />
                <Text
                  style={
                    focused
                      ? {
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "white",
                        }
                      : {
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "grey",
                        }
                  }
                >
                  Group
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Tracker"
        component={Tracker}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <MaterialCommunityIcons
                  name="scoreboard"
                  size={24}
                  color={focused ? "white" : "grey"}
                />
                <Text
                  style={
                    focused
                      ? {
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "white",
                        }
                      : {
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "grey",
                        }
                  }
                >
                  Tracker
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Entypo
                  name="bar-graph"
                  size={24}
                  color={focused ? "white" : "grey"}
                />
                <Text
                  style={
                    focused
                      ? {
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "white",
                        }
                      : {
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "grey",
                        }
                  }
                >
                  Stats
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Octicons
                  name="feed-person"
                  size={24}
                  color={focused ? "white" : "grey"}
                  tintColor="red"
                />
                <Text
                  style={
                    focused
                      ? {
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "white",
                        }
                      : {
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "grey",
                        }
                  }
                >
                  Profile
                </Text>
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export { Tabs };
