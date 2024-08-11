import axios from "axios";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { TbReload } from "react-icons/tb";
import { useNavigate } from "react-router-dom"; // Importez useNavigate
import AutoCompleteInput from "../../components/searchbar/searchbar";
import data from "../../data/data.json";
import style from "./guess-agent.module.css";

// Composant pour la modal
const WinModal = ({ onReplay, onMainMenu }) => (
  <div className={style.modal}>
    <div className={style.modalContent}>
      <h2>Félicitations, vous avez gagné !</h2>
      <button onClick={onReplay}>Rejouer</button>
      <button onClick={onMainMenu}>Menu Principal</button>
    </div>
  </div>
);

const GuessAgentPage = () => {
  const [agents, setAgents] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState([]);
  const [agentGuess, setAgentGuess] = useState({});
  const [isWinner, setIsWinner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate(); // Utilisez useNavigate pour créer une fonction de navigation

  const getRandomAgent = () => {
    const agents = data.agents;
    const randomIndex = Math.floor(Math.random() * agents.length);
    return agents[randomIndex];
  };

  useEffect(() => {
    setAgentGuess(getRandomAgent());
  }, []);

  const checkMatch = (guess, selected) => {
    const match = {};
    Object.keys(guess).forEach((key) => {
      if (guess[key] === selected[key]) {
        match[key] = "good";
      } else {
        match[key] = "bad";
      }
    });
    return match;
  };

  const handleWin = () => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
    setShowModal(true); // Afficher la modal
  };

  const handleSubmit = (inputValue) => {
    if (inputValue) {
      const foundAgent = data.agents.find(
        (agent) =>
          agent.nom && agent.nom.toLowerCase() === inputValue.toLowerCase()
      );
      if (foundAgent) {
        setSelectedAgent([foundAgent, ...selectedAgent]);
        const isWinner = agentGuess.nom === foundAgent.nom;
        setIsWinner(isWinner);
        if (isWinner) {
          handleWin();
        }
      }
    } else {
      console.error("La valeur d'entrée est undefined.");
    }
  };

  const resetGame = () => {
    setSelectedAgent([]);
    setAgentGuess(getRandomAgent());
    setIsWinner(false);
    setShowModal(false); // Cacher la modal
  };

  const goToMainMenu = () => {
    navigate("/"); // Utilisez navigate pour rediriger vers la route de test
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
        );
        if (response.status === 200) {
          if (Array.isArray(response.data.data)) {
            const agentNames = response.data.data
              .filter((agent) => agent && agent.displayName)
              .map((agent) => agent.displayName);
            setAgents(agentNames);
            setSuggestions(agentNames);
          } else {
            console.error(
              "La réponse de l'API n'est pas un tableau:",
              response.data
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des agents:", error);
      }
    };

    fetchAgents();
  }, []);

  return (
    <>
      <div className={style.gameAgent}>
        <h2 className={style.gameTitle}>Guess The Agent</h2>
        <div className={style.inputs}>
          <AutoCompleteInput
            suggestions={suggestions}
            onSubmit={handleSubmit}
            disabled={isWinner}
          />
          <button onClick={resetGame} className={style.restartButton}>
            <TbReload className={style.iconRestart} title="Rejouer" />
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Genre</th>
                <th>Espèce</th>
                <th>Rôle</th>
                <th>Année de sortie</th>
              </tr>
            </thead>
            <tbody>
              {selectedAgent &&
                selectedAgent.map((agent, index) => {
                  const match = checkMatch(agentGuess, agent);
                  return (
                    <tr key={index}>
                      <td>
                        <img
                          className={style.imgTable}
                          src={agent.url}
                          alt=""
                        />
                      </td>
                      <td className={style[match.genre]}>{agent.genre}</td>
                      <td className={style[match.espèce]}>{agent.espèce}</td>
                      <td className={style[match.rôle]}>{agent.rôle}</td>
                      <td className={style[match.année_de_sortie]}>
                        {agent.année_de_sortie}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && <WinModal onReplay={resetGame} onMainMenu={goToMainMenu} />}
    </>
  );
};

export default GuessAgentPage;
