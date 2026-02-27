// import { useState } from "react";
// import axios from "axios";

// const StudentChatbot = () => {
//   const [input, setInput] = useState("");
//   const [chat, setChat] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const newMessage = { sender: "student", text: input };
//     setChat([...chat, newMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await axios.post("http://localhost:5000/api/chatbot", {
//         message: newMessage.text,
//       });

//       const botMessage = { sender: "bot", text: res.data.reply || "No response" };
//       setChat((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error("❌ Chatbot error:", error);
//       setChat((prev) => [...prev, { sender: "bot", text: "Error connecting to chatbot" }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-purple-100">
//       <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-xl">
//         <h2 className="text-2xl font-bold mb-4">🤖 Student Chatbot</h2>

//         <div className="h-96 overflow-y-auto border p-4 rounded-lg mb-4 bg-gray-50 space-y-2">
//           {chat.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`p-2 rounded-lg max-w-xs ${
//                 msg.sender === "student"
//                   ? "bg-indigo-100 self-end ml-auto text-right"
//                   : "bg-green-100 self-start mr-auto text-left"
//               }`}
//             >
//               <p className="text-sm">{msg.text}</p>
//             </div>
//           ))}
//           {loading && <p className="text-gray-500 text-sm">Bot is typing...</p>}
//         </div>

//         <form onSubmit={sendMessage} className="flex gap-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
//             placeholder="Ask your query..."
//           />
//           <button
//             type="submit"
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentChatbot;


import { useState } from "react";
import axios from "axios";
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LogoutButton from '../components/ui/LogoutButton';

const StudentChatbot = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: "student", text: input };
    setChat((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      // ✅ Get userId from localStorage (after login)
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      const res = await axios.post("http://localhost:5001/chat", {
        message: newMessage.text,
        userId, // ✅ send userId
      });

      const botMessage = {
        sender: "bot",
        text: res.data.reply || "No response",
      };
      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ Chatbot error:", error);
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to chatbot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-canvas to-neutral-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">🤖 Student Assistant</h1>
            <p className="text-neutral-600 mt-2">Get instant help with lab-related questions and issues</p>
          </div>
          <LogoutButton />
        </div>

        {/* Chat Container */}
        <Card className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chat.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👋</div>
                <h3 className="text-lg font-semibold text-ink mb-2">Welcome to LabCare Assistant!</h3>
                <p className="text-neutral-600">Ask me anything about lab equipment, procedures, or report issues.</p>
                <div className="mt-6 space-y-2 text-sm text-neutral-500">
                  <p>💡 Try asking: "How do I report a fault?"</p>
                  <p>💡 Or: "What equipment is available in Lab 1?"</p>
                </div>
              </div>
            ) : (
              chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.sender === "student"
                        ? "bg-brand-600 text-white rounded-br-sm"
                        : "bg-neutral-100 text-ink rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 text-ink px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t border-neutral-200 p-4">
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 lc-input"
                placeholder="Ask your question..."
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </form>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-ink mb-4">💡 Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="ghost"
              onClick={() => setInput("How do I report a fault?")}
              className="text-left justify-start h-auto p-4"
            >
              <div>
                <div className="font-medium">Report Fault</div>
                <div className="text-sm text-neutral-500">Learn how to report equipment issues</div>
              </div>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setInput("What equipment is available?")}
              className="text-left justify-start h-auto p-4"
            >
              <div>
                <div className="font-medium">Equipment Info</div>
                <div className="text-sm text-neutral-500">Check available lab equipment</div>
              </div>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setInput("Lab procedures and guidelines")}
              className="text-left justify-start h-auto p-4"
            >
              <div>
                <div className="font-medium">Lab Guidelines</div>
                <div className="text-sm text-neutral-500">Safety and procedure information</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentChatbot;
