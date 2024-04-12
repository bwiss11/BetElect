import { View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { GetGames } from "../backend/functions";

const Home = () => {
  const [name, setName] = useState("defaultName");
  const [data, setData] = useState("");

  useEffect(() => {
    GetGames().then((res) => {
      console.log("executing");
      setData(res);
    });
    // fetch("http://192.168.0.155:3000/test", {
    //   method: "GET",
    // })
    //   .then((res) => res.json())
    //   .then((article) => {
    //     setData(article);
    //   });
  }, []);

  useEffect(() => {
    console.log("data is ", data);
  }, [data]);
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
    </View>
  );
};

export default Home;
