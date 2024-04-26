import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { PickOptions } from "./PickOptions";
import { TrackerAwayTeam } from "./TrackerAwayTeam";
import { GetTeamData, GetLiveData } from "../backend/functions";
import { useEffect, useState } from "react";

const TrackerGameStatus = (props) => {
  console.log("TRACKER GAME STATIS:", props.status);
  return <Text>{props.status}</Text>;
};

export { TrackerGameStatus };
