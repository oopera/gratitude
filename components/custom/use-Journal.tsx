import { useEffect, useState } from "react";

const questions = [
  { role: "journal", content: "Wofür bist du Heute dankbar?" },
  {
    role: "journal",
    content: "Beschreibe eine positive Erfahrung die du vor kurzem hattest.",
  },
  {
    role: "journal",
    content: "Was ist dir heute besonders gut gelungen?",
  },
];

function useJournal(input: string) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [entries, setEntries] = useState([questions[0]]);

  function saveResponse() {
    const userEntry = { role: "user", content: input };

    const updatedEntries = [...entries, userEntry];

    setEntries(updatedEntries);
  }

  useEffect(() => {
    if (entries.length > 0 && entries[entries.length - 1].role === "user") {
      nextQuestion();
    }
  }, [entries]);

  function nextQuestion() {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      const updatedEntries = [...entries, questions[nextIndex]];
      setEntries(updatedEntries);
    } else {
      setEntries([...entries, { role: "journal", content: "Ende" }]);
    }
  }

  return {
    saveResponse,
    entries,
  };
}

export default useJournal;
