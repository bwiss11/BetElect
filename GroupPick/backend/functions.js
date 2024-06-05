import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  logFirestorePicks,
  getFirestorePicks,
  getUserFirestorePicks,
  recordOdds,
  db,
} from "./firestore";
import teamIDMap from "../teamIDMap.json";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  addDoc,
} from "firebase/firestore";

// PICK UP HERE: write separate function to get games from firestore so games don't get reordered
// for things like postponements
function GetGames() {
  console.log("calling GetGames");
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
  // await AsyncStorage.clear();
  console.log("\n\n\nCALLING API in StoreData\n\n\n\n");
  // const response = await fetch(
  //   "https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=a1a8c66ce88c82f5342af641c0ecd4a8&regions=us&markets=h2h,spreads,totals&oddsFormat=american"
  // );
  const dummyRes = {
    0: {
      awayMLOdds: "123",
      homeMLOdds: "456",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    1: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    2: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    3: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    4: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    5: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    6: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    7: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    8: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    9: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    10: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    11: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    12: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    13: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
    14: {
      awayMLOdds: "",
      homeMLOdds: "",
      awaySpread: "",
      homeSpread: "",
      awaySpreadOdds: "",
    },
  };
  // console.log("response before json is", response);
  // const data = await response.json();
  // console.log("response after json is", data);

  console.log("dummy response", dummyRes);

  try {
    console.log("calling oddsmaker from store data", copiedData);
    await OddsMaker(copiedData);
    const jsonValue = JSON.stringify(data);
    const curDate = GetFormattedDate();
    // Store json object response as "current data":"betting odds object"
    // await AsyncStorage.setItem(curDate, jsonValue).then(() => {
    //   //   console.log("placed data");
    // });
  } catch (e) {
    // saving error
  }
};

const HandleOdds = async () => {
  const curDate = GetFormattedDate();
  const curHours = GetCurrentHours();
  // Check if odds are already in db
  const retrievedOdds = await GetFirestoreOdds(curDate, curHours);
  // If odds are already in db, return the odds
  if (retrievedOdds[1]) {
    console.log("returning odds without calling API");
    return retrievedOdds;
  } else {
    // If odds aren't in database, call to odds-api to get up-to-the-hour odds
    console.log("\n\n\nCALLING API in handleOdds\n\n\n\n");
    const response = await fetch(
      "https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=a1a8c66ce88c82f5342af641c0ecd4a8&regions=us&markets=h2h,spreads,totals&oddsFormat=american"
    );
    const oddsData = await response.json();
    console.log("oddsData in HandleOdds is", oddsData);

    // Use the data from the odds-api to create the odds
    gameData = await GetGames();
    oddsMakerOdds = await OddsMaker(gameData, oddsData);
    // Store the newly created odds in the database, and return the odds
    await recordOdds(curDate, curHours, oddsMakerOdds);
    const retrievedOdds = await GetFirestoreOdds(curDate, curHours);
    return retrievedOdds;
  }
};

// const GetData = async () => {
//   console.log("calling GetData");
//   try {
//     // Get current date object in YYYY-MM-DD format
//     const curDate = GetFormattedDate();
//     const curHours = GetCurrentHours();
//     // Use current date's key to get the associated odds if they've already been stored, else return null
//     // const jsonValue = await AsyncStorage.getItem(curDate);
//     const firestoreOdds = await GetFirestoreOdds(curDate, curHours);
//     if (firestoreOdds) {
//       console.log("firestore odds are", firestoreOdds[1][curDate]);
//       return firestoreOdds != null ? firestoreOdds[1][curDate] : null;
//     } else {
//       return null;
//     }
//   } catch (e) {
//     console.error(e);
//   }
// };

const GetFirestoreOdds = async (date, hours) => {
  //zzz
  oddsRef = collection(db, "odds");
  let ans;
  const querySnapshot = await getDocs(
    query(oddsRef, where("date", "==", date, limit(1)))
  );
  if (!querySnapshot.empty) {
    await querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ans = [doc.id, doc.data()];
    });

    if (ans[1].hours == hours) {
      // console.log("returning firestore odds", ans);
      return [ans, true];
    }
  }
  return [ans, false];
};

// const clearAll = async () => {
//   try {
//     await AsyncStorage.clear();
//   } catch (e) {
//     // clear error
//   }

//   console.log("Done clearing local storage.");
// };

