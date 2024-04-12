import { View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { GetGames } from "../backend/functions";
import { Game } from "../components/Game";

const Home = () => {
  const [name, setName] = useState("defaultName");
  const [data, setData] = useState("");

  useEffect(() => {
    GetGames().then((res) => {
      console.log("executing");
      setData(res);
    });
  }, []);

  useEffect(() => {
    console.log("data is ", data);
    // for (let i = 0; i < data.length; i++) {
    //   console.log("game is", data[i]);
    //   console.log(
    //     "team1: ",
    //     data[i].teams.away.team.name,
    //     "team2: ",
    //     data[i].teams.home.team.name
    //   );
    // }
  }, [data]);
  if (data) {
    return (
      <View>
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
            awayTeam={game.teams.away.team.name}
            homeTeam={game.teams.home.team.name}
          />
        ))}
      </View>
    );
  } else {
    return <div>No data</div>;
  }
};

export default Home;

// console.log(
//     "game, index",
//     game.teams.away.team.name,
//     game.teams.home.team.name,
//     index
//   )

{
  /* <tr key={index}>
<td>{game.teams.away.team.name}</td>
<td>{game.teams.home.team.name}</td>

</tr> */
}
