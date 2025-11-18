import React, { useState, useEffect, useMemo } from 'react';
import type { Client, Lawyer, User, Case, Chat, ChatMessage, ClientRequest, LawyerUpPost, Notification, NewsArticle, LawyerUpComment } from './types';
import { UserRole } from './types';
import { DUMMY_CLIENTS, DUMMY_LAWYERS, DUMMY_CASES, DUMMY_CHATS, DUMMY_CLIENT_REQUESTS, DUMMY_LAWYERUP_POSTS } from './constants';
import AuthScreen from './components/AuthScreen';
import ClientDashboard from './components/ClientDashboard';
import LawyerDashboard from './components/LawyerDashboard';

const App: React.FC = () => {
    const [clients, setClients] = useState<Client[]>(DUMMY_CLIENTS);
    const [lawyers, setLawyers] = useState<Lawyer[]>(DUMMY_LAWYERS);
    const [cases, setCases] = useState<Case[]>(DUMMY_CASES);
    const [chats, setChats] = useState<Chat[]>(DUMMY_CHATS);
    const [clientRequests, setClientRequests] = useState<ClientRequest[]>(DUMMY_CLIENT_REQUESTS);
    const [lawyerUpPosts, setLawyerUpPosts] = useState<LawyerUpPost[]>(DUMMY_LAWYERUP_POSTS);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [news, setNews] = useState<NewsArticle[]>([]);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    const currentUserWithRole = useMemo(() => {
        if (!currentUser || userRole === UserRole.NONE) return null;
        return { ...currentUser, role: userRole };
    }, [currentUser, userRole]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const addNotification = (userId: string, message: string) => {
        const newNotif: Notification = {
            id: `notif-${Date.now()}`,
            userId,
            message,
            timestamp: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const handleLogin = (user: User, role: UserRole) => {
        setCurrentUser(user);
        setUserRole(role);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setUserRole(UserRole.NONE);
    };

    const handleRegister = (user: Client | Lawyer, role: UserRole) => {
        if (role === UserRole.CLIENT) {
            setClients(prev => [...prev, user as Client]);
        } else {
            setLawyers(prev => [...prev, user as Lawyer]);
        }
        setCurrentUser(user);
        setUserRole(role);
    };

    const handleUpdateProfile = (updatedUser: User) => {
        const { id, name, profilePicUrl } = updatedUser;
        if (userRole === UserRole.CLIENT) {
            setClients(prev => prev.map(c => c.id === id ? updatedUser as Client : c));
        } else {
            setLawyers(prev => prev.map(l => l.id === id ? updatedUser as Lawyer : l));
        }
        setCurrentUser(updatedUser);
        setClientRequests(prev => prev.map(req => {
            if (req.client.id === id) req.client = { ...req.client, name, profilePicUrl };
            if (req.lawyer.id === id) req.lawyer = { ...req.lawyer, name, profilePicUrl };
            return req;
        }));
        setChats(prev => prev.map(chat => {
            if (chat.participantIds.includes(id)) {
                chat.participants[id] = { name, profilePicUrl };
            }
            return { ...chat };
        }));
        setLawyerUpPosts(prev => prev.map(post => {
            if (post.lawyerId === id) {
                post.lawyerName = name;
                post.lawyerProfilePicUrl = profilePicUrl;
            }
            post.comments.forEach(comment => {
                if (comment.commenter.id === id) {
                    comment.commenter.name = name;
                    comment.commenter.profilePicUrl = profilePicUrl;
                }
            });
            return post;
        }));
    };
    
    const handleSendRequest = (lawyer: Lawyer, client: Client) => {
        const existingRequest = clientRequests.find(r => r.client.id === client.id && r.lawyer.id === lawyer.id && (r.status === 'pending' || r.status === 'accepted'));
        if (existingRequest) {
            alert(`You already have a ${existingRequest.status} request with this lawyer.`);
            return;
        }

        if (!client.currentCase) {
            alert("No case details found for the client."); return;
        }
        const newRequest: ClientRequest = {
            id: `req-${Date.now()}`,
            client: { id: client.id, name: client.name, profilePicUrl: client.profilePicUrl },
            lawyer: { id: lawyer.id, name: lawyer.name, profilePicUrl: lawyer.profilePicUrl },
            caseDetails: client.currentCase,
            status: 'pending',
        };
        setClientRequests(prev => [newRequest, ...prev]);
        addNotification(client.id, `Your request to ${lawyer.name} has been sent successfully.`);
        addNotification(lawyer.id, `You have a new client request from ${client.name}.`);
    };

    const handleAcceptRequest = (request: ClientRequest) => {
        const lawyer = lawyers.find(l => l.id === request.lawyer.id);
        const client = clients.find(c => c.id === request.client.id);
        if (!lawyer || !client) return;
        setClientRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'accepted' } : r));
        const newCase: Case = {
            id: `case-${Date.now()}`, clientId: client.id, lawyerId: lawyer.id, ...request.caseDetails, status: 'active',
        };
        setCases(prev => [...prev, newCase]);
        const newChat: Chat = {
            id: `chat-${request.id}`, participantIds: [client.id, lawyer.id],
            participants: {
                [client.id]: { name: client.name, profilePicUrl: client.profilePicUrl },
                [lawyer.id]: { name: lawyer.name, profilePicUrl: lawyer.profilePicUrl }
            },
            messages: [],
        };
        setChats(prev => [...prev, newChat]);
        addNotification(lawyer.id, `You have accepted the case from ${client.name}.`);
        addNotification(client.id, `${lawyer.name} has accepted your request. You can now chat with them.`);
    };

    const handleRejectRequest = (request: ClientRequest) => {
        setClientRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'rejected' } : r));
        addNotification(request.client.id, `Your request to ${request.lawyer.name} was not accepted.`);
    };

    const handleCancelRequest = (request: ClientRequest) => {
        setClientRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'cancelled' } : r));
        addNotification(request.lawyer.id, `${request.client.name} has cancelled their request.`);
    };
    
    const handleSendMessage = (chatId: string, message: ChatMessage) => {
        setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat));
    };

    const handleAddLawyerUpPost = (post: LawyerUpPost) => {
        setLawyerUpPosts(prev => [post, ...prev]);
    };

    const handleLikePost = (postId: string) => {
        if (!currentUser) return;
        setLawyerUpPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const isLiked = post.likes.includes(currentUser.id);
                const newLikes = isLiked ? post.likes.filter(id => id !== currentUser.id) : [...post.likes, currentUser.id];
                return { ...post, likes: newLikes };
            }
            return post;
        }));
    };

    const handleAddComment = (postId: string, text: string) => {
        if (!currentUserWithRole) return;
        const newComment: LawyerUpComment = {
            id: `c-${Date.now()}`,
            text,
            timestamp: new Date(),
            commenter: {
                id: currentUserWithRole.id,
                name: currentUserWithRole.name,
                profilePicUrl: currentUserWithRole.profilePicUrl,
                role: currentUserWithRole.role,
            },
        };
        setLawyerUpPosts(prev => prev.map(post => post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post));
    };
    
    const handleMarkNotificationsAsRead = (userId: string) => {
        setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
    };

    const renderContent = () => {
        if (!currentUserWithRole) {
            return (
                <AuthScreen 
                    onLogin={handleLogin} 
                    onRegister={handleRegister}
                    clients={clients}
                    lawyers={lawyers}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            );
        }

        const userNotifications = notifications.filter(n => n.userId === currentUser.id);

        if (userRole === UserRole.CLIENT) {
            return (
                <ClientDashboard 
                    client={currentUser as Client} 
                    onLogout={handleLogout}
                    onUpdateProfile={handleUpdateProfile}
                    allLawyers={lawyers}
                    clientCases={cases.filter(c => c.clientId === currentUser.id)}
                    clientChats={chats.filter(c => c.participantIds.includes(currentUser.id))}
                    onSendMessage={handleSendMessage}
                    onSendRequest={(lawyer) => handleSendRequest(lawyer, currentUser as Client)}
                    notifications={userNotifications}
                    onMarkNotificationsAsRead={() => handleMarkNotificationsAsRead(currentUser.id)}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    newsArticles={news}
                    setNewsArticles={setNews}
                    clientRequests={clientRequests.filter(r => r.client.id === currentUser.id)}
                    onCancelRequest={handleCancelRequest}
                    lawyerUpPosts={lawyerUpPosts}
                    currentUser={currentUserWithRole}
                    onLikePost={handleLikePost}
                    onAddComment={handleAddComment}
                />
            );
        }

        if (userRole === UserRole.LAWYER) {
            return (
                <LawyerDashboard
                    lawyer={currentUser as Lawyer}
                    onLogout={handleLogout}
                    onUpdateProfile={handleUpdateProfile}
                    clientRequests={clientRequests.filter(r => r.lawyer.id === currentUser.id)}
                    onAcceptRequest={handleAcceptRequest}
                    onRejectRequest={handleRejectRequest}
                    activeCases={cases.filter(c => c.lawyerId === currentUser.id && c.status === 'active')}
                    lawyerChats={chats.filter(c => c.participantIds.includes(currentUser.id))}
                    onSendMessage={handleSendMessage}
                    lawyerUpPosts={lawyerUpPosts}
                    onAddLawyerUpPost={handleAddLawyerUpPost}
                    notifications={userNotifications}
                    onMarkNotificationsAsRead={() => handleMarkNotificationsAsRead(currentUser.id)}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    newsArticles={news}
                    setNewsArticles={setNews}
                    allClients={clients}
                    currentUser={currentUserWithRole}
                    onLikePost={handleLikePost}
                    onAddComment={handleAddComment}
                />
            );
        }
        
        return <div>Error: Unknown user role.</div>
    };

    return (
        <div className="min-h-screen font-sans">
            {renderContent()}
        </div>
    );
};

export default App;