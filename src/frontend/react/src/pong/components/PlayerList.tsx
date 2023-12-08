type PlayerListProps = {
  players: { [index: string]: player };
};

export interface player {
  name: string;
}

const PlayerList = (props: PlayerListProps) => {
  return (
    <div>
      {Object.keys(props.players).map((key) => (
        <div key={key}>{props.players[key].name}</div>
      ))}
    </div>
  );
};

export default PlayerList;
