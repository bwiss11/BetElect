import React from "react";

const Game = (props) => {
  console.log("game props", props);
  return (
    <>
      <div>Away: {props.awayTeam}</div>
      <div>Home {props.homeTeam}</div>
      <br></br>
    </>
  );
};

export { Game };
