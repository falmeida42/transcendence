export interface PlayerListProps {
  players: { [index: string]: player };
}

export interface player {
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PlayerList = (props: any) => {
  return (
    <div className="list-group">
      <span className="list-title">Jogadores:</span>
      {Object.keys(props.players).map((key) => (
        <div key={key} className="list-item">
          {props.players[key].name}
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
