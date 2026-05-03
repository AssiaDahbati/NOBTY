import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  Camera,
  Plus,
  Smile,
  Mic,
} from "lucide-react";

import saraAvatar from "../assets/sara-avatar.png";
import youssefAvatar from "../assets/youssef-avatar.png";
import typingSound from "../assets/typing.mp3";

const CHAT_MESSAGES = [
  {
    side: "left",
    name: "Sara",
    text: "I've been waiting 2 hours at the clinic 😭",
    time: "10:14 AM",
    avatar: saraAvatar,
  },
  {
    side: "right",
    name: "Youssef",
    text: "No way. Why didn’t you book first?",
    time: "10:15 AM",
    avatar: youssefAvatar,
  },
  {
    side: "left",
    name: "Sara",
    text: "Book where?? Nobody answers the phone 😩",
    time: "10:17 AM",
    avatar: saraAvatar,
  },
  {
    side: "right",
    name: "Youssef",
    text: "Use Nobty. It makes booking way easier.",
    time: "10:19 AM",
    avatar: youssefAvatar,
  },
  {
    side: "left",
    name: "Sara",
    text: "Okay wait… where has this been all my life?",
    time: "10:20 AM",
    avatar: saraAvatar,
  },
];

const MESSAGE_STEP_MS = 3200;
const TYPING_OFFSET_MS = 1400;

