import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fakeOdds from "../odds.json";

function GetGames() {
  const curDate = new Date(Date.now()).toISOString().split("T")[0];
  return fetch(
    "https://statsapi.mlb.com/api/v1/schedule?sportId=1&hydrate=probablePitcher&startDate=" +
      curDate +
      "&endDate=" +
      curDate
  )
    .then((res) => {
      data = res.json();
      return data;
    })
    .then((data) => {
      return data.dates[0].games;
    });
}

function GetOdds() {
  let odds = {
    0: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    1: {
      homeML: "+160",
      awayML: "-200",
      homeSpread: "-110",
      awaySpread: "-110",
      total: "9",
      over: "-110",
      under: "-110",
    },
    2: {
      homeML: "-112",
      awayML: "-110",
      homeSpread: "+190",
      awaySpread: "-200",
      total: "9",
      over: "-110",
      under: "-110",
    },
    3: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    4: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    5: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    6: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    7: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    8: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    9: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    10: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    11: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    12: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    13: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    14: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    15: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    16: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    17: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    18: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
  };
  return odds;
}

function GetPitcherStats(playerID) {
  if (playerID) {
    return fetch(
      "https://statsapi.mlb.com/api/v1/people?personIds=" +
        playerID.toString() +
        "&hydrate=stats(group=[pitching],type=season,season=2024)"
    ).then((res) => {
      data = res.json();
      return data;
    });
  } else {
    return {};
  }
}

function GetTeamData(teamID) {
  if (teamID) {
    return fetch(
      "https://statsapi.mlb.com/api/v1/teams/" + teamID.toString()
    ).then((res) => {
      data = res.json();
      return data;
    });
  } else {
    return {};
  }
}

const StoreData = async () => {
  try {
    // Call to bets API to get value
    const jsonValue = JSON.stringify(fakeOdds);
    const curDate = new Date(Date.now()).toISOString().split("T")[0];
    console.log("StoreData curDate", curDate);
    // Store json object response as "current data":"betting odds object"
    await AsyncStorage.setItem("placeholderDate1", jsonValue);
  } catch (e) {
    // saving error
  }
};

const GetData = async () => {
  try {
    // Get current date object in YYYY-MM-DD format
    const curDate = new Date(Date.now()).toISOString().split("T")[0];
    console.log("GetData curDate", curDate);
    // Use current date's key to get the associated odds if they've already been stored, else return null
    const jsonValue = await AsyncStorage.getItem("placeholderDate1");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export { GetGames, GetOdds, GetPitcherStats, GetTeamData, StoreData, GetData };
