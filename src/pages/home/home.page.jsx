import { Link } from "react-router-dom";
import style from "./home.module.css";

const HomePage = () => {
  return (
    <>
      <div className={style.homeInfoText}>
        <h2>Choose a game</h2>
        <p>Select a game from the list below to play.</p>
      </div>

      <div className={style.gameList}>
        <Link
          to="/guess-agent"
          className={`${style.gameLink} ${style.gameCard}`}
        >
          <p className={style.cardText}>GUESS THE AGENT</p>
        </Link>
        {/* <Link className={`${style.gameLink} ${style.gameCard}`}>
          <p className={style.cardText}>COMING SOON</p>
        </Link>
        <Link className={`${style.gameLink} ${style.gameCard}`}>
          <p className={style.cardText}>COMING SOON</p>
        </Link>
        <Link className={`${style.gameLink} ${style.gameCard}`}>
          <p className={style.cardText}>COMING SOON</p>
        </Link> */}
      </div>
    </>
  );
};
export default HomePage;
