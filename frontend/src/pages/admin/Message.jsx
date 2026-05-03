import { useEffect, useState } from "react";
import axios from "axios";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact");
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/contact/${id}/read`);
      fetchMessages();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading messages...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-[#132249]">
        Contact Messages
      </h1>

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Type</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Message</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="border-t align-top">
                <td className="p-4 font-medium">{msg.name}</td>
                <td className="p-4">{msg.email}</td>
                <td className="p-4">{msg.phone}</td>
                <td className="p-4 capitalize">{msg.contactType}</td>
                <td className="p-4">{msg.subject}</td>
                <td className="p-4 max-w-[280px]">{msg.message}</td>
                <td className="p-4">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {msg.isRead ? (
                    <span className="font-medium text-green-600">Read</span>
                  ) : (
                    <span className="font-medium text-red-500">New</span>
                  )}
                </td>
                <td className="p-4">
                  {!msg.isRead && (
                    <button
                      onClick={() => markAsRead(msg._id)}
                      className="rounded-lg bg-[#132249] px-3 py-2 text-sm text-white"
                    >
                      Mark as read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}