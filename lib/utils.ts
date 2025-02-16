import {
  CoreMessage,
  CoreToolMessage,
  generateId,
  generateText,
  Message,
  ToolInvocation,
} from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { customModel } from "@/ai";
import { Chat } from "@/db/schema";
import { SystemPrompts } from "./ai/prompts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: "result",
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

export function convertToUIMessages(
  messages: Array<CoreMessage>
): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = "";
    let toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: generateId(),
      role: message.role,
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

export function getTitleFromChat(chat: Chat) {
  const messages = convertToUIMessages(chat.messages as Array<CoreMessage>);
  const firstMessage = messages[0];

  if (!firstMessage) {
    return "Untitled";
  }

  return firstMessage.content;
}

export async function generateInitialPromptFromContext({
  context,
  condition,
}: {
  context: any;
  condition: string;
}) {
  const systemPrompt = SystemPrompts({
    condition: condition,
    context: context,
    isInitialPrompt: true,
  });
  console.log(systemPrompt.toString());
  const result = generateText({
    model: customModel,
    system: systemPrompt,
    messages: [],
    temperature: 0.25,
    maxSteps: 5,
  });

  return result;
}

export function createContextFromMessages({ chats }: { chats: Chat[] }) {
  return chats.map((chat) => {
    const messages = chat.messages
      .filter((message) => {
        if (message.role === "tool") {
          return false;
        }

        if (Array.isArray(message.content)) {
          if (message.content.find((item) => item.type === "tool-call")) {
            return false;
          }
        }
        return true;
      })
      .map((message) => {
        const improvedMessage = {
          role: message.role,
          text: Array.isArray(message.content)
            ? message.content?.[0].text
            : message.content,
        };
        return improvedMessage;
      });

    return {
      createdAt: chat.createdAt,
      messages: messages,
    };
  });
}
