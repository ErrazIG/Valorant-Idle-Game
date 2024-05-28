import axios from "axios";
import { useEffect, useState } from "react";
import AutoCompleteInput from "../../components/searchbar/searchbar";
import style from "./guess-agent.module.css";

const GuessAgentPage = () => {
  const [agents, setAgents] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = (inputValue) => {
    // Faire quelque chose avec la valeur de l'entrée
    console.log("Valeur de l'entrée:", inputValue);
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("https://valorant-api.com/v1/agents");
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
      </div>
    </>
  );
};

export default GuessAgentPage;
