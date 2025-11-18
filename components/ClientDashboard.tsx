import React, { useState, useEffect, useMemo } from 'react';
import type { Client, Lawyer, Case, Chat, ChatMessage, Notification, NewsArticle, ClientRequest, LawyerUpPost } from '../types';
import { BriefcaseIcon, MessageIcon, NewspaperIcon, RobotIcon, UserIcon, LogoutIcon, JusticeScaleIcon, SunIcon, MoonIcon, PaperAirplaneIcon, UsersIcon } from './icons';
import LawyerCard from './LawyerCard';
import LawyerProfileModal from './LawyerProfileModal';
import { getAIRecommendations, getAINews, getLawBotResponse } from '../services/geminiService';
import ClientProfile from './ClientProfile';
import ClientCases from './ClientCases';
import ChatComponent from './Chat';
import NotificationBell from './NotificationBell';
import NewsCard from './NewsCard';
import NewsModal from './NewsModal';
import Spinner from './Spinner';
import ClientRequests from './ClientRequests';
import LawyerUpFeed from './LawyerUpFeed';

interface ClientDashboardProps {
    client: Client;
    onLogout: () => void;
    onUpdateProfile: (updatedClient: Client) => void;
    allLawyers: Lawyer[];
    clientCases: Case[];
    clientChats: Chat[];
    onSendMessage: (chatId: string, message: ChatMessage) => void;
    onSendRequest: (lawyer: Lawyer) => void;
    notifications: Notification[];
    onMarkNotificationsAsRead: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    newsArticles: NewsArticle[];
    setNewsArticles: (articles: NewsArticle[]) => void;
    clientRequests: ClientRequest[];
    onCancelRequest: (request: ClientRequest) => void;
    lawyerUpPosts: LawyerUpPost[];
    currentUser: (Client | Lawyer) & { role: string };
    onLikePost: (postId: string) => void;
    onAddComment: (postId: string, text: string) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = (props) => {
    const { client, onLogout, onUpdateProfile, allLawyers, clientCases, clientChats, onSendMessage, onSendRequest, notifications, onMarkNotificationsAsRead, theme, toggleTheme, newsArticles, setNewsArticles, clientRequests, onCancelRequest, lawyerUpPosts, currentUser, onLikePost, onAddComment } = props;

    const [activeTab, setActiveTab] = useState('browse');
    const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
    const [recommendedLawyers, setRecommendedLawyers] = useState<{ lawyerId: string; rank: number }[]>([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState(false);
    
    // News state
    const [isLoadingNews, setIsLoadingNews] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
    const [newsCategory, setNewsCategory] = useState('All');

    // LawBot state
    const [lawBotHistory, setLawBotHistory] = useState<{ role: 'user' | 'model', parts: {text: string}[] }[]>([]);
    const [lawBotMessages, setLawBotMessages] = useState<ChatMessage[]>([]);
    const [botInput, setBotInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);

    // Chat state
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    useEffect(() => {
        const caseDetails = client.currentCase;
        if (caseDetails && caseDetails.description !== 'none' && activeTab === 'browse' && recommendedLawyers.length === 0 && allLawyers.length > 0) {
            setIsLoadingRecs(true);
            getAIRecommendations(caseDetails, allLawyers)
                .then(setRecommendedLawyers)
                .finally(() => setIsLoadingRecs(false));
        }
    }, [client.currentCase, activeTab, allLawyers, recommendedLawyers]);
    
    useEffect(() => {
        if(activeTab === 'news' && newsArticles.length === 0) {
            setIsLoadingNews(true);
            getAINews().then(setNewsArticles).finally(() => setIsLoadingNews(false));
        }
    }, [activeTab, newsArticles, setNewsArticles]);


    const sortedLawyers = useMemo(() => {
        const recMap = new Map(recommendedLawyers.map(r => [r.lawyerId, r.rank]));
        return [...allLawyers].sort((a, b) => {
            const rankA = recMap.get(a.id);
            const rankB = recMap.get(b.id);
            if (rankA && rankB) return rankA - rankB;
            if (rankA) return -1;
            if (rankB) return 1;
            return b.experienceYears - a.experienceYears;
        });
    }, [recommendedLawyers, allLawyers]);
    
    const newsCategories = useMemo(() => ['All', ...Array.from(new Set(newsArticles.map(a => a.category)))], [newsArticles]);
    const filteredNews = useMemo(() => newsCategory === 'All' ? newsArticles : newsArticles.filter(a => a.category === newsCategory), [newsArticles, newsCategory]);

    const handleSendBotMessage = async () => {
        if (!botInput.trim() || isBotTyping) return;
        const userMessage: ChatMessage = { id: Date.now().toString(), senderId: client.id, receiverId: 'LAWBOT', text: botInput, timestamp: new Date() };
        setLawBotMessages(prev => [...prev, userMessage]);
        
        const currentInput = botInput;
        setBotInput('');
        setIsBotTyping(true);
        
        const newHistory = [...lawBotHistory, { role: 'user' as const, parts: [{text: currentInput}] }];
        const botResponseText = await getLawBotResponse(newHistory);
        
        const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), senderId: 'LAWBOT', receiverId: client.id, text: botResponseText, timestamp: new Date() };
        setLawBotMessages(prev => [...prev, botMessage]);
        setLawBotHistory([...newHistory, {role: 'model' as const, parts: [{text: botResponseText}]}]);
        setIsBotTyping(false);
    };

    const handleSendRequestHandler = (lawyer: Lawyer) => {
        onSendRequest(lawyer);
        setSelectedLawyer(null);
    }
    
    const handleGoToChat = (chatId: string) => {
        setActiveChatId(chatId);
        setActiveTab('messages');
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'browse':
                return (
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-light-text-primary dark:text-dark-text-primary">Find Your Legal Expert</h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">AI-powered recommendations based on your case details.</p>
                        {isLoadingRecs ? <div className="flex justify-center p-8"><Spinner /></div> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedLawyers.map(lawyer => {
                                    const recommendation = recommendedLawyers.find(r => r.lawyerId === lawyer.id);
                                    return (
                                        <LawyerCard 
                                            key={lawyer.id} 
                                            lawyer={lawyer} 
                                            onViewProfile={setSelectedLawyer}
                                            isRecommended={!!recommendation}
                                            recommendationRank={recommendation?.rank}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            case 'requests': return <ClientRequests requests={clientRequests} onCancelRequest={onCancelRequest} onGoToChat={handleGoToChat}/>;
            case 'cases': return <ClientCases cases={clientCases} allLawyers={allLawyers} />;
            case 'messages': return <ChatComponent currentUser={client} chats={clientChats} onSendMessage={onSendMessage} allUsers={[...allLawyers, client]} preselectedChatId={activeChatId} />;
            case 'news': return (
                <div>
                     <h2 className="text-3xl font-bold mb-6 text-light-text-primary dark:text-dark-text-primary">Legal News & Updates</h2>
                     <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
                        {newsCategories.map(cat => (
                            <button key={cat} onClick={() => setNewsCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${newsCategory === cat ? 'bg-indigo-600 text-white' : 'bg-light-secondary dark:bg-dark-secondary text-light-text-primary dark:text-dark-text-primary hover:bg-light-accent dark:hover:bg-dark-accent'}`}>{cat}</button>
                        ))}
                     </div>
                     {isLoadingNews ? <div className="flex justify-center p-8"><Spinner /></div> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNews.map((article, index) => <NewsCard key={index} article={article} onClick={() => setSelectedNews(article)} />)}
                        </div>
                     )}
                </div>
            );
            case 'lawyerup':
                return <LawyerUpFeed currentUser={currentUser} posts={lawyerUpPosts} onAddPost={() => {}} onLikePost={onLikePost} onAddComment={onAddComment} />;
            case 'lawbot': return (
                <div className="flex flex-col h-[calc(100vh-12rem)] bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold p-4 border-b border-light-accent dark:border-dark-accent text-light-text-primary dark:text-dark-text-primary">LawBot Assistant</h2>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {lawBotMessages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.senderId === 'LAWBOT' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-lg p-3 rounded-lg ${msg.senderId === 'LAWBOT' ? 'bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary' : 'bg-indigo-600 text-white'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isBotTyping && <div className="flex justify-start"><div className="bg-light-accent dark:bg-dark-accent p-3 rounded-lg text-light-text-primary dark:text-dark-text-primary"><em>LawBot is typing...</em></div></div>}
                    </div>
                    <div className="p-4 border-t border-light-accent dark:border-dark-accent flex">
                        <input 
                            type="text"
                            value={botInput}
                            onChange={e => setBotInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSendBotMessage()}
                            placeholder="Ask me anything about law..."
                            className="flex-1 bg-light-primary dark:bg-dark-primary border border-light-accent dark:border-dark-accent rounded-l-lg p-2 text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button onClick={handleSendBotMessage} className="bg-indigo-600 px-4 rounded-r-lg hover:bg-indigo-700 text-white">Send</button>
                    </div>
                </div>
            );
            case 'profile': return <ClientProfile client={client} onUpdateProfile={onUpdateProfile} />;
            default: return null;
        }
    };

    const NavItem = ({ icon, label, tabName }: {icon: React.ReactNode, label: string, tabName: string}) => (
        <button onClick={() => setActiveTab(tabName)} className={`flex items-center space-x-3 p-3 rounded-lg w-full text-left transition-colors ${activeTab === tabName ? 'bg-indigo-600 text-white' : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-secondary dark:hover:bg-dark-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'}`}>
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    )
    
    const existingRequestForSelectedLawyer = selectedLawyer ? clientRequests.find(r => r.lawyer.id === selectedLawyer.id) : null;

    return (
        <div className="flex h-screen bg-light-primary dark:bg-dark-primary/80 dark:backdrop-blur-sm">
            {selectedLawyer && <LawyerProfileModal lawyer={selectedLawyer} onClose={() => setSelectedLawyer(null)} onSendRequest={handleSendRequestHandler} existingRequest={existingRequestForSelectedLawyer} />}
            {selectedNews && <NewsModal article={selectedNews} onClose={() => setSelectedNews(null)} />}
            
            <aside className="w-64 bg-light-secondary/80 dark:bg-dark-primary/80 backdrop-blur-md border-r border-light-accent/50 dark:border-dark-accent/50 p-4 flex flex-col">
                <div className="flex items-center space-x-2 mb-8">
                    <JusticeScaleIcon className="h-8 w-8 text-indigo-600"/>
                    <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Law Point</h1>
                </div>
                <nav className="space-y-2 flex-1">
                    <NavItem icon={<BriefcaseIcon/>} label="Browse Lawyers" tabName="browse" />
                    <NavItem icon={<PaperAirplaneIcon/>} label="My Requests" tabName="requests" />
                    <NavItem icon={<BriefcaseIcon/>} label="My Cases" tabName="cases" />
                    <NavItem icon={<MessageIcon/>} label="Messages" tabName="messages" />
                    <NavItem icon={<NewspaperIcon/>} label="News" tabName="news" />
                    <NavItem icon={<UsersIcon/>} label="LawyerUp Feed" tabName="lawyerup" />
                    <NavItem icon={<RobotIcon/>} label="LawBot" tabName="lawbot" />
                    <NavItem icon={<UserIcon/>} label="Edit Profile" tabName="profile" />
                </nav>
                <div>
                     <button onClick={onLogout} className="flex items-center space-x-3 p-3 rounded-lg w-full text-left text-light-text-secondary dark:text-dark-text-secondary hover:bg-red-500 hover:text-white transition-colors">
                        <LogoutIcon />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-start mb-6">
                    <div>
                         <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">Welcome back, {client.name.split(' ')[0]}!</h2>
                         <p className="text-light-text-secondary dark:text-dark-text-secondary">Let's find the justice you deserve.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-light-secondary dark:bg-dark-secondary text-light-text-secondary dark:text-dark-text-secondary hover:text-yellow-500 dark:hover:text-yellow-300">
                            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                        </button>
                        <NotificationBell 
                            notifications={notifications} 
                            onMarkAsRead={onMarkNotificationsAsRead} 
                        />
                    </div>
                </header>
                {renderContent()}
            </main>
        </div>
    );
};

export default ClientDashboard;