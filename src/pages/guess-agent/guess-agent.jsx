import axios from "axios";
import { useEffect, useState } from "react";
import AutoCompleteInput from "../../components/searchbar/searchbar";
import data from "../../data/data.json";
import style from "./guess-agent.module.css";

const GuessAgentPage = () => {
  const [agents, setAgents] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState([]);
  const [agentGuess, setAgentGuess] = useState({});

  useEffect(() => {
    // Fonction pour choisir un élément au hasard dans un tableau
    const getRandomAgent = () => {
      const agents = data.agents;
      const randomIndex = Math.floor(Math.random() * agents.length);
      return agents[randomIndex];
    };

    // Sélectionne un agent au hasard et met à jour l'état
    setAgentGuess(getRandomAgent());
  }, []);
  console.log(agentGuess);

  const handleSubmit = (inputValue) => {
    if (inputValue) {
      // Vérifiez si inputValue n'est pas undefined
      const foundAgent = data.agents.find(
        (agent) =>
          agent.nom && agent.nom.toLowerCase() === inputValue.toLowerCase()
      );
      console.log(foundAgent);
      if (foundAgent) {
        setSelectedAgent([...selectedAgent, foundAgent]);
      }
    } else {
      console.error("La valeur d'entrée est undefined.");
    }
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
        );
        if (response.status === 200) {
          console.log(response.data); // Affichez les données reçues pour vérifier leur structure
          if (Array.isArray(response.data.data)) {
            // Assurez-vous d'accéder à la propriété data du tableau
            const agentNames = response.data.data
              .filter((agent) => agent && agent.displayName) // Filtrer les objets qui ont la propriété displayName
              .map((agent) => agent.displayName);
            setAgents(agentNames);
            setSuggestions(agentNames); // Vous pouvez appliquer des filtres ou des conditions ici
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
        <AutoCompleteInput suggestions={suggestions} onSubmit={handleSubmit} />
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
                selectedAgent.map((agent, index) => (
                  <tr key={index}>
                    <img className={style.imgTable} src={agent.url} alt="" />
                    <td>{agent.genre}</td>
                    <td>{agent.espèce}</td>
                    <td>{agent.rôle}</td>
                    <td>{agent.année_de_sortie}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default GuessAgentPage;
