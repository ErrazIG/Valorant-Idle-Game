import axios from "axios";
import { useEffect, useState } from "react";
import { TbReload } from "react-icons/tb";
import AutoCompleteInput from "../../components/searchbar/searchbar";
import data from "../../data/data.json";
import style from "./guess-agent.module.css";

const GuessAgentPage = () => {
  const [agents, setAgents] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState([]);
  const [agentGuess, setAgentGuess] = useState({});
  const [isWinner, setIsWinner] = useState(false);

  // Cette fonction est déplacée ici pour être accessible dans resetGame
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

  const handleSubmit = (inputValue) => {
    if (inputValue) {
      const foundAgent = data.agents.find(
        (agent) =>
          agent.nom && agent.nom.toLowerCase() === inputValue.toLowerCase()
      );
      if (foundAgent) {
        setSelectedAgent([...selectedAgent, foundAgent]);
        setIsWinner(agentGuess.nom === foundAgent.nom);
      }
    } else {
      console.error("La valeur d'entrée est undefined.");
    }
  };

  // Fonction pour réinitialiser le jeu
  const resetGame = () => {
    setSelectedAgent([]);
    setAgentGuess(getRandomAgent());
    setIsWinner(false);
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
  // console.log(agentGuess);

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
                      <img className={style.imgTable} src={agent.url} alt="" />
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
    </>
  );
};

export default GuessAgentPage;
