import { useState } from "react";

const questions = [
  { role: "journal", content: "What are you grateful for today?" },
  {
    role: "journal",
    content: "Describe a positive experience you had recently.",
  },
  { role: "journal", content: "What are some challenges you’re facing?" },
  // Add more questions as needed
];

function useJournal() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [entries, setEntries] = useState([questions[0]]);

  const currentQuestion = entries[currentQuestionIndex];

  function saveResponse(responseContent) {
    const userEntry = { role: "user", content: responseContent };

    // Insert the user response right after the current question
    const updatedEntries = [
      ...entries.slice(0, currentQuestionIndex + 1),
      userEntry,
      ...entries.slice(currentQuestionIndex + 1),
    ];

    setEntries(updatedEntries);
    nextQuestion();
  }

  function nextQuestion() {
    const nextIndex = entries.findIndex(
      (entry, index) => entry.role === "journal" && index > currentQuestionIndex
    );
    if (nextIndex !== -1) {
      setCurrentQuestionIndex(nextIndex);
    }
  }

  function prevQuestion() {
    const prevIndex = entries
      .slice(0, currentQuestionIndex)
      .reverse()
      .findIndex((entry) => entry.role === "journal");
    if (prevIndex !== -1) {
      setCurrentQuestionIndex(currentQuestionIndex - prevIndex - 1);
    }
  }

  return {
    currentQuestion,
    saveResponse,
    nextQuestion,
    prevQuestion,
    entries,
    currentQuestionIndex,
  };
}

export default useJournal;
