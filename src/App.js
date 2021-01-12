import { useEffect, useState, useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import { emotionList } from "./emotionList";

const sortedEmojii = [...emotionList].sort((a, b) => a.emojii - b.emojii);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const getNextSet = (withinNext) => {
  let nextIndex;
  if (typeof withinNext === "number") {
    nextIndex =
      (withinNext + (getRandomInt(1) ? -1 : 1) * getRandomInt(20)) %
      sortedEmojii.length;
  } else {
    nextIndex = getRandomInt(sortedEmojii.length);
  }
  const { description, emojii } = sortedEmojii[nextIndex];
  return { description, emojii, index: nextIndex };
};

function App() {
  const [currentSet, setCurrentSet] = useState(getNextSet());

  const { emojii, description, index } = currentSet;

  const answers = useMemo(() => {
    const set = new Set();
    set.add(currentSet.emojii);
    while (set.size < 4) {
      set.add(getNextSet(index).emojii);
    }
    return Array.from(set).sort();
  }, [currentSet]);

  const [numberCorrect, setNumberCorrect] = useState(0);

  const [numberWrong, setNumberWrong] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const nextQuestion = () => {
    setCurrentSet(getNextSet());
  };

  useEffect(() => {
    if (selectedAnswer !== null) {
      setTimeout(
        () => {
          setSelectedAnswer(null);
          nextQuestion();
        },
        selectedAnswer === emojii ? 100 : 2000
      );
    }
  }, [selectedAnswer]);
  return (
    <div className="App">
      <div className="word">{description}</div>
      <div className="answers">
        {answers.map((answer) => (
          <button
            style={{
              background:
                selectedAnswer === null
                  ? "lightgrey"
                  : answer === emojii
                  ? "green"
                  : answer === selectedAnswer
                  ? "red"
                  : "lightgrey",
            }}
            onClick={() => {
              if (selectedAnswer) {
                return;
              }
              if (answer === emojii) {
                setNumberCorrect(numberCorrect + 1);
              } else {
                setNumberWrong(numberWrong + 1);
              }

              setSelectedAnswer(answer);
            }}
            key={answer}
          >
            {answer}
          </button>
        ))}
      </div>
      <div className="stats">
        <div>Number correct: {numberCorrect}</div>
        <div>Number wrong: {numberWrong}</div>
      </div>
    </div>
  );
}

export default App;
