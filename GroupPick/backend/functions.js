import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function GetGames() {
  const curDate = GetFormattedDate();
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
  // If this function is called, it means there is no data for today's games in local storage, so local storage can be cleared
  await AsyncStorage.clear();
  console.log("\n\n\nCALLING API\n\n\n\n");
  const response = await fetch(
    "https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=a1a8c66ce88c82f5342af641c0ecd4a8&regions=us&markets=h2h,spreads,totals&oddsFormat=american"
  );
  // await clearAll();
  const data = await response.json();
  try {
    const jsonValue = JSON.stringify(data);
    const curDate = GetFormattedDate();
    // Store json object response as "current data":"betting odds object"
    await AsyncStorage.setItem(curDate, jsonValue).then(() => {
      //   console.log("placed data");
    });
  } catch (e) {
    // saving error
  }
};

const GetData = async () => {
  try {
    // Get current date object in YYYY-MM-DD format
    const curDate = GetFormattedDate();
    // Use current date's key to get the associated odds if they've already been stored, else return null
    const jsonValue = await AsyncStorage.getItem(curDate);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }

  console.log("Done clearing local storage.");
};

const OddsMaker = async (data) => {
  console.log("\n\n\nCALLING ODDSMAKER\n\n\n\n");
  if (!data) {
    console.log("returning null");
    return null;
  }

  const fullOdds = await GetData();

  object = {};
  if (data) {
    for (let i = 0; i < data.length; i++) {
      //   console.log("data", data[i]);
      object[i] = {
        awayMLOdds: "",
        homeMLOdds: "",
        awaySpread: "",
        homeSpread: "",
        awaySpreadOdds: "",
        homeSpreadOdds: "",
        total: "",
        overOdds: "",
        underOdds: "",
      };
      awayTeam = data[i].teams.away.team.name;
      homeTeam = data[i].teams.home.team.name;
      gameDate = data[i].gameDate;
      if (fullOdds) {
        for (let j = 0; j < fullOdds.length; j++) {
          // console.log("cur object", fullOdds[j]);
          // console.log(fullOdds[j].commence_time.split("T")[0]);
          let awayMLOdds;
          let homeMLOdds;
          let awaySpread;
          let homeSpread;
          let awaySpreadOdds;
          let homeSpreadOdds;
          let total;
          let overOdds;
          let underOdds;

          if (
            fullOdds[j].away_team == awayTeam &&
            fullOdds[j].home_team == homeTeam &&
            gameDate == fullOdds[j].commence_time
          ) {
            for (let k = 0; k < fullOdds[j].bookmakers[0].markets.length; k++) {
              marketName = fullOdds[j].bookmakers[0].markets[k].key;

              if (marketName == "h2h") {
                // Assigning money line odds to variables

                if (
                  awayTeam ==
                  fullOdds[j].bookmakers[0].markets[k].outcomes[0].name
                ) {
                  awayMLOdds =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[0].price;
                  homeMLOdds =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[1].price;
                } else if (
                  homeTeam ==
                  fullOdds[j].bookmakers[0].markets[k].outcomes[0].name
                ) {
                  awayMLOdds =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[1].price;
                  homeMLOdds =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[0].price;
                }
              } else if (marketName == "spreads") {
                // Assigning spreads and spread odds to variables

                if (
                  awayTeam ==
                  fullOdds[j].bookmakers[0].markets[k].outcomes[0].name
                ) {
                  awaySpreadOdds =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[0].price;
                  awaySpread =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[0].point;
                  homeSpreadOdds =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[1].price;
                  homeSpread =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[1].point;
                } else if (
                  homeTeam ==
                  fullOdds[j].bookmakers[0].markets[k].outcomes[0].name
                ) {
                  awaySpreadOdds =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[1].price;
                  awaySpread =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[1].point;
                  homeSpreadOdds =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[0].price;
                  homeSpread =
                    fullOdds[j].bookmakers[0].markets[k].outcomes[0].point;
                }
              } else if (marketName == "totals") {
                // Assigning totals and over/under odds to variables
                total = fullOdds[j].bookmakers[0].markets[k].outcomes[0].point;
                overOdds =
                  fullOdds[j].bookmakers[0].markets[k].outcomes[0].price;
                underOdds =
                  fullOdds[j].bookmakers[0].markets[k].outcomes[1].price;
              }
            }

            object[i].awayMLOdds = awayMLOdds;
            object[i].homeMLOdds = homeMLOdds;
            object[i].awaySpread = awaySpread;
            object[i].homeSpread = homeSpread;
            object[i].awaySpreadOdds = awaySpreadOdds;
            object[i].homeSpreadOdds = homeSpreadOdds;
            object[i].total = total;
            object[i].overOdds = overOdds;
            object[i].underOdds = underOdds;
          }
        }
      }
    }
  }
  //   console.log(object);
  //   console.log(object[1]);

  if (object != {}) {
    return object;
  } else {
    return null;
  }
};

const GetFormattedDate = () => {
  t = new Date(Date.now());
  z = t.getTimezoneOffset() * 60 * 1000;
  tLocal = t - z;
  tLocal = new Date(tLocal);
  iso = tLocal.toISOString().split("T")[0];
  return iso;
};

const UpdateLocalPicks = async (index, pick, picksCopy) => {
  try {
    // Records user picks to local storage
    const jsonValue = JSON.parse(await AsyncStorage.getItem("picks"));
    if (!jsonValue) {
      picksCopy[index] = pick;
      await AsyncStorage.setItem("picks", JSON.stringify(picksCopy));
    } else {
      jsonValue[index] = pick;
      await AsyncStorage.setItem("picks", JSON.stringify(jsonValue));
    }
  } catch (e) {
    // error reading value
  }
};

const GetLocalPicks = async () => {
  // Records user picks to local storage
  ans = await AsyncStorage.getItem("picks").then((res) => {
    if (res) {
      return JSON.parse(res);
    } else {
      return null;
    }
  });
  return ans;
};

export {
  GetGames,
  GetOdds,
  GetPitcherStats,
  GetTeamData,
  StoreData,
  GetData,
  clearAll,
  OddsMaker,
  GetFormattedDate,
  UpdateLocalPicks,
  GetLocalPicks,
};
