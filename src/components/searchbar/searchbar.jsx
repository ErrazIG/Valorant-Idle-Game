import PropTypes from "prop-types";
import { useState } from "react";
import style from "./searchbar.module.css";

const AutoCompleteInput = ({ suggestions }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    const userInput = e.currentTarget.value;
    setUserInput(userInput);
    if (userInput) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(userInput.toLowerCase()) === 0
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSubmit = (input) => {
    if (input === "") {
      setMessage("L'input est vide.");
    } else if (suggestions.includes(input)) {
      setMessage(`"${input}" est dans la liste des suggestions.`);
    } else {
      setMessage(`"${input}" n'est pas dans la liste des suggestions.`);
    }
    setUserInput("");
    setFilteredSuggestions([]);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(userInput);
    }
  };

  const onSuggestionClick = (suggestion) => {
    handleSubmit(suggestion);
  };

  return (
    <div className={style.container}>
      {message && <div className={style.message}>{message}</div>}
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
        placeholder="Name an agent..."
        className={style.input}
      />
      <div className={style.suggestions}>
        {filteredSuggestions.map((suggestion, index) => (
          <span
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className={style.suggestionItem}
          >
            {suggestion}
          </span>
        ))}
      </div>
    </div>
  );
};

AutoCompleteInput.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AutoCompleteInput;