export default function AnimatedChat() {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [readStatus, setReadStatus] = useState("");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const audioUnlockedRef = useRef(false);
  const typingAudioRef = useRef(null);
  const timersRef = useRef([]);
  const messagesAreaRef = useRef(null);

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const unlockAudio = async () => {
    if (audioUnlockedRef.current) return;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        audioUnlockedRef.current = true;
        return;
      }

      const ctx = new AudioContextClass();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 440;
      gain.gain.value = 0.0001;

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.01);

      audioUnlockedRef.current = true;
      await ctx.close();
    } catch (error) {
      console.error("Audio unlock failed:", error);
    }
  };

  const startTypingSound = () => {
    if (!audioUnlockedRef.current || !typingAudioRef.current) return;

    try {
      typingAudioRef.current.currentTime = 0;
      typingAudioRef.current.play().catch(() => {});
    } catch (error) {
      console.error("Typing sound failed:", error);
    }
  };

  const stopTypingSound = () => {
    if (!typingAudioRef.current) return;

    try {
      typingAudioRef.current.pause();
      typingAudioRef.current.currentTime = 0;
    } catch (error) {
      console.error("Stop typing sound failed:", error);
    }
  };

  const playSaraSendSound = () => {
    if (!audioUnlockedRef.current) return;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "triangle";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(760, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(1020, ctx.currentTime + 0.05);

      osc2.frequency.setValueAtTime(980, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.09);
      osc2.stop(ctx.currentTime + 0.09);

      osc2.onended = () => {
        ctx.close();
      };
    } catch (error) {
      console.error("Sara send sound failed:", error);
    }
  };

  const playYoussefReceiveSound = () => {
    if (!audioUnlockedRef.current) return;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(980, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.09);

      osc2.frequency.setValueAtTime(1320, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.14);
      osc2.stop(ctx.currentTime + 0.14);

      osc2.onended = () => {
        ctx.close();
      };
    } catch (error) {
      console.error("Youssef receive sound failed:", error);
    }
  };

  useEffect(() => {
    try {
      typingAudioRef.current = new Audio(typingSound);
      typingAudioRef.current.loop = true;
      typingAudioRef.current.volume = 0.18;
    } catch (error) {
      console.error("Typing audio init failed:", error);
    }

    const enableAudio = async () => {
      setHasUserInteracted(true);
      await unlockAudio();
    };

    window.addEventListener("click", enableAudio, { once: true });
    window.addEventListener("touchstart", enableAudio, { once: true });

    return () => {
      stopTypingSound();
      clearAllTimers();
      window.removeEventListener("click", enableAudio);
      window.removeEventListener("touchstart", enableAudio);
    };
  }, []);

  useEffect(() => {
    clearAllTimers();
    stopTypingSound();
    setVisibleMessages([]);
    setTypingUser(null);
    setReadStatus("");

    CHAT_MESSAGES.forEach((msg, index) => {
      const isFirst = index === 0;
      const typingStart = isFirst ? null : index * MESSAGE_STEP_MS - TYPING_OFFSET_MS;
      const messageShow = index * MESSAGE_STEP_MS;

      if (!isFirst) {
        timersRef.current.push(
          setTimeout(() => {
            setTypingUser(msg.side);

            if (msg.side === "right" && hasUserInteracted) {
              startTypingSound();
            }
          }, typingStart)
        );
      }

      timersRef.current.push(
        setTimeout(() => {
          setTypingUser(null);

          if (msg.side === "right") {
            stopTypingSound();
          }

          setVisibleMessages((prev) => [...prev, msg]);

          if (hasUserInteracted) {
            if (msg.side === "left") {
              playSaraSendSound();
            } else {
              playYoussefReceiveSound();
            }
          }

          if (index === CHAT_MESSAGES.length - 1) {
            setReadStatus("Seen 10:21 AM");
          }
        }, messageShow)
      );
    });

    return () => {
      stopTypingSound();
      clearAllTimers();
    };
  }, [hasUserInteracted]);

  useEffect(() => {
    if (!messagesAreaRef.current) return;

    messagesAreaRef.current.scrollTo({
      top: messagesAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessages, typingUser, readStatus]);

  const typingLabel =
    typingUser === "left"
      ? "Sara is typing..."
      : typingUser === "right"
      ? "Youssef is typing..."
      : "";

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="rounded-[2.2rem] border border-white/15 bg-[#071735]/80 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-[#02122d] via-[#031a42] to-[#072a63]">
          <div className="flex items-center justify-between px-6 pt-4 text-white/90">
            <span className="text-lg font-medium">2:38 PM</span>
            <div className="flex items-center gap-2 text-sm">
              <span>5G</span>
              <span className="rounded border border-white/30 px-1 text-xs">
                84
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between border-b border-white/10 px-5 pb-4">
            <div className="flex items-center gap-4">
              <button className="text-white/85">
                <ArrowLeft size={26} />
              </button>

              <img
                src={saraAvatar}
                alt="Sara"
                className="h-14 w-14 rounded-full border-2 border-white/20 object-cover"
              />

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold text-white">Sara</p>
                  <span className="h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-[#072a63]" />
                </div>
                <p className="text-base text-white/55">Active Now</p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-white/80">
              <Phone size={24} />
              <Video size={24} />
            </div>
          </div>

          <div
            ref={messagesAreaRef}
            className="max-h-[500px] space-y-6 overflow-y-auto px-5 py-6"
          >
            {visibleMessages.map((msg, index) => (
              <div key={`${msg.time}-${index}`}>
                {msg.side === "left" ? (
                  <div className="flex items-end gap-3">
                    <img
                      src={msg.avatar}
                      alt={msg.name}
                      className="h-11 w-11 rounded-full border border-white/15 object-cover"
                    />

                    <div className="max-w-[70%]">
                      <div className="rounded-[1.8rem] rounded-bl-md bg-white/18 px-5 py-3 text-[1.05rem] leading-7 text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-md">
                        {msg.text}
                      </div>
                    </div>

                    <span className="pb-2 text-sm text-white/45">
                      {msg.time}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-end justify-end gap-3">
                    <span className="pb-2 text-sm text-white/45">
                      {msg.time}
                    </span>

                    <div className="max-w-[70%]">
                      <div className="rounded-[1.8rem] rounded-br-md bg-gradient-to-r from-[#2d8cff] to-[#4aa7ff] px-5 py-3 text-[1.05rem] leading-7 text-white shadow-[0_0_25px_rgba(72,154,255,0.55)]">
                        {msg.text.includes("Use Nobty") ? (
                          <>
                            Use <span className="font-bold">Nobty</span>. It
                            makes booking way easier.
                          </>
                        ) : (
                          msg.text
                        )}
                      </div>

                      {index === visibleMessages.length - 1 &&
                        msg.side === "right" && (
                          <p className="mt-2 text-right text-xs text-[#8fc2ff]">
                            Delivered
                          </p>
                        )}
                    </div>

                    <img
                      src={msg.avatar}
                      alt={msg.name}
                      className="h-11 w-11 rounded-full border border-white/15 object-cover"
                    />
                  </div>
                )}
              </div>
            ))}

            {typingUser && (
              <div
                className={
                  typingUser === "right"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div className="max-w-[70%]">
                  <div
                    className={`rounded-[1.8rem] px-5 py-4 ${
                      typingUser === "right"
                        ? "rounded-br-md bg-gradient-to-r from-[#2d8cff] to-[#4aa7ff] shadow-[0_0_25px_rgba(72,154,255,0.45)]"
                        : "rounded-bl-md bg-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className={`h-2.5 w-2.5 animate-bounce rounded-full ${
                          typingUser === "right" ? "bg-white/95" : "bg-white/80"
                        }`}
                      />
                      <span
                        className={`h-2.5 w-2.5 animate-bounce rounded-full ${
                          typingUser === "right" ? "bg-white/95" : "bg-white/80"
                        }`}
                      />
                      <span
                        className={`h-2.5 w-2.5 animate-bounce rounded-full ${
                          typingUser === "right" ? "bg-white/95" : "bg-white/80"
                        }`}
                      />
                    </div>
                  </div>

                  <p
                    className={`mt-2 text-xs ${
                      typingUser === "right"
                        ? "text-right text-[#8fc2ff]"
                        : "text-left text-white/55"
                    }`}
                  >
                    {typingLabel}
                  </p>
                </div>
              </div>
            )}

            {readStatus && !typingUser && (
              <div className="flex justify-end">
                <p className="text-xs text-[#8fc2ff]">{readStatus}</p>
              </div>
            )}
          </div>

          <div className="px-5 pb-5">
            <div className="flex items-center gap-3">
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur">
                <Camera size={22} />
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur">
                <Plus size={24} />
              </button>

              <div className="flex flex-1 items-center rounded-full bg-white/10 px-5 py-3 text-white/45 backdrop-blur">
                <span className="flex-1 text-lg">Message...</span>
                <Smile size={22} className="mr-3" />
              </div>

              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur">
                <Mic size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}