import { useContext } from "react";
import {
  GameContext,
  createRoom,
  joinRoom,
  leaveRoom,
} from "./contexts/gameContext";

const Rooms = () => {
  const { player, rooms, room } = useContext(GameContext);

  return (
    <div className="list-group">
      <span className="list-title">
        Salas:
        {!player.room && <button onClick={createRoom}>Criar Sala</button>}
      </span>
      {!player.room &&
        Object.keys(rooms).map((key) => (
          <div key={`room_${key}`} className="list-item">
            {rooms[key].name}
            <button
              onClick={() => joinRoom(key)}
              disabled={rooms[key].player1 && rooms[key].player2}
            >
              Entrar
            </button>
          </div>
        ))}
      {player.room && room && (
        <div>
          {rooms[player.room] &&
          rooms[player.room].player1 &&
          rooms[player.room].player2 ? (
            <button>Iniciar jogo</button>
          ) : (
            <div className="list-item">
              <span>{rooms[player.room].name}</span>
              <button onClick={leaveRoom}>Sair</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rooms;
