import React, { useState, useEffect, useRef } from 'react';
import type { Chat, ChatMessage, User } from '../types';
import { SendIcon } from './icons';

interface ChatComponentProps {
    currentUser: User;
    chats: Chat[];
    onSendMessage: (chatId: string, message: ChatMessage) => void;
    allUsers: User[];
    preselectedChatId?: string | null;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ currentUser, chats, onSendMessage, allUsers, preselectedChatId }) => {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    
    useEffect(() => {
        if (preselectedChatId) {
            setActiveChatId(preselectedChatId);
        } else if (!activeChatId && chats.length > 0) {
            setActiveChatId(chats[0].id);
        }
    }, [preselectedChatId, chats, activeChatId]);

    const activeChat = chats.find(c => c.id === activeChatId);

    const getOtherParticipantInfo = (chat: Chat) => {
        const otherId = chat.participantIds.find(id => id !== currentUser.id);
        if (!otherId) return null;
        return chat.participants[otherId] || null;
    };

    const activeChatParticipant = activeChat ? getOtherParticipantInfo(activeChat) : null;

    const handleSend = () => {
        if (!newMessage.trim() || !activeChatId) return;
        const receiverId = activeChat?.participantIds.find(id => id !== currentUser.id) || '';
        const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            receiverId: receiverId,
            text: newMessage,
            timestamp: new Date(),
        };
        onSendMessage(activeChatId, message);
        setNewMessage('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChat?.messages]);

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-xl overflow-hidden">
            {/* Conversation List */}
            <div className="w-1/3 border-r border-light-accent dark:border-dark-accent flex flex-col">
                <h2 className="text-2xl font-bold p-4 border-b border-light-accent dark:border-dark-accent flex-shrink-0 text-light-text-primary dark:text-dark-text-primary">Conversations</h2>
                <div className="flex-1 overflow-y-auto">
                    {chats.map(chat => {
                        const otherUser = getOtherParticipantInfo(chat);
                        if (!otherUser) return null;
                        return (
                            <button 
                                key={chat.id} 
                                onClick={() => setActiveChatId(chat.id)}
                                className={`w-full text-left p-4 flex items-center space-x-3 transition-colors ${activeChatId === chat.id ? 'bg-indigo-600/20 dark:bg-indigo-600/40' : 'hover:bg-light-primary dark:hover:bg-dark-primary'}`}
                            >
                                <img src={otherUser.profilePicUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${otherUser.name}`} alt={otherUser.name} className="w-12 h-12 rounded-full object-cover"/>
                                <div>
                                    <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">{otherUser.name}</p>
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">{chat.messages[chat.messages.length - 1]?.text || 'No messages yet'}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-2/3 flex flex-col">
                {activeChat && activeChatParticipant ? (
                    <>
                        <div className="p-4 border-b border-light-accent dark:border-dark-accent flex items-center space-x-3 flex-shrink-0">
                            <img src={activeChatParticipant.profilePicUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${activeChatParticipant.name}`} alt={activeChatParticipant.name} className="w-12 h-12 rounded-full object-cover"/>
                            <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">{activeChatParticipant.name}</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {activeChat.messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-md p-3 rounded-2xl ${msg.senderId === currentUser.id ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-light-primary dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary rounded-bl-none'}`}>
                                        <p>{msg.text}</p>
                                        <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))}
                             <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t border-light-accent dark:border-dark-accent flex space-x-2 flex-shrink-0">
                            <input 
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 bg-light-primary dark:bg-dark-primary border border-light-accent dark:border-dark-accent rounded-full py-2 px-4 text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button onClick={handleSend} className="bg-indigo-600 w-12 h-12 rounded-full hover:bg-indigo-700 transition-colors flex items-center justify-center flex-shrink-0">
                                <SendIcon className="w-6 h-6 text-white"/>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">Select a conversation to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatComponent;