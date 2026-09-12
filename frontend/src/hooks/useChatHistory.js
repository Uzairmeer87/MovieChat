import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "moviechat_sessions_v1";

const INITIAL_CHATS = [
  {
    id: "chat-1",
    title: "Find a good sci-fi movie",
    updatedAt: Date.now() - 1000 * 60 * 30, // 30 mins ago
    messages: [
      {
        sender: "user",
        text: "Find me a good sci-fi movie for tonight",
        movies: [],
        searchMeta: null,
      },
      {
        sender: "bot",
        text: "Here are top sci-fi movies recommendations for your evening:",
        movies: [
          {
            id: 693134,
            title: "Dune: Part Two",
            overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
            poster: "https://image.tmdb.org/t/p/w500/1pdfLPoLViEFiW9ZUVhoJhYd1G4.jpg",
            rating: 8.7,
            year: "2024",
            genres: ["Sci-Fi", "Adventure"],
          },
          {
            id: 157336,
            title: "Interstellar",
            overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
            poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            rating: 8.4,
            year: "2014",
            genres: ["Sci-Fi", "Drama"],
          },
          {
            id: 335984,
            title: "Blade Runner 2049",
            overview: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.",
            poster: "https://image.tmdb.org/t/p/w500/gA5Zk2ikFsRIC2vzg2flvyLZiog.jpg",
            rating: 8.0,
            year: "2017",
            genres: ["Sci-Fi", "Mystery"],
          },
          {
            id: 60625,
            title: "The Creator",
            overview: "Against the backdrop of a future war between the human race and the forces of artificial intelligence.",
            poster: "https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwv6vRCGkrOFvA7.jpg",
            rating: 7.2,
            year: "2023",
            genres: ["Sci-Fi", "Action"],
          },
        ],
        searchMeta: { searchType: "recommendation", originalQuery: "sci-fi" },
      },
    ],
  },
  {
    id: "chat-2",
    title: "Best movies like Interstellar",
    updatedAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hrs ago
    messages: [
      {
        sender: "user",
        text: "What are the best movies similar to Interstellar?",
        movies: [],
        searchMeta: null,
      },
      {
        sender: "bot",
        text: "If you loved Interstellar, you'll enjoy these mind-bending space & sci-fi masterpieces:",
        movies: [
          {
            id: 27205,
            title: "Inception",
            overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
            poster: "https://image.tmdb.org/t/p/w500/oYuLEW9WAFRfiM2GOiB2j0yW9w8.jpg",
            rating: 8.4,
            year: "2010",
            genres: ["Sci-Fi", "Thriller"],
          },
          {
            id: 286217,
            title: "The Martian",
            overview: "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth.",
            poster: "https://image.tmdb.org/t/p/w500/5HexAfE2V296yFWqIFXoq972gBN.jpg",
            rating: 7.9,
            year: "2015",
            genres: ["Sci-Fi", "Drama"],
          },
        ],
        searchMeta: null,
      },
    ],
  },
  {
    id: "chat-3",
    title: "Recommend psychological thrillers",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    messages: [],
  },
];

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed loading chat sessions:", e);
  }
  return INITIAL_CHATS;
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    // Fail silently if quota exceeded
  }
}

export function useChatHistory() {
  const [sessions, setSessions] = useState(loadSessions);
  const [activeId, setActiveId] = useState(() => sessions[0]?.id || "chat-1");

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeId) || sessions[0];

  const createNewChat = useCallback(() => {
    const newId = `chat-${Date.now()}`;
    const newSession = {
      id: newId,
      title: "New Chat",
      updatedAt: Date.now(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(newId);
    return newId;
  }, []);

  const selectChat = useCallback((id) => {
    setActiveId(id);
  }, []);

  const deleteChat = useCallback((id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) {
        const fresh = {
          id: `chat-${Date.now()}`,
          title: "New Chat",
          updatedAt: Date.now(),
          messages: [],
        };
        setActiveId(fresh.id);
        return [fresh];
      }
      return next;
    });
  }, []);

  const renameChat = useCallback((id, newTitle) => {
    if (!newTitle.trim()) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle.trim() } : s))
    );
  }, []);

  const addMessageToActiveChat = useCallback(
    (messageObj) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeId) return s;

          const updatedMessages = [...s.messages, messageObj];
          let updatedTitle = s.title;

          // Auto-name chat on first user message if title is default
          if (
            (s.title === "New Chat" || !s.title) &&
            messageObj.sender === "user"
          ) {
            updatedTitle =
              messageObj.text.slice(0, 30) +
              (messageObj.text.length > 30 ? "…" : "");
          }

          return {
            ...s,
            title: updatedTitle,
            updatedAt: Date.now(),
            messages: updatedMessages,
          };
        })
      );
    },
    [activeId]
  );

  const setMessagesForActiveChat = useCallback(
    (messagesUpdater) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeId) return s;
          const nextMsgs =
            typeof messagesUpdater === "function"
              ? messagesUpdater(s.messages)
              : messagesUpdater;
          return {
            ...s,
            updatedAt: Date.now(),
            messages: nextMsgs,
          };
        })
      );
    },
    [activeId]
  );

  return {
    sessions,
    activeSession,
    activeId,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
    addMessageToActiveChat,
    setMessagesForActiveChat,
  };
}
