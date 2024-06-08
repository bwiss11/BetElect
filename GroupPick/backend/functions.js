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
import { collection, getDocs, query, where, limit } from "firebase/firestore";

function GetGames() {
  // Gets the current day's game data from MLB's API and returns it
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
  // Gets a pitcher's statistics for the current year from MLB's API and returns them
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
  // Gets team information from MLB's API and returns it
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

const HandleOdds = async () => {
  // Logs odds if necessary, or retrieves them and returns them if not
  const curDate = GetFormattedDate();
  const curHours = GetCurrentHours();
  // Check if odds are already in db
  const retrievedOdds = await GetFirestoreOdds(curDate, curHours);
  // If odds are already in db, return the odds
  if (retrievedOdds[1]) {
    console.log("returning odds without calling API");
    return retrievedOdds;
  } else {
    // If odds aren't in database, call to the-odds-api to get up-to-the-hour odds
    console.log("\n\n\nCALLING API in handleOdds\n\n\n\n");
    const response = await fetch(
      "https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=a1a8c66ce88c82f5342af641c0ecd4a8&regions=us&markets=h2h,spreads,totals&oddsFormat=american"
    );
    const oddsData = await response.json();
    // Use the data from the the-odds-api to create the odds
    gameData = await GetGames();
    oddsMakerOdds = await OddsMaker(gameData, oddsData);
    // Store the newly created odds in the database, and return the odds
    await recordOdds(curDate, curHours, oddsMakerOdds);
    const retrievedOdds = await GetFirestoreOdds(curDate, curHours);
    return retrievedOdds;
  }
};

const GetFirestoreOdds = async (date, hours) => {
  // Retrieves the odds for the passed-in date and hour to from Firestore and returns them
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

    // If odds are current (have been updated in the last hour), odds are returned and ans[1] is set to true indicating odds are up-to-the-hour
    if (ans[1].hours == hours) {
      return [ans, true];
    }
  }

  // If odds doc doesn't exist or odds are not from the current hour, the last retrieved odds are returned but ans[1] is set to false, indicating odds are not up-to-the-hour
  return [ans, false];
};

