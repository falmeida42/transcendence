const Home = () => {
  // const { isConnected } = useContext(SocketContext);

  return (
    <>
      {/* {!isConnected && <div>Desconectado, conectando...</div>} */}
      {
        <div className="main-container">
          <button>Play a random</button>
          <button>Play a friend</button>
        </div>
      }
    </>
  );
};

export default Home;