const OddsMaker = async (data, fullOdds) => {
  console.log(
    "\n\n\nCALLING ODDSMAKER\n\n\n\n with data and fullOdds",
    data,
    fullOdds
  );
  if (!data) {
    console.log("returning null");
    return null;
  }

  try {
    // Get current date object in YYYY-MM-DD format
    const curDate = GetFormattedDate();
    const curHours = GetCurrentHours();

    const firestoreOdds = await GetFirestoreOdds(curDate, curHours);
    console.log("firestore oddds", firestoreOdds);
    if (firestoreOdds[1]) {
      console.log(
        "firestore odds are and returning",
        firestoreOdds[0][1][curDate]
      );
      return firestoreOdds ? firestoreOdds[0][1][curDate] : null;
    } else {
      console.log("creating odds template");
      object = {};
      if (data) {
        for (let i = 0; i < data.length; i++) {
          console.log("top level i is", i);
          let gameTime = new Date(data[i].gameDate);
          let theCurTime = new Date(Date.now());
          let difference = gameTime - theCurTime;
          console.log(
            "start time is",
            gameTime,
            " cur time is",
            theCurTime,
            "difference is",
            gameTime - theCurTime
          );
          if (i == 0 && firestoreOdds[0]) {
            console.log(
              "testing",
              firestoreOdds[0][1][curDate][i + 1],
              "testing2",
              firestoreOdds[0][1],
              curDate
            );
          }
          if (difference < 0 && firestoreOdds[0] && firestoreOdds[0][i]) {
            console.log("setting odds equal to", firestoreOdds[0][i]);
            object[i] = firestoreOdds[0][i];
            continue;
          }
          //   console.log("data", data[i]);
          object[i] = {
            startTime: "",
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
            let awayMLOdds;
            let homeMLOdds;
            let awaySpread;
            let homeSpread;
            let awaySpreadOdds;
            let homeSpreadOdds;
            let total;
            let overOdds;
            let underOdds;
            let foundBool = false;
            for (let j = 0; j < fullOdds.length; j++) {
              // console.log("cur object", fullOdds[j]);
              // console.log(fullOdds[j].commence_time.split("T")[0]);
              if (
                fullOdds[j].away_team == awayTeam &&
                fullOdds[j].home_team == homeTeam &&
                !foundBool
                // gameDate == fullOdds[j].commence_time
              ) {
                foundBool = true;
                for (
                  let k = 0;
                  k < fullOdds[j].bookmakers[0].markets.length;
                  k++
                ) {
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
                    total =
                      fullOdds[j].bookmakers[0].markets[k].outcomes[0].point;
                    overOdds =
                      fullOdds[j].bookmakers[0].markets[k].outcomes[0].price;
                    underOdds =
                      fullOdds[j].bookmakers[0].markets[k].outcomes[1].price;
                  }
                }
                object[i].startTime = data[i].gameDate;
                object[i].awayMLOdds = awayMLOdds != null ? awayMLOdds : "";
                object[i].homeMLOdds = homeMLOdds != null ? homeMLOdds : "";
                object[i].awaySpread = awaySpread != null ? awaySpread : "";
                object[i].homeSpread = homeSpread != null ? homeSpread : "";
                object[i].awaySpreadOdds =
                  awaySpreadOdds != null ? awaySpreadOdds : "";
                object[i].homeSpreadOdds =
                  homeSpreadOdds != null ? homeSpreadOdds : "";
                object[i].total = total != null ? total : "";
                object[i].overOdds = overOdds != null ? overOdds : "";
                object[i].underOdds = underOdds != null ? underOdds : "";
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
    }
  } catch (e) {
    console.error(e);
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

const GetCurrentHours = () => {
  t = new Date(Date.now());
  z = t.getTimezoneOffset() * 60 * 1000;
  tLocal = t - z;
  tLocal = new Date(tLocal);
  hours = tLocal.getHours();
  return hours;
};

const UpdateLocalPicks = async (
  index,
  pick,
  picksCopy,
  date,
  groupId,
  numberOfGames,
  userID,
  picksDocID
) => {
  try {
    // Records user picks to local storage
    const firestorePicks = await getUserFirestorePicks(date, userID);
    // const jsonValue = JSON.parse(await AsyncStorage.getItem("picks"));
    if (!firestorePicks) {
      // picksCopy[index] = pick;
      // await AsyncStorage.setItem("picks", JSON.stringify(picksCopy));
      let picksArray = [];
      for (let i = 0; i < numberOfGames; i++) {
        picksArray.push("");
      }
      picksArray[index] = pick;
      // PLACEHOLDER: userId hardcoded
      await logFirestorePicks(date, picksArray, userID, picksDocID);
    } else {
      firestorePicks[index] = pick;
      for (let i = 0; i < firestorePicks.length; i++) {
        if (!firestorePicks[i]) {
          firestorePicks[i] = "";
        }
      }
      // await AsyncStorage.setItem("picks", JSON.stringify(jsonValue));
      await logFirestorePicks(date, firestorePicks, userID, picksDocID);
    }
  } catch (e) {
    console.log(e);
    // error reading value
  }
};

const GetLocalPicks = async (date, groupId, groupPicksDocID) => {
  // Records user picks to local storage
  ans = await AsyncStorage.getItem("picks").then((res) => {
    if (res) {
      return JSON.parse(res);
    } else {
      return null;
    }
  });
  fireStoreAns = await getFirestorePicks(date, groupId, groupPicksDocID);
  if (fireStoreAns) {
    return fireStoreAns;
  } else {
    return null;
  }
};

const GetLocalOdds = async () => {
  // Records user picks to local storage
  ans = await AsyncStorage.getItem("odds").then((res) => {
    if (res) {
      return JSON.parse(res);
    } else {
      return null;
    }
  });
  return ans;
};

// const GetLocalGames = async () => {
//   const curDate = GetFormattedDate();
//   ans = await AsyncStorage.getItem(curDate);
//   if (ans) {
//     return JSON.parse(ans);
//   } else {
//     return null;
//   }
// };

const GetLiveData = async (MLBGamePk) => {
  return fetch(
    "https://statsapi.mlb.com/api/v1.1/game/" + MLBGamePk + "/feed/live"
  )
    .then((res) => {
      data = res.json();
      return data;
    })
    .then((data) => {
      // console.log("data in GLD is ", data);
      return {
        awayTeamRuns: data.liveData.linescore.teams.away.runs,
        homeTeamRuns: data.liveData.linescore.teams.home.runs,
        inning: data.liveData.linescore.currentInningOrdinal,
        inningHalf: data.liveData.linescore.inningHalf,
        status: data.gameData.status.abstractGameState,
        startTime:
          data.gameData.datetime.time + " " + data.gameData.datetime.ampm,
      };
    });
};

const TranslatePick = (
  pick,
  awayTeamID,
  awaySpread,
  awaySpreadOdds,
  awayML,
  homeTeamID,
  homeSpread,
  homeSpreadOdds,
  homeML,
  total,
  over,
  under
) => {
  let thisPick = ["", ""];

  if (!pick) {
    return thisPick;
  } else if (pick == "optOut") {
    thisPick[0] = "No Pick";
    return thisPick;
  }
  // Setting odds for the pick
  if (pick == "homeML") {
    thisPick[1] = homeML;
  } else if (pick == "awayML") {
    thisPick[1] = awayML;
  } else if (pick == "homeSpread") {
    thisPick[1] = homeSpreadOdds;
  } else if (pick == "awaySpread") {
    thisPick[1] = awaySpreadOdds;
  } else if (pick == "over") {
    thisPick[1] = over;
  } else if (pick == "under") {
    thisPick[1] = under;
  }

  // Translating pick to be team and spread specific
  if (pick.slice(0, 4) == "away") {
    if (pick.slice(4, 10) == "Spread") {
      if (Number(awaySpread) > 0) {
        thisPick[0] = teamIDMap[awayTeamID][2] + " +" + awaySpread;
      } else {
        thisPick[0] = teamIDMap[awayTeamID][2] + " " + awaySpread;
      }
    } else {
      thisPick[0] = teamIDMap[awayTeamID][2] + " ML";
    }
  } else if (pick.slice(0, 4) == "home") {
    if (pick.slice(4, 10) == "Spread") {
      if (Number(homeSpread) > 0) {
        thisPick[0] = teamIDMap[homeTeamID][2] + " +" + homeSpread;
      } else {
        thisPick[0] = teamIDMap[homeTeamID][2] + " " + homeSpread;
      }
    } else {
      thisPick[0] = teamIDMap[homeTeamID][2] + " ML";
    }
  } else if (pick.slice(0, 4) == "over") {
    thisPick[0] = "Over " + total;
  } else if (pick.slice(0, 5) == "under") {
    thisPick[0] = "Under " + total;
  }
  return thisPick;
};

export {
  GetGames,
  GetPitcherStats,
  GetTeamData,
  StoreData,
  GetFormattedDate,
  UpdateLocalPicks,
  GetLocalPicks,
  GetLocalOdds,
  GetLiveData,
  TranslatePick,
  GetCurrentHours,
  HandleOdds,
};

let dummyData = [
  {
    id: "e13b4b037a58ae5b3c28018a41c3da86",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T17:05:00Z",
    home_team: "Houston Astros",
    away_team: "Minnesota Twins",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -147,
              },
              {
                name: "Minnesota Twins",
                price: 135,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 137,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -157,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -106,
                point: 8,
              },
              {
                name: "Under",
                price: -114,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -147,
              },
              {
                name: "Minnesota Twins",
                price: 135,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 140,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -154,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: -103,
                point: 8,
              },
              {
                name: "Under",
                price: -112,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -154,
              },
              {
                name: "Minnesota Twins",
                price: 130,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 130,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -150,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8,
              },
              {
                name: "Under",
                price: -111,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -154,
              },
              {
                name: "Minnesota Twins",
                price: 130,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 134,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -162,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -106,
                point: 8,
              },
              {
                name: "Under",
                price: -114,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -150,
              },
              {
                name: "Minnesota Twins",
                price: 135,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 135,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -155,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8,
              },
              {
                name: "Under",
                price: -115,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -155,
              },
              {
                name: "Minnesota Twins",
                price: 130,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 140,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -165,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8,
              },
              {
                name: "Under",
                price: -110,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -158,
              },
              {
                name: "Minnesota Twins",
                price: 132,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 135,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -160,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8,
              },
              {
                name: "Under",
                price: -115,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -155,
              },
              {
                name: "Minnesota Twins",
                price: 130,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 136,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -162,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -108,
                point: 8,
              },
              {
                name: "Under",
                price: -112,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -145,
              },
              {
                name: "Minnesota Twins",
                price: 132,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 135,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -167,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -108,
                point: 8,
              },
              {
                name: "Under",
                price: -112,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -150,
              },
              {
                name: "Minnesota Twins",
                price: 125,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8,
              },
              {
                name: "Under",
                price: -110,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -148,
              },
              {
                name: "Minnesota Twins",
                price: 134,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 140,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -160,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8,
              },
              {
                name: "Under",
                price: -110,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: -148,
              },
              {
                name: "Minnesota Twins",
                price: 125,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Houston Astros",
                price: 140,
                point: -1.5,
              },
              {
                name: "Minnesota Twins",
                price: -175,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -118,
                point: 8,
              },
              {
                name: "Under",
                price: -103,
                point: 8,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "4956a119299c553ea3edb233ddffc603",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T17:35:00Z",
    home_team: "Atlanta Braves",
    away_team: "Oakland Athletics",
    bookmakers: [
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -245,
              },
              {
                name: "Oakland Athletics",
                price: 200,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -125,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 104,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -122,
                point: 8.5,
              },
              {
                name: "Under",
                price: 100,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -278,
              },
              {
                name: "Oakland Athletics",
                price: 225,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -127,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 104,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: 102,
                point: 9,
              },
              {
                name: "Under",
                price: -122,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -240,
              },
              {
                name: "Oakland Athletics",
                price: 217,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -125,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 102,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -122,
                point: 8.5,
              },
              {
                name: "Under",
                price: 101,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -244,
              },
              {
                name: "Oakland Athletics",
                price: 217,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -124,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 112,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: 103,
                point: 9,
              },
              {
                name: "Under",
                price: -118,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -244,
              },
              {
                name: "Oakland Athletics",
                price: 217,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -128,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 108,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 9,
              },
              {
                name: "Under",
                price: -120,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -250,
              },
              {
                name: "Oakland Athletics",
                price: 205,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -125,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 105,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 9,
              },
              {
                name: "Under",
                price: -120,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -250,
              },
              {
                name: "Oakland Athletics",
                price: 205,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -125,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 105,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -102,
                point: 9,
              },
              {
                name: "Under",
                price: -118,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -240,
              },
              {
                name: "Oakland Athletics",
                price: 210,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -130,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 110,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 9,
              },
              {
                name: "Under",
                price: -120,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -250,
              },
              {
                name: "Oakland Athletics",
                price: 205,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -130,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 110,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 8.5,
              },
              {
                name: "Under",
                price: 100,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -250,
              },
              {
                name: "Oakland Athletics",
                price: 207,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -125,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 105,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -119,
                point: 8.5,
              },
              {
                name: "Under",
                price: -103,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -250,
              },
              {
                name: "Oakland Athletics",
                price: 200,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -125,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 105,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 8.5,
              },
              {
                name: "Under",
                price: 100,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -245,
              },
              {
                name: "Oakland Athletics",
                price: 205,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Atlanta Braves",
                price: -120,
                point: -1.5,
              },
              {
                name: "Oakland Athletics",
                price: 100,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8.5,
              },
              {
                name: "Under",
                price: -105,
                point: 8.5,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "507836f6ff1eb8d12c366fc4b3c1b0fc",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T17:35:00Z",
    home_team: "Baltimore Orioles",
    away_team: "Tampa Bay Rays",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -125,
              },
              {
                name: "Tampa Bay Rays",
                price: 115,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 154,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -174,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -130,
              },
              {
                name: "Tampa Bay Rays",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 146,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -176,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 9,
              },
              {
                name: "Under",
                price: -105,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -125,
              },
              {
                name: "Tampa Bay Rays",
                price: 115,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 156,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -172,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: -118,
                point: 9,
              },
              {
                name: "Under",
                price: 103,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -130,
              },
              {
                name: "Tampa Bay Rays",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 150,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -180,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -122,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -125,
              },
              {
                name: "Tampa Bay Rays",
                price: 115,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 155,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -175,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 9,
              },
              {
                name: "Under",
                price: -105,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -130,
              },
              {
                name: "Tampa Bay Rays",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 148,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -175,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -136,
              },
              {
                name: "Tampa Bay Rays",
                price: 114,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 150,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -175,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 9,
              },
              {
                name: "Under",
                price: -105,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -130,
              },
              {
                name: "Tampa Bay Rays",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 150,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -180,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -130,
              },
              {
                name: "Tampa Bay Rays",
                price: 118,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 147,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -182,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -117,
                point: 9,
              },
              {
                name: "Under",
                price: -103,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -130,
              },
              {
                name: "Tampa Bay Rays",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 140,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -165,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -122,
              },
              {
                name: "Tampa Bay Rays",
                price: 112,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 160,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -180,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: -129,
              },
              {
                name: "Tampa Bay Rays",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Baltimore Orioles",
                price: 160,
                point: -1.5,
              },
              {
                name: "Tampa Bay Rays",
                price: -200,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -122,
                point: 9,
              },
              {
                name: "Under",
                price: 102,
                point: 9,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c9b1622dc9094359589fbaed62372c80",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T17:35:00Z",
    home_team: "Boston Red Sox",
    away_team: "Detroit Tigers",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -153,
              },
              {
                name: "Detroit Tigers",
                price: 140,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 130,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -150,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -123,
                point: 9,
              },
              {
                name: "Under",
                price: 103,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -156,
              },
              {
                name: "Detroit Tigers",
                price: 132,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 130,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -156,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 9,
              },
              {
                name: "Under",
                price: -105,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -153,
              },
              {
                name: "Detroit Tigers",
                price: 140,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 134,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -147,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: -121,
                point: 9,
              },
              {
                name: "Under",
                price: 106,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -156,
              },
              {
                name: "Detroit Tigers",
                price: 132,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 125,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -145,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -122,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -153,
              },
              {
                name: "Detroit Tigers",
                price: 138,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 130,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -150,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 9.5,
              },
              {
                name: "Under",
                price: -120,
                point: 9.5,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -160,
              },
              {
                name: "Detroit Tigers",
                price: 135,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 130,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -155,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 9,
              },
              {
                name: "Under",
                price: -105,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -161,
              },
              {
                name: "Detroit Tigers",
                price: 135,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 130,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -150,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: 105,
                point: 9.5,
              },
              {
                name: "Under",
                price: -125,
                point: 9.5,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -162,
              },
              {
                name: "Detroit Tigers",
                price: 136,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 130,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -155,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 9.5,
              },
              {
                name: "Under",
                price: -120,
                point: 9.5,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -150,
              },
              {
                name: "Detroit Tigers",
                price: 137,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 127,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -156,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -125,
                point: 9,
              },
              {
                name: "Under",
                price: 102,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -160,
              },
              {
                name: "Detroit Tigers",
                price: 135,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 125,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -150,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -150,
              },
              {
                name: "Detroit Tigers",
                price: 135,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 135,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -155,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: -159,
              },
              {
                name: "Detroit Tigers",
                price: 135,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Boston Red Sox",
                price: 130,
                point: -1.5,
              },
              {
                name: "Detroit Tigers",
                price: -157,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -122,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3a604ea4c467a7ef8019ec3d512b713a",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T17:37:00Z",
    home_team: "Toronto Blue Jays",
    away_team: "Pittsburgh Pirates",
    bookmakers: [
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 145,
              },
              {
                name: "Toronto Blue Jays",
                price: -175,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -150,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 123,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -104,
                point: 8.5,
              },
              {
                name: "Under",
                price: -118,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 144,
              },
              {
                name: "Toronto Blue Jays",
                price: -172,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -146,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 122,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -114,
                point: 8,
              },
              {
                name: "Under",
                price: -106,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 143,
              },
              {
                name: "Toronto Blue Jays",
                price: -158,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -147,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 120,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 154,
              },
              {
                name: "Toronto Blue Jays",
                price: -168,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -137,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 124,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: -107,
                point: 8,
              },
              {
                name: "Under",
                price: -107,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 154,
              },
              {
                name: "Toronto Blue Jays",
                price: -168,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -140,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 120,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8,
              },
              {
                name: "Under",
                price: -110,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 143,
              },
              {
                name: "Toronto Blue Jays",
                price: -170,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -145,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 122,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 145,
              },
              {
                name: "Toronto Blue Jays",
                price: -175,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -142,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 120,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -112,
                point: 8,
              },
              {
                name: "Under",
                price: -108,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 150,
              },
              {
                name: "Toronto Blue Jays",
                price: -165,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -145,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 125,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 8,
              },
              {
                name: "Under",
                price: 100,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 147,
              },
              {
                name: "Toronto Blue Jays",
                price: -179,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -145,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 125,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 148,
              },
              {
                name: "Toronto Blue Jays",
                price: -175,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -140,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 120,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -106,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 145,
              },
              {
                name: "Toronto Blue Jays",
                price: -175,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -135,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 110,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: 150,
              },
              {
                name: "Toronto Blue Jays",
                price: -170,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Pittsburgh Pirates",
                price: -140,
                point: 1.5,
              },
              {
                name: "Toronto Blue Jays",
                price: 120,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "e0c63f05b64bce9f70c5a6ba208f18c4",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T17:40:00Z",
    home_team: "New York Mets",
    away_team: "Arizona Diamondbacks",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -102,
              },
              {
                name: "New York Mets",
                price: -108,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 156,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -176,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -110,
              },
              {
                name: "New York Mets",
                price: -106,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 150,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -180,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -106,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -102,
              },
              {
                name: "New York Mets",
                price: -108,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 158,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -174,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: -113,
                point: 8,
              },
              {
                name: "Under",
                price: -102,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -110,
              },
              {
                name: "New York Mets",
                price: -106,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 146,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -176,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -114,
                point: 8,
              },
              {
                name: "Under",
                price: -106,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -105,
              },
              {
                name: "New York Mets",
                price: -105,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 155,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -175,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -110,
              },
              {
                name: "New York Mets",
                price: -110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 150,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -178,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -111,
              },
              {
                name: "New York Mets",
                price: -109,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -230,
                point: 1.5,
              },
              {
                name: "New York Mets",
                price: 190,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8,
              },
              {
                name: "Under",
                price: -110,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -110,
              },
              {
                name: "New York Mets",
                price: -110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 150,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -180,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -112,
                point: 8,
              },
              {
                name: "Under",
                price: -108,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -110,
              },
              {
                name: "New York Mets",
                price: 100,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 147,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -182,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -112,
                point: 8,
              },
              {
                name: "Under",
                price: -108,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -108,
              },
              {
                name: "New York Mets",
                price: -102,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 150,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -170,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -115,
              },
              {
                name: "New York Mets",
                price: -105,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 145,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -175,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: -114,
              },
              {
                name: "New York Mets",
                price: -103,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Arizona Diamondbacks",
                price: 145,
                point: -1.5,
              },
              {
                name: "New York Mets",
                price: -177,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -118,
                point: 8,
              },
              {
                name: "Under",
                price: -104,
                point: 8,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "f16eef9f9d6079885e6288f567131abd",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T17:40:00Z",
    home_team: "Cleveland Guardians",
    away_team: "Washington Nationals",
    bookmakers: [
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -148,
              },
              {
                name: "Washington Nationals",
                price: 125,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 143,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -177,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -109,
                point: 8,
              },
              {
                name: "Under",
                price: -112,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -138,
              },
              {
                name: "Washington Nationals",
                price: 118,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 150,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -182,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -145,
              },
              {
                name: "Washington Nationals",
                price: 132,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 142,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -175,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8,
              },
              {
                name: "Under",
                price: -110,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -135,
              },
              {
                name: "Washington Nationals",
                price: 124,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 148,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -163,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: -108,
                point: 8,
              },
              {
                name: "Under",
                price: -106,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -135,
              },
              {
                name: "Washington Nationals",
                price: 124,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 145,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -165,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -111,
                point: 8,
              },
              {
                name: "Under",
                price: -109,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -140,
              },
              {
                name: "Washington Nationals",
                price: 118,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 143,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -170,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8,
              },
              {
                name: "Under",
                price: -110,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -142,
              },
              {
                name: "Washington Nationals",
                price: 120,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 142,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -170,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -112,
                point: 8,
              },
              {
                name: "Under",
                price: -108,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -132,
              },
              {
                name: "Washington Nationals",
                price: 122,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 150,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -170,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8,
              },
              {
                name: "Under",
                price: -115,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -138,
              },
              {
                name: "Washington Nationals",
                price: 115,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 150,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -175,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 8,
              },
              {
                name: "Under",
                price: 100,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -145,
              },
              {
                name: "Washington Nationals",
                price: 123,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 140,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -160,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -106,
                point: 8,
              },
              {
                name: "Under",
                price: -115,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -140,
              },
              {
                name: "Washington Nationals",
                price: 120,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 145,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -175,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8,
              },
              {
                name: "Under",
                price: -110,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: -132,
              },
              {
                name: "Washington Nationals",
                price: 122,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Cleveland Guardians",
                price: 150,
                point: -1.5,
              },
              {
                name: "Washington Nationals",
                price: -170,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8,
              },
              {
                name: "Under",
                price: -115,
                point: 8,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "0f608201a606969f2a0f1dbaf2ee428f",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T17:40:00Z",
    home_team: "Miami Marlins",
    away_team: "Texas Rangers",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 110,
              },
              {
                name: "Texas Rangers",
                price: -120,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -152,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 132,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8.5,
              },
              {
                name: "Under",
                price: -120,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 112,
              },
              {
                name: "Texas Rangers",
                price: -132,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -145,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 125,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -119,
                point: 8,
              },
              {
                name: "Under",
                price: -102,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 110,
              },
              {
                name: "Texas Rangers",
                price: -130,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -152,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 126,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8.5,
              },
              {
                name: "Under",
                price: -122,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 110,
              },
              {
                name: "Texas Rangers",
                price: -120,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -149,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 135,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: 103,
                point: 8.5,
              },
              {
                name: "Under",
                price: -118,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 110,
              },
              {
                name: "Texas Rangers",
                price: -120,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -155,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 135,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8.5,
              },
              {
                name: "Under",
                price: -120,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 105,
              },
              {
                name: "Texas Rangers",
                price: -125,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -155,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8.5,
              },
              {
                name: "Under",
                price: -120,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 108,
              },
              {
                name: "Texas Rangers",
                price: -130,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -150,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 105,
              },
              {
                name: "Texas Rangers",
                price: -125,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -155,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -102,
                point: 8.5,
              },
              {
                name: "Under",
                price: -118,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 113,
              },
              {
                name: "Texas Rangers",
                price: -125,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -161,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -122,
                point: 8,
              },
              {
                name: "Under",
                price: 101,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 114,
              },
              {
                name: "Texas Rangers",
                price: -124,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -155,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 135,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8.5,
              },
              {
                name: "Under",
                price: -115,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 105,
              },
              {
                name: "Texas Rangers",
                price: -125,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -160,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 135,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8.5,
              },
              {
                name: "Under",
                price: -120,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: 108,
              },
              {
                name: "Texas Rangers",
                price: -125,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Miami Marlins",
                price: -159,
                point: 1.5,
              },
              {
                name: "Texas Rangers",
                price: 130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -106,
                point: 8.5,
              },
              {
                name: "Under",
                price: -114,
                point: 8.5,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "e1cf4e02c0db6697913b44aa2da33d6a",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T18:10:00Z",
    home_team: "Milwaukee Brewers",
    away_team: "Chicago White Sox",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 274,
              },
              {
                name: "Milwaukee Brewers",
                price: -315,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 134,
                point: 1.5,
              },
              {
                name: "Milwaukee Brewers",
                price: -154,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: 105,
                point: 8,
              },
              {
                name: "Under",
                price: -125,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 268,
              },
              {
                name: "Milwaukee Brewers",
                price: -333,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: -125,
                point: 2.5,
              },
              {
                name: "Milwaukee Brewers",
                price: 105,
                point: -2.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7.5,
              },
              {
                name: "Under",
                price: -106,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 274,
              },
              {
                name: "Milwaukee Brewers",
                price: -315,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 137,
                point: 1.5,
              },
              {
                name: "Milwaukee Brewers",
                price: -151,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: 107,
                point: 8,
              },
              {
                name: "Under",
                price: -123,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 270,
              },
              {
                name: "Milwaukee Brewers",
                price: -335,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 130,
                point: 1.5,
              },
              {
                name: "Milwaukee Brewers",
                price: -156,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7.5,
              },
              {
                name: "Under",
                price: -105,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 270,
              },
              {
                name: "Milwaukee Brewers",
                price: -330,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 135,
                point: 1.5,
              },
              {
                name: "Milwaukee Brewers",
                price: -155,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7.5,
              },
              {
                name: "Under",
                price: -105,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 270,
              },
              {
                name: "Milwaukee Brewers",
                price: -345,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 140,
                point: 1.5,
              },
              {
                name: "Milwaukee Brewers",
                price: -165,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 7.5,
              },
              {
                name: "Under",
                price: -115,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 265,
              },
              {
                name: "Milwaukee Brewers",
                price: -335,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 140,
                point: 1.5,
              },
              {
                name: "Milwaukee Brewers",
                price: -165,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7.5,
              },
              {
                name: "Under",
                price: -105,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 260,
              },
              {
                name: "Milwaukee Brewers",
                price: -325,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 130,
                point: 1.5,
              },
              {
                name: "Milwaukee Brewers",
                price: -155,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7.5,
              },
              {
                name: "Under",
                price: -105,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 285,
              },
              {
                name: "Milwaukee Brewers",
                price: -320,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: -132,
                point: 2.5,
              },
              {
                name: "Milwaukee Brewers",
                price: 108,
                point: -2.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7.5,
              },
              {
                name: "Under",
                price: -105,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 270,
              },
              {
                name: "Milwaukee Brewers",
                price: -330,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 135,
                point: 1.5,
              },
              {
                name: "Milwaukee Brewers",
                price: -155,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 7.5,
              },
              {
                name: "Under",
                price: -110,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 260,
              },
              {
                name: "Milwaukee Brewers",
                price: -350,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: -125,
                point: 2.5,
              },
              {
                name: "Milwaukee Brewers",
                price: 105,
                point: -2.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7.5,
              },
              {
                name: "Under",
                price: -105,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 280,
              },
              {
                name: "Milwaukee Brewers",
                price: -345,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Chicago White Sox",
                price: 128,
                point: 1.5,
              },
              {
                name: "Milwaukee Brewers",
                price: -157,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -118,
                point: 7.5,
              },
              {
                name: "Under",
                price: -104,
                point: 7.5,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "1e45d1ea0186ca4c0dd0e7b90012b891",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T18:10:00Z",
    home_team: "Kansas City Royals",
    away_team: "San Diego Padres",
    bookmakers: [
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -136,
              },
              {
                name: "San Diego Padres",
                price: 115,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 160,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -200,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -117,
                point: 8,
              },
              {
                name: "Under",
                price: -104,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -124,
              },
              {
                name: "San Diego Padres",
                price: 106,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -196,
                point: 1.5,
              },
              {
                name: "San Diego Padres",
                price: 162,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -118,
                point: 8,
              },
              {
                name: "Under",
                price: -104,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -130,
              },
              {
                name: "San Diego Padres",
                price: 118,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 155,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -192,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -117,
                point: 8,
              },
              {
                name: "Under",
                price: -103,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -121,
              },
              {
                name: "San Diego Padres",
                price: 111,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 165,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -182,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: -113,
                point: 8,
              },
              {
                name: "Under",
                price: -102,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -121,
              },
              {
                name: "San Diego Padres",
                price: 111,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 163,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -183,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -125,
              },
              {
                name: "San Diego Padres",
                price: 105,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 158,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -190,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 8,
              },
              {
                name: "Under",
                price: 100,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -125,
              },
              {
                name: "San Diego Padres",
                price: 105,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 154,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -185,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -118,
                point: 8,
              },
              {
                name: "Under",
                price: -102,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -120,
              },
              {
                name: "San Diego Padres",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 160,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -180,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 8,
              },
              {
                name: "Under",
                price: 100,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -132,
              },
              {
                name: "San Diego Padres",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 155,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -180,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -125,
              },
              {
                name: "San Diego Padres",
                price: 107,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 155,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -190,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 8,
              },
              {
                name: "Under",
                price: -101,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -125,
              },
              {
                name: "San Diego Padres",
                price: 105,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 150,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -185,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 8,
              },
              {
                name: "Under",
                price: -105,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: -121,
              },
              {
                name: "San Diego Padres",
                price: 111,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Kansas City Royals",
                price: 160,
                point: -1.5,
              },
              {
                name: "San Diego Padres",
                price: -190,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8,
              },
              {
                name: "Under",
                price: -110,
                point: 8,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "10103c3d82987562bb24a8fbdc35b95a",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T18:20:00Z",
    home_team: "Chicago Cubs",
    away_team: "Cincinnati Reds",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -120,
              },
              {
                name: "Cincinnati Reds",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: 172,
                point: -1.5,
              },
              {
                name: "Cincinnati Reds",
                price: -197,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 7,
              },
              {
                name: "Under",
                price: -115,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -120,
              },
              {
                name: "Cincinnati Reds",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: 176,
                point: -1.5,
              },
              {
                name: "Cincinnati Reds",
                price: -194,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: -102,
                point: 7,
              },
              {
                name: "Under",
                price: -113,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -120,
              },
              {
                name: "Cincinnati Reds",
                price: 102,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -215,
                point: 1.5,
              },
              {
                name: "Cincinnati Reds",
                price: 176,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -108,
                point: 7,
              },
              {
                name: "Under",
                price: -112,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -125,
              },
              {
                name: "Cincinnati Reds",
                price: 106,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: 165,
                point: -1.5,
              },
              {
                name: "Cincinnati Reds",
                price: -210,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -112,
                point: 7,
              },
              {
                name: "Under",
                price: -109,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -125,
              },
              {
                name: "Cincinnati Reds",
                price: 105,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: 170,
                point: -1.5,
              },
              {
                name: "Cincinnati Reds",
                price: -205,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 7,
              },
              {
                name: "Under",
                price: -115,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -125,
              },
              {
                name: "Cincinnati Reds",
                price: 105,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: 175,
                point: -1.5,
              },
              {
                name: "Cincinnati Reds",
                price: -210,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7,
              },
              {
                name: "Under",
                price: -105,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -125,
              },
              {
                name: "Cincinnati Reds",
                price: 105,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: 170,
                point: -1.5,
              },
              {
                name: "Cincinnati Reds",
                price: -205,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -108,
                point: 7,
              },
              {
                name: "Under",
                price: -112,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -115,
              },
              {
                name: "Cincinnati Reds",
                price: 105,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: 170,
                point: -1.5,
              },
              {
                name: "Cincinnati Reds",
                price: -213,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -108,
                point: 7,
              },
              {
                name: "Under",
                price: -112,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -120,
              },
              {
                name: "Cincinnati Reds",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: 170,
                point: -1.5,
              },
              {
                name: "Cincinnati Reds",
                price: -200,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 7,
              },
              {
                name: "Under",
                price: -115,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -125,
              },
              {
                name: "Cincinnati Reds",
                price: 105,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: 170,
                point: -1.5,
              },
              {
                name: "Cincinnati Reds",
                price: -210,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 7,
              },
              {
                name: "Under",
                price: -115,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -119,
              },
              {
                name: "Cincinnati Reds",
                price: 109,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: 175,
                point: -1.5,
              },
              {
                name: "Cincinnati Reds",
                price: -210,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 7,
              },
              {
                name: "Under",
                price: -115,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -120,
              },
              {
                name: "Cincinnati Reds",
                price: 102,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Chicago Cubs",
                price: -220,
                point: 1.5,
              },
              {
                name: "Cincinnati Reds",
                price: 170,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -104,
                point: 7,
              },
              {
                name: "Under",
                price: -118,
                point: 7,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "e63a445e01d56dd470bdd7ac9b6d85ff",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T20:05:00Z",
    home_team: "San Francisco Giants",
    away_team: "New York Yankees",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -127,
              },
              {
                name: "San Francisco Giants",
                price: 117,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 125,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -145,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8,
              },
              {
                name: "Under",
                price: -120,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -127,
              },
              {
                name: "San Francisco Giants",
                price: 117,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 129,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -142,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: 103,
                point: 8,
              },
              {
                name: "Under",
                price: -118,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -130,
              },
              {
                name: "San Francisco Giants",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 122,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -146,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -102,
                point: 8,
              },
              {
                name: "Under",
                price: -120,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -132,
              },
              {
                name: "San Francisco Giants",
                price: 111,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 130,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -150,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -103,
                point: 8,
              },
              {
                name: "Under",
                price: -118,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -130,
              },
              {
                name: "San Francisco Giants",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 122,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -145,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8,
              },
              {
                name: "Under",
                price: -120,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -133,
              },
              {
                name: "San Francisco Giants",
                price: 111,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 120,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -140,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7.5,
              },
              {
                name: "Under",
                price: -105,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -130,
              },
              {
                name: "San Francisco Giants",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 124,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -148,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -102,
                point: 8,
              },
              {
                name: "Under",
                price: -118,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -136,
              },
              {
                name: "San Francisco Giants",
                price: 124,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 123,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -152,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -117,
                point: 7.5,
              },
              {
                name: "Under",
                price: -103,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -128,
              },
              {
                name: "San Francisco Giants",
                price: 118,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 125,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -145,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8,
              },
              {
                name: "Under",
                price: -115,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -130,
              },
              {
                name: "San Francisco Giants",
                price: 110,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 125,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -155,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8,
              },
              {
                name: "Under",
                price: -115,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -136,
              },
              {
                name: "San Francisco Giants",
                price: 116,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 123,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -150,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8,
              },
              {
                name: "Under",
                price: -115,
                point: 8,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: -127,
              },
              {
                name: "San Francisco Giants",
                price: 117,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "New York Yankees",
                price: 125,
                point: -1.5,
              },
              {
                name: "San Francisco Giants",
                price: -145,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8,
              },
              {
                name: "Under",
                price: -120,
                point: 8,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "75bed3ac0b4915ec1fe5e5851d4eadbe",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T20:10:00Z",
    home_team: "Los Angeles Dodgers",
    away_team: "Colorado Rockies",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 226,
              },
              {
                name: "Los Angeles Dodgers",
                price: -255,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 111,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -131,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -103,
                point: 8.5,
              },
              {
                name: "Under",
                price: -117,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 225,
              },
              {
                name: "Los Angeles Dodgers",
                price: -275,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 108,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8.5,
              },
              {
                name: "Under",
                price: -115,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 226,
              },
              {
                name: "Los Angeles Dodgers",
                price: -255,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 115,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -127,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8.5,
              },
              {
                name: "Under",
                price: -115,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 223,
              },
              {
                name: "Los Angeles Dodgers",
                price: -270,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 110,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -104,
                point: 8.5,
              },
              {
                name: "Under",
                price: -118,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 215,
              },
              {
                name: "Los Angeles Dodgers",
                price: -267,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 110,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8.5,
              },
              {
                name: "Under",
                price: -120,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 225,
              },
              {
                name: "Los Angeles Dodgers",
                price: -280,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 115,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -135,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -110,
                point: 8.5,
              },
              {
                name: "Under",
                price: -110,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 215,
              },
              {
                name: "Los Angeles Dodgers",
                price: -265,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 110,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8.5,
              },
              {
                name: "Under",
                price: -115,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 233,
              },
              {
                name: "Los Angeles Dodgers",
                price: -260,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 108,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -132,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -103,
                point: 8.5,
              },
              {
                name: "Under",
                price: -117,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 225,
              },
              {
                name: "Los Angeles Dodgers",
                price: -260,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 110,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 8.5,
              },
              {
                name: "Under",
                price: -120,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 220,
              },
              {
                name: "Los Angeles Dodgers",
                price: -275,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 110,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8.5,
              },
              {
                name: "Under",
                price: -115,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 230,
              },
              {
                name: "Los Angeles Dodgers",
                price: -278,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 100,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -122,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -103,
                point: 8.5,
              },
              {
                name: "Under",
                price: -120,
                point: 8.5,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 215,
              },
              {
                name: "Los Angeles Dodgers",
                price: -265,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Colorado Rockies",
                price: 110,
                point: 1.5,
              },
              {
                name: "Los Angeles Dodgers",
                price: -130,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -105,
                point: 8.5,
              },
              {
                name: "Under",
                price: -115,
                point: 8.5,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3740baa92f75f5fb9caee099828fda6b",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T20:10:00Z",
    home_team: "Seattle Mariners",
    away_team: "Los Angeles Angels",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 180,
              },
              {
                name: "Seattle Mariners",
                price: -198,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -127,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 107,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7,
              },
              {
                name: "Under",
                price: -105,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 180,
              },
              {
                name: "Seattle Mariners",
                price: -198,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -123,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 111,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: -113,
                point: 7,
              },
              {
                name: "Under",
                price: -102,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 176,
              },
              {
                name: "Seattle Mariners",
                price: -210,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -126,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 105,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 7.5,
              },
              {
                name: "Under",
                price: -122,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 178,
              },
              {
                name: "Seattle Mariners",
                price: -213,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -120,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 100,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 7,
              },
              {
                name: "Under",
                price: -101,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 175,
              },
              {
                name: "Seattle Mariners",
                price: -210,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -130,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 110,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 7.5,
              },
              {
                name: "Under",
                price: -120,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 178,
              },
              {
                name: "Seattle Mariners",
                price: -218,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -125,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 105,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7,
              },
              {
                name: "Under",
                price: -105,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 170,
              },
              {
                name: "Seattle Mariners",
                price: -205,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -130,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 110,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 7,
              },
              {
                name: "Under",
                price: 100,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 177,
              },
              {
                name: "Seattle Mariners",
                price: -195,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -128,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 105,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -122,
                point: 7,
              },
              {
                name: "Under",
                price: 101,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 175,
              },
              {
                name: "Seattle Mariners",
                price: -205,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -130,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 110,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 7,
              },
              {
                name: "Under",
                price: -105,
                point: 7,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 180,
              },
              {
                name: "Seattle Mariners",
                price: -200,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -130,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 110,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: 105,
                point: 7.5,
              },
              {
                name: "Under",
                price: -125,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 170,
              },
              {
                name: "Seattle Mariners",
                price: -210,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -120,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 100,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: 105,
                point: 7.5,
              },
              {
                name: "Under",
                price: -125,
                point: 7.5,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: 170,
              },
              {
                name: "Seattle Mariners",
                price: -205,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Los Angeles Angels",
                price: -137,
                point: 1.5,
              },
              {
                name: "Seattle Mariners",
                price: 114,
                point: -1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -125,
                point: 7,
              },
              {
                name: "Under",
                price: 104,
                point: 7,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "6568d562f1be84c96ecf2f4faa09c9f0",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2024-06-02T23:10:00Z",
    home_team: "Philadelphia Phillies",
    away_team: "St. Louis Cardinals",
    bookmakers: [
      {
        key: "betonlineag",
        title: "BetOnline.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -139,
              },
              {
                name: "St. Louis Cardinals",
                price: 128,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 138,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -158,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -122,
                point: 9,
              },
              {
                name: "Under",
                price: 102,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "lowvig",
        title: "LowVig.ag",
        last_update: "2024-06-02T16:00:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -139,
              },
              {
                name: "St. Louis Cardinals",
                price: 128,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 141,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -155,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:45Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 105,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "fanduel",
        title: "FanDuel",
        last_update: "2024-06-02T15:59:45Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -142,
              },
              {
                name: "St. Louis Cardinals",
                price: 120,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 138,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -166,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:45Z",
            outcomes: [
              {
                name: "Over",
                price: 102,
                point: 9.5,
              },
              {
                name: "Under",
                price: -124,
                point: 9.5,
              },
            ],
          },
        ],
      },
      {
        key: "williamhill_us",
        title: "Caesars",
        last_update: "2024-06-02T16:00:06Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -140,
              },
              {
                name: "St. Louis Cardinals",
                price: 118,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 140,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -165,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:06Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "mybookieag",
        title: "MyBookie.ag",
        last_update: "2024-06-02T16:00:27Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -143,
              },
              {
                name: "St. Louis Cardinals",
                price: 117,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 135,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -155,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:27Z",
            outcomes: [
              {
                name: "Over",
                price: -118,
                point: 9,
              },
              {
                name: "Under",
                price: -104,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "bovada",
        title: "Bovada",
        last_update: "2024-06-02T15:59:49Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -154,
              },
              {
                name: "St. Louis Cardinals",
                price: 129,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 130,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -150,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T15:59:49Z",
            outcomes: [
              {
                name: "Over",
                price: 100,
                point: 9.5,
              },
              {
                name: "Under",
                price: -120,
                point: 9.5,
              },
            ],
          },
        ],
      },
      {
        key: "draftkings",
        title: "DraftKings",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -142,
              },
              {
                name: "St. Louis Cardinals",
                price: 120,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 140,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -166,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "wynnbet",
        title: "WynnBET",
        last_update: "2024-06-02T16:00:03Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -135,
              },
              {
                name: "St. Louis Cardinals",
                price: 123,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 135,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -167,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:03Z",
            outcomes: [
              {
                name: "Over",
                price: -122,
                point: 9,
              },
              {
                name: "Under",
                price: 101,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "betus",
        title: "BetUS",
        last_update: "2024-06-02T16:00:28Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -140,
              },
              {
                name: "St. Louis Cardinals",
                price: 125,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 145,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -165,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:28Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "superbook",
        title: "SuperBook",
        last_update: "2024-06-02T16:00:04Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -132,
              },
              {
                name: "St. Louis Cardinals",
                price: 122,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 145,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -165,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:04Z",
            outcomes: [
              {
                name: "Over",
                price: -115,
                point: 9,
              },
              {
                name: "Under",
                price: -105,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "betmgm",
        title: "BetMGM",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -140,
              },
              {
                name: "St. Louis Cardinals",
                price: 120,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 140,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -165,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -120,
                point: 9,
              },
              {
                name: "Under",
                price: 100,
                point: 9,
              },
            ],
          },
        ],
      },
      {
        key: "betrivers",
        title: "BetRivers",
        last_update: "2024-06-02T16:00:29Z",
        markets: [
          {
            key: "h2h",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: -137,
              },
              {
                name: "St. Louis Cardinals",
                price: 117,
              },
            ],
          },
          {
            key: "spreads",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Philadelphia Phillies",
                price: 150,
                point: -1.5,
              },
              {
                name: "St. Louis Cardinals",
                price: -190,
                point: 1.5,
              },
            ],
          },
          {
            key: "totals",
            last_update: "2024-06-02T16:00:29Z",
            outcomes: [
              {
                name: "Over",
                price: -117,
                point: 9,
              },
              {
                name: "Under",
                price: -104,
                point: 9,
              },
            ],
          },
        ],
      },
    ],
  },
];
