import { useRouter } from "next/navigation";
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

function useJournal(props: { input: string; id: string; setInput: any }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [entries, setEntries] = useState([questions[0]]);
  const router = useRouter();

  function saveResponse() {
    props.setInput("");

    const userEntry = { role: "user", content: props.input };
    const updatedEntries = [...entries, userEntry];

    if (updatedEntries.length === 2) {
      // window.history.replaceState({}, "", `/chat/${props.id}`);
    }

    setEntries(updatedEntries);
  }

  useEffect(() => {
    if (entries.length > 0 && entries[entries.length - 1].role === "user") {
      nextQuestion();
    }
  }, [entries, nextQuestion]);

  async function nextQuestion() {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      const updatedEntries = [...entries, questions[nextIndex]];
      setEntries(updatedEntries);
    } else {
      setEntries([
        ...entries,
        {
          role: "journal",
          content: "Dein Eintrag ist beendet, und wurde abgespeichert.",
        },
      ]);
      fetch(`/api/journal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: props.id, messages: entries }),
      });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  }

  return {
    saveResponse,
    entries,
  };
}

export default useJournal;
