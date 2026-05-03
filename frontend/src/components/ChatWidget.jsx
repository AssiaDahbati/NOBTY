import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const quickOptions = [
  "Book appointment",
  "Find businesses",
  "Support",
  "Register business",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Hi 👋 I’m Nobty Assistant.",
    },
  ]);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const nextIdRef = useRef(2);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: nextIdRef.current++, from: "user", text },
    ]);
  };

  const addBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: nextIdRef.current++, from: "bot", text },
    ]);
  };

  const botReply = (text, action) => {
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      addBotMessage(text);
      if (action) action();
    }, 500);
  };

  const handleOption = (option) => {
    addUserMessage(option);

    switch (option) {
      case "Book appointment":
        botReply("Opening businesses for booking.", () =>
          navigate("/businesses")
        );
        break;
      case "Find businesses":
        botReply("Here are the available businesses.", () =>
          navigate("/businesses")
        );
        break;
      case "Support":
        botReply("Opening contact support.", () => navigate("/contact"));
        break;
      case "Register business":
        botReply("Let’s register your business.", () =>
          navigate("/create-business")
        );
        break;
      default:
        botReply("How can I help?");
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)]"
      >
        {open ? <X size={24} /> : <Bot size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-[300px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"
                >
                  <Bot size={20} />
                </motion.div>

                <div>
                  <h3 className="text-sm font-semibold">Nobty Bot</h3>
                  <p className="text-xs text-blue-100">Online now</p>
                </div>
              </div>
            </div>

            {/* Chat body */}
            <div className="max-h-[220px] overflow-y-auto bg-slate-50 px-3 py-3">
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.from === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        msg.from === "bot"
                          ? "rounded-bl-md bg-white text-slate-700"
                          : "rounded-br-md bg-blue-600 text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-white px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick actions */}
            <div className="border-t border-slate-200 bg-white p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Quick help
              </p>

              <div className="grid grid-cols-2 gap-2">
                {quickOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOption(option)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}