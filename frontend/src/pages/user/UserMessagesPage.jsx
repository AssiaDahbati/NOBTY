import React, { useEffect, useMemo, useState } from "react";
import {
  getMyMessages,
  markReplyAsSeen,
} from "../../services/userMessageService";

export default function UserMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMyMessages();
      setMessages(data);

      if (data.length && !selected) {
        setSelected(data[0]);
      }
    } catch (error) {
      console.error("Fetch my messages error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelect = async (msg) => {
    setSelected(msg);

    if (msg.adminReply && !msg.userHasSeenReply) {
      try {
        await markReplyAsSeen(msg._id);

        setMessages((prev) =>
          prev.map((item) =>
            item._id === msg._id
              ? { ...item, userHasSeenReply: true }
              : item
          )
        );

        setSelected((prev) =>
          prev ? { ...prev, userHasSeenReply: true } : prev
        );
      } catch (error) {
        console.error("Mark seen error:", error);
      }
    }
  };

  const filteredMessages = useMemo(() => {
    let list = [...messages];

    if (filter === "replied") {
      list = list.filter((m) => m.adminReply);
    }

    if (filter === "pending") {
      list = list.filter((m) => !m.adminReply);
    }

    if (filter === "unreadReplies") {
      list = list.filter((m) => m.adminReply && !m.userHasSeenReply);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.subject?.toLowerCase().includes(q) ||
          m.message?.toLowerCase().includes(q) ||
          m.adminReply?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [messages, filter, search]);

  const stats = useMemo(() => {
    return {
      total: messages.length,
      replied: messages.filter((m) => m.adminReply).length,
      pending: messages.filter((m) => !m.adminReply).length,
      unreadReplies: messages.filter((m) => m.adminReply && !m.userHasSeenReply)
        .length,
    };
  }, [messages]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">My Messages</h1>
                <p className="text-sm text-slate-500">
                  View your contact requests and admin replies
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:w-72"
                />

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    onClick={() => setFilter("all")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      filter === "all"
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("unreadReplies")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      filter === "unreadReplies"
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    New Replies
                  </button>
                  <button
                    onClick={() => setFilter("replied")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      filter === "replied"
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Replied
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12">
            <div className="xl:col-span-7 border-r border-slate-200 bg-slate-50/60">
              <div className="p-4 md:p-6">
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 p-5 text-white shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm opacity-90">NOBTY Messages</p>
                      <h2 className="text-xl font-semibold">
                        Stay updated with admin responses
                      </h2>
                      <p className="mt-1 text-sm text-blue-100">
                        Track the status of your requests and read replies in one place.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-3 md:px-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Total Messages</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-800">
                    {stats.total}
                  </h3>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm text-slate-500">New Replies</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-800">
                    {stats.unreadReplies}
                  </h3>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Pending</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-800">
                    {stats.pending}
                  </h3>
                </div>
              </div>

              <div className="px-4 pb-6 md:px-6">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <div className="col-span-4">Subject</div>
                    <div className="col-span-4">Your Message</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Date</div>
                  </div>

                  {loading ? (
                    <div className="p-6 text-sm text-slate-500">Loading messages...</div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        ✉️
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700">
                        No messages yet
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Your contact requests and replies will appear here.
                      </p>
                    </div>
                  ) : (
                    filteredMessages.map((msg) => {
                      const isActive = selected?._id === msg._id;

                      return (
                        <button
                          key={msg._id}
                          onClick={() => handleSelect(msg)}
                          className={`grid w-full grid-cols-12 items-center border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-50 ${
                            isActive
                              ? "bg-blue-50 border-l-4 border-blue-600"
                              : "bg-white"
                          }`}
                        >
                          <div className="col-span-4">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {msg.subject}
                            </p>
                          </div>

                          <div className="col-span-4 pr-3">
                            <p className="truncate text-xs text-slate-500">
                              {msg.message}
                            </p>
                          </div>

                          <div className="col-span-2">
                            {!msg.adminReply ? (
                              <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                                Pending
                              </span>
                            ) : !msg.userHasSeenReply ? (
                              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                                New Reply
                              </span>
                            ) : (
                              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                Replied
                              </span>
                            )}
                          </div>

                          <div className="col-span-2 text-right text-xs text-slate-500">
                            {formatDate(msg.createdAt)}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="xl:col-span-5 bg-white">
              <div className="h-full p-4 md:p-6">
                {!selected ? (
                  <div className="flex h-full min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                    Select a message to view details
                  </div>
                ) : (
                  <div className="flex h-full flex-col">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <h2 className="text-lg font-semibold text-slate-800">
                        {selected.subject}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Sent on {formatDate(selected.createdAt)}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {!selected.adminReply ? (
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                            Waiting for reply
                          </span>
                        ) : !selected.userHasSeenReply ? (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            New admin reply
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Replied
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Your message
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                        {selected.message}
                      </p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Admin reply
                      </p>

                      {selected.adminReply ? (
                        <>
                          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                            {selected.adminReply}
                          </p>
                          {selected.repliedAt && (
                            <p className="mt-3 text-xs text-slate-500">
                              Replied on {formatDate(selected.repliedAt)}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="mt-3 text-sm text-slate-500">
                          No reply yet. Our team will get back to you soon.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}