import { View, ScrollView, StyleSheet, Text, Pressable } from "react-native";
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
} from "../backend/functions";
import { Game } from "../components/Game";

const SoloPicks = () => {
  const [name, setName] = useState("defaultName");
  const [data, setData] = useState("");
  const [odds, setOdds] = useState("");
  const [oddsBool, setOddsBool] = useState(false);
  const [picks, setPicks] = useState([]);

  const curDate = new Date(Date.now()).toISOString().split("T")[0];

  useEffect(() => {
    GetGames().then((res) => {
      setData(res);
    });

    GetLocalPicks().then((GLPRes) => {
      if (GLPRes) {
        setPicks(GLPRes);
      } else {
        picksList = [];
        for (let i = 0; i < data.length; i++) {
          picksList.push("");
        }
        setPicks(picksList);
      }
    });

    // clearAll();
  }, []);

  // useEffect(() => {
  //   console.log("picks updated to", picks);
  // }, [picks]);

  useEffect(() => {
    if (data) {
      // console.log("data is", data);
      // AsyncStorage.getItem(curDate + "setOdds").then((res) => {
      //   console.log("are the odds set", res);
      // });
      GetData(curDate).then((res) => {
        if (!res) {
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
  }, [data]);

  // useEffect(() => {
  //   console.log("odds are", odds);
  // }, [odds]);

  if (data && odds && oddsBool) {
    return (
      <ScrollView style={styles.outermostContainer}>
        <View style={styles.container}>
          <Text>{name}</Text>
          <Pressable
            onPress={() => {
              setName("Blaine");
            }}
          >
            <Text>Press me!</Text>
          </Pressable>
          {data.map((game, index) => (
            <Game
              key={index}
              time={game.gameDate}
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
    backgroundColor: "grey",
    alignItems: "center",
    //     backgroundImage:
    //       "linear-gradient(to bottom, rgb(60, 90, 190, 100), rgb(150, 150, 255, 100))",
  },
});
