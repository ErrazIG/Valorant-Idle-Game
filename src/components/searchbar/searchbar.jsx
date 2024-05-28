import PropTypes from "prop-types";
import { useState } from "react";
import style from "./searchbar.module.css";

const Searchbar = ({ suggestions, onSubmit }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [emptyInputMessage, setEmptyInputMessage] = useState("");
  const [notFoundMessage, setNotFoundMessage] = useState("");

  const onChange = (e) => {
    e.preventDefault();
    const newUserInput = e.currentTarget.value;
    setUserInput(newUserInput);
    if (newUserInput) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(newUserInput.toLowerCase()) === 0
      );
      setFilteredSuggestions(filtered);
      setEmptyInputMessage(""); // Clear empty input message when user starts typing a new search
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSubmit = (input) => {
    const lowercaseInput = input.toLowerCase(); // Convert user input to lowercase
    if (input === "") {
      setEmptyInputMessage("The input is empty.");
      setNotFoundMessage("");
    } else if (
      !filteredSuggestions
        .map((suggestion) => suggestion.toLowerCase())
        .includes(lowercaseInput)
    ) {
      // Convert suggestions to lowercase and then check for inclusion
      setNotFoundMessage(`The agent “${input}” was not found.`);
      setEmptyInputMessage("");
    } else {
      setEmptyInputMessage("");
      setNotFoundMessage("");
      onSubmit(input); // Trigger onSubmit callback with input value
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

  const setActiveBorderClass = (suggestions) => {
    return suggestions.length > 0 ? style.activeBorder : ""; // Add style.activeBorder class if suggestions exist, otherwise return empty string
  };

  return (
    <div
      className={`${style.container} ${setActiveBorderClass(
        filteredSuggestions
      )}`}
    >
      {emptyInputMessage && (
        <div className={style.message}>{emptyInputMessage}</div>
      )}
      {notFoundMessage && (
        <div className={style.message}>{notFoundMessage}</div>
      )}
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
        placeholder="Name an agent..."
        className={`${style.input} ${setActiveBorderClass(
          filteredSuggestions
        )}`} // Add style.activeBorder class to input element
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

Searchbar.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
