/**
 * Patient Chat Page
 * Real-time chat with support staff
 */

import { useEffect, useState, useRef } from 'react';
import { chatApi } from '../../api/patient/chatApi';
import usePatientStore from '../../store/usePatientStore';
import toast from 'react-hot-toast';
import { FaPaperPlane, FaUser } from 'react-icons/fa';

const Chat = () => {
  const { chatMessages, supportAgents, setChatMessages, setSupportAgents, addChatMessage } = usePatientStore();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    loadChatData();
    // TODO: Set up WebSocket connection for real-time messages
    // const socket = io(API_URL);
    // socket.on('message', (newMessage) => {
    //   addChatMessage(newMessage);
    // });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatData = async () => {
    try {
      setLoading(true);
      const [messagesRes, agentsRes] = await Promise.all([
        chatApi.getMessages({ page: 1, limit: 100 }),
        chatApi.getSupportAgents()
      ]);

      setChatMessages(messagesRes.data.data || []);
      setSupportAgents(agentsRes.data.data || []);
    } catch (error) {
      toast.error('Error loading chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      const res = await chatApi.sendMessage({ message });
      addChatMessage(res.data.data);
      setMessage('');
      
      // TODO: Emit WebSocket event
      // socket.emit('sendMessage', res.data.data);
    } catch (error) {
      toast.error('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Chat Support</h1>
        {supportAgents.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {supportAgents.length} support agent(s) available
          </p>
        )}
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 bg-white rounded-lg shadow border overflow-y-auto p-4 mb-4"
      >
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="mb-2">No messages yet</p>
              <p className="text-sm">Start a conversation with our support team</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderType === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.senderType === 'patient'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {msg.senderType !== 'patient' && (
                      <FaUser className="text-xs" />
                    )}
                    <span className="text-xs opacity-75">
                      {msg.senderType === 'patient' ? 'You' : 'Support'}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <FaPaperPlane />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

export default Chat;