const OddsMaker = async (data, fullOdds) => {
  // Makes the odds for the day
  if (!data) {
    console.log("returning null");
    return null;
  }

  try {
    // Get current date object in YYYY-MM-DD format
    const curDate = GetFormattedDate();
    const curHours = GetCurrentHours();
    // Gets the last-logged odds from Firestore
    const firestoreOdds = await GetFirestoreOdds(curDate, curHours);
    if (firestoreOdds[1]) {
      // If the odds are up-to-the-hour, they are returned
      return firestoreOdds ? firestoreOdds[0][1][curDate] : null;
    } else {
      // Initialized 'object' template for storing odds
      object = {};
      if (data) {
        // Initializes each games odds as blank to start
        for (let i = 0; i < data.length; i++) {
          console.log("top level i is", i);
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
          let gameTime = new Date(data[i].gameDate);
          let theCurTime = new Date(Date.now());
          let difference = gameTime - theCurTime;

          // If the current game has already started, we don't want to update the odds - odds are set to the last-retrieved odds for that game
          if (difference < 0 && firestoreOdds[0]) {
            let simplifiedOdds = firestoreOdds[0][1]["odds"][i];
            object[i].startTime = data[i].gameDate;
            object[i].awayMLOdds = simplifiedOdds["awayMLOdds"]
              ? simplifiedOdds["awayMLOdds"]
              : "";
            object[i].homeMLOdds = simplifiedOdds["homeMLOdds"]
              ? simplifiedOdds["homeMLOdds"]
              : "";
            object[i].awaySpread = simplifiedOdds["awaySpread"]
              ? simplifiedOdds["awaySpread"]
              : "";
            object[i].homeSpread = simplifiedOdds["homeSpread"]
              ? simplifiedOdds["homeSpread"]
              : "";
            object[i].awaySpreadOdds = simplifiedOdds["awaySpreadOdds"]
              ? simplifiedOdds["awaySpreadOdds"]
              : "";
            object[i].homeSpreadOdds = simplifiedOdds["homeSpreadOdds"]
              ? simplifiedOdds["homeSpreadOdds"]
              : "";
            object[i].total = simplifiedOdds["total"]
              ? simplifiedOdds["total"]
              : "";
            object[i].overOdds = simplifiedOdds["overOdds"]
              ? simplifiedOdds["overOdds"]
              : "";
            object[i].underOdds = simplifiedOdds["underOdds"]
              ? simplifiedOdds["underOdds"]
              : "";
            // Continues on to the next game
            continue;
          }

          // Records basic game information
          awayTeam = data[i].teams.away.team.name;
          homeTeam = data[i].teams.home.team.name;
          gameDate = data[i].gameDate;
          if (fullOdds) {
            // Initializes all of the necessary odds to be recorded
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
              // Goes through all of the odds and searches for the matching game
              if (
                fullOdds[j].away_team == awayTeam &&
                fullOdds[j].home_team == homeTeam &&
                !foundBool
              ) {
                foundBool = true;
                for (
                  let k = 0;
                  k < fullOdds[j].bookmakers[0].markets.length;
                  k++
                ) {
                  // Goes through each market (separate markets for ML, spread, and totals) and sets the odds accordingly
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
                // Records all of the retrieved odds into the object
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
      // Returns the odds object if it exists
      if (object != {}) {
        console.log("returning object", object);
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
  // Gets the current date, formats it in YYYY-MM-DD and returns it
  t = new Date(Date.now());
  z = t.getTimezoneOffset() * 60 * 1000;
  tLocal = t - z;
  tLocal = new Date(tLocal);
  iso = tLocal.toISOString().split("T")[0];
  return iso;
};

const GetCurrentHours = () => {
  // Gets the current time in hours, accounting for the time zone offset
  t = new Date(Date.now());
  z = t.getTimezoneOffset() * 60 * 1000;
  tLocal = t - z;
  tLocal = new Date(tLocal);
  hours = tLocal.getHours();
  return hours;
};

const UpdatePicks = async (
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
    // Updates user's Firestore picks in database
    // Gets Firestore picks
    const firestorePicks = await getUserFirestorePicks(date, userID);
    if (!firestorePicks) {
      // If no picks are in Firestore
      let picksArray = [];
      for (let i = 0; i < numberOfGames; i++) {
        picksArray.push("");
      }
      picksArray[index] = pick;
      // Logs blank picks array into Firestore
      await logFirestorePicks(date, picksArray, userID, picksDocID);
    } else {
      firestorePicks[index] = pick;
      for (let i = 0; i < firestorePicks.length; i++) {
        if (!firestorePicks[i]) {
          firestorePicks[i] = "";
        }
      }
      await logFirestorePicks(date, firestorePicks, userID, picksDocID);
    }
  } catch (e) {
    console.log(e);
    // error reading value
  }
};

const GetLiveData = async (MLBGamePk) => {
  // Gets a game's live data from MLB's API
  return fetch(
    "https://statsapi.mlb.com/api/v1.1/game/" + MLBGamePk + "/feed/live"
  )
    .then((res) => {
      data = res.json();
      return data;
    })
    .then((data) => {
      // Parses the data and returns only the information needed to be displayed
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
  // Translates a pick from its generic form (e.g. "homeML" or "under" to its translated form (e.g. "Royals ML" or "Under 8.5"))
  let thisPick = ["", ""];

  // If there is not a pick or the pick is essentially null, "No Pick" is set as the pick with no odds
  if (!pick) {
    return thisPick;
  } else if (pick == "optOut" || pick == "No Pick") {
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
      // Gets the related team and translates odds if necessary (underdogs get the "+" sign added in front of their spread)
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
      // Gets the related team and translates odds if necessary (underdogs get the "+" sign added in front of their spread)
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
  GetFormattedDate,
  GetLiveData,
  TranslatePick,
  GetCurrentHours,
  HandleOdds,
  UpdatePicks,
};
