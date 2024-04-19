import { View, ScrollView, StyleSheet, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { GetGames, GetOdds, GetPitcherStats } from "../backend/functions";
import { Game } from "../components/Game";

const Home = () => {
  const [name, setName] = useState("defaultName");
  const [data, setData] = useState("");
  const [odds, setOdds] = useState("");

  useEffect(() => {
    GetGames().then((res) => {
      setData(res);
    });
    let odds = GetOdds();
    console.log("odds are:", odds);
    setOdds(odds);
  }, []);

  if (data) {
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
                  : "NA"
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
                  : "NA"
              }
              homeTeamWins={game.teams.home.leagueRecord.wins}
              homeTeamLosses={game.teams.home.leagueRecord.losses}
              homeML={odds[index].homeML}
              awayML={odds[index].awayML}
              homeSpreadOdds={odds[index].homeSpread}
              awaySpreadOdds={odds[index].awaySpread}
              total={odds[index].total}
              over={odds[index].over}
              under={odds[index].under}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  outermostContainer: { minWidth: "50%" },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "grey",
    //     backgroundImage:
    //       "linear-gradient(to bottom, rgb(60, 90, 190, 100), rgb(150, 150, 255, 100))",
  },
});
