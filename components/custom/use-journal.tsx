import { Message } from "ai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const questions = [
  {
    role: "journal",
    content: "Was war das schönste was dir Heute passiert ist?",
  },
  {
    role: "journal",
    content: "Was hat dich Heute glücklich gemacht?",
  },
  {
    role: "journal",
    content: "Wofür bist du Heute besonders dankbar?",
  },
];

function useJournal(props: {
  userType: string;
  initialMessages: Array<Message>;
  input: string;
  id: string;
  setInput: any;
  selectedModelId: string;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    props.initialMessages.length > 0 ? props.initialMessages.length : 0
  );
  const [entries, setEntries] = useState(
    props.initialMessages.length > 0 ? props.initialMessages : [questions[0]]
  );
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  function saveResponse() {
    props.setInput("");

    const userEntry = { role: "user", content: props.input };
    const updatedEntries = [...entries, userEntry];

    setEntries(updatedEntries);
  }

  const nextQuestion = useCallback(async () => {
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
        body: JSON.stringify({
          id: props.id,
          messages: entries,
          selectedModelId: props.selectedModelId,
        }),
      });
      setIsFinished(true);
    }
  }, [currentQuestionIndex, entries, props.id, props.selectedModelId, router]);

  useEffect(() => {
    if (entries.length > 0 && entries[entries.length - 1].role === "user") {
      nextQuestion();
    }
  }, [entries, nextQuestion]);

  return {
    isFinished,
    saveResponse,
    entries,
  };
}

export default useJournal;
