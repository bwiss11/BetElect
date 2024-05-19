import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import {
  GetGames,
  GetOdds,
  StoreData,
  GetData,
  clearAll,
  GetFormattedDate,
  OddsMaker,
  GetLocalPicks,
  GetLocalGames,
} from "../backend/functions";
import { Game } from "../components/Game";

import { getUserFirestorePicks } from "../backend/firestore";

const SoloPicks = () => {
  const [name, setName] = useState("defaultName");
  const [data, setData] = useState("");
  const [odds, setOdds] = useState("");
  const [oddsBool, setOddsBool] = useState(false);
  const [picks, setPicks] = useState("");

  // const curDate = new Date(Date.now()).toISOString().split("T")[0];
  const curDate = GetFormattedDate();

  useEffect(() => {
    GetGames().then((res) => {
      setData(res);
    });

    // GetLocalPicks(curDate, "123456").then((GLPRes) => {
    //   // console.log("GLP response:", GLPRes);
    //   if (GLPRes) {
    //     GetLocalGames().then((GLGRes) => {
    //       if (GLPRes.length < GLGRes.length) {
    //         for (i = GLPRes.length; i < GLGRes.length; i++) {
    //           GLPRes.push("");
    //         }
    //       }
    //     });
    //     // console.log("setting picks to", GLPRes);
    //     setPicks(GLPRes);
    //   } else {
    //   }
    // });

    getUserFirestorePicks(curDate, "L2tcqkRGYEEHb20DVbv5").then((res) => {
      setPicks(res);
    });

    // clearAll();
  }, []);

  useEffect(() => {
    if (data) {
      // console.log("data is", data);
      // AsyncStorage.getItem(curDate + "setOdds").then((res) => {
      //   console.log("are the odds set", res);
      // });
      GetData(curDate).then((res) => {
        if (!res) {
          setPicks([]);
          StoreData().then(() => {
            //   console.log("storing my data now");
            OddsMaker(data).then((res) => {
              setOdds(res);
            });
            setOddsBool(true);
          });
        } else {
          OddsMaker(data).then((res) => {
            setOdds(res);
          });
          setOddsBool(true);
          // console.log("retrieved:", res);
        }
      });
    }

    // GetLocalPicks(curDate, "123456").then((GLPRes) => {
    //   if (!GLPRes) {
    //     // console.log("no response setting picks to []");
    //     picksList = [];
    //     for (let i = 0; i < data.length; i++) {
    //       picksList.push("");
    //     }
    //     setPicks(picksList);
    //   }
    // });

    getUserFirestorePicks(curDate, "L2tcqkRGYEEHb20DVbv5").then((res) => {
      setPicks(res);
    });
  }, [data]);

  useEffect(() => {
    // console.log("picks are", picks);
  }, [picks]);

  if (data && odds && oddsBool) {
    // console.log("log of odds", odds, picks);
    return (
      <ScrollView style={styles.outermostContainer}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={styles.image}
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Major_League_Baseball_logo.svg/1920px-Major_League_Baseball_logo.svg.png",
              }}
            ></Image>
            <Text style={styles.text}>
              {new Date().toLocaleDateString("en-us", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          {data.map((game, index) => (
            <Game
              key={index}
              time={game.gameDate}
              status={game.status.detailedState}
              awayTeamID={game.teams.away.team.id}
              awayStarter={
                game.teams.away.probablePitcher
                  ? game.teams.away.probablePitcher.fullName
                  : "TBD"
              }
              awayStarterPlayerID={
                game.teams.away.probablePitcher
                  ? game.teams.away.probablePitcher.id
                  : ""
              }
              awayTeamWins={game.teams.away.leagueRecord.wins}
              awayTeamLosses={game.teams.away.leagueRecord.losses}
              homeTeamID={game.teams.home.team.id}
              homeStarter={
                game.teams.home.probablePitcher
                  ? game.teams.home.probablePitcher.fullName
                  : "TBD"
              }
              homeStarterPlayerID={
                game.teams.home.probablePitcher
                  ? game.teams.home.probablePitcher.id
                  : ""
              }
              index={index}
              picks={picks}
              setPicks={setPicks}
              homeTeamWins={game.teams.home.leagueRecord.wins}
              homeTeamLosses={game.teams.home.leagueRecord.losses}
              homeML={odds[index].homeMLOdds}
              awayML={odds[index].awayMLOdds}
              awaySpread={odds[index].awaySpread}
              homeSpread={odds[index].homeSpread}
              homeSpreadOdds={odds[index].homeSpreadOdds}
              awaySpreadOdds={odds[index].awaySpreadOdds}
              total={odds[index].total}
              over={odds[index].overOdds}
              under={odds[index].underOdds}
              numberOfGames={data.length}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
};

export default SoloPicks;

const styles = StyleSheet.create({
  outermostContainer: { minWidth: "40%" },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
    alignItems: "center",
    //     backgroundImage:
    //       "linear-gradient(to bottom, rgb(60, 90, 190, 100), rgb(150, 150, 255, 100))",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
    fontSize: 20,
  },
  image: {
    height: 25,
    width: 47,
    margin: 5,
    marginRight: 10,
    marginTop: 15,
  },
});
