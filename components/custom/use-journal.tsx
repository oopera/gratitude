import {
  initialQuestionPrompt,
  longMessage,
  secondQuestionPrompt,
  shortMessage,
  thirdQuestionPrompt,
} from "@/lib/ai/prompts";
import { Message } from "ai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const questions = [
  {
    role: "journal",
    content: initialQuestionPrompt,
  },
  {
    role: "journal",
    content: secondQuestionPrompt,
  },
  {
    role: "journal",
    content: thirdQuestionPrompt,
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
  const askedQuestions = props.initialMessages.filter(
    (message: { role: string }) => message.role === "journal"
  ).length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    askedQuestions > 0 ? askedQuestions - 1 : 0
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
    } else {
      setEntries([
        ...entries,
        {
          role: "journal",
          content: props.userType === "short" ? shortMessage : longMessage,
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
