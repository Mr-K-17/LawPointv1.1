import React from 'react';
import type { Lawyer, ClientRequest } from '../types';
import { XCircleIcon } from './icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LawyerProfileModalProps {
  lawyer: Lawyer;
  onClose: () => void;
  onSendRequest: (lawyer: Lawyer) => void;
  existingRequest?: ClientRequest | null;
}

const LawyerProfileModal: React.FC<LawyerProfileModalProps> = ({ lawyer, onClose, onSendRequest, existingRequest }) => {
    const successRate = lawyer.casesWon + lawyer.casesLost > 0 ? (lawyer.casesWon / (lawyer.casesWon + lawyer.casesLost)) * 100 : 0;
    const chartData = [
        { name: 'Cases', Won: lawyer.casesWon, Lost: lawyer.casesLost },
    ];
    
    const isRequestSent = existingRequest && (existingRequest.status === 'pending' || existingRequest.status === 'accepted');
  
    return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-light-secondary dark:bg-dark-secondary rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary">
          <XCircleIcon className="w-8 h-8" />
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="text-center md:text-left">
                <img src={lawyer.profilePicUrl} alt={lawyer.name} className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 mx-auto md:mx-0" />
                <h2 className="text-3xl font-bold mt-4 text-light-text-primary dark:text-dark-text-primary">{lawyer.name}</h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">{lawyer.location}</p>
                <p className="text-lg font-semibold text-yellow-400 mt-2">Avg. Fee per Case: ${lawyer.avgPrice}</p>
            </div>
            <div className="flex-1 w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                    <div className="bg-light-primary dark:bg-dark-primary p-3 rounded-lg">
                        <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">{lawyer.experienceYears}</p>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Years Exp.</p>
                    </div>
                    <div className="bg-light-primary dark:bg-dark-primary p-3 rounded-lg">
                        <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">{lawyer.casesWon + lawyer.casesLost}</p>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Total Cases</p>
                    </div>
                    <div className="bg-light-primary dark:bg-dark-primary p-3 rounded-lg">
                        <p className="text-2xl font-bold text-green-400">{lawyer.casesWon}</p>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Cases Won</p>
                    </div>
                    <div className="bg-light-primary dark:bg-dark-primary p-3 rounded-lg">
                        <p className="text-2xl font-bold text-red-400">{successRate.toFixed(1)}%</p>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Success Rate</p>
                    </div>
                </div>
                 <div className="h-48 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-light-accent dark:text-dark-accent" />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide/>
                            <Tooltip wrapperClassName="!bg-light-primary dark:!bg-dark-primary rounded-lg border !border-light-accent dark:!border-dark-accent" cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}/>
                            <Legend />
                            <Bar dataKey="Won" fill="#4ade80" barSize={30} />
                            <Bar dataKey="Lost" fill="#f87171" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>
        
        <div className="mt-8 space-y-4">
            <div>
                <h3 className="text-xl font-semibold border-b-2 border-light-accent dark:border-dark-accent pb-2 mb-2 text-light-text-primary dark:text-dark-text-primary">About</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">{lawyer.bio}</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold border-b-2 border-light-accent dark:border-dark-accent pb-2 mb-2 text-light-text-primary dark:text-dark-text-primary">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                    {lawyer.specialization.map(spec => <span key={spec} className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm">{spec}</span>)}
                </div>
            </div>
             <div>
                <h3 className="text-xl font-semibold border-b-2 border-light-accent dark:border-dark-accent pb-2 mb-2 text-light-text-primary dark:text-dark-text-primary">Achievements</h3>
                <ul className="list-disc list-inside text-light-text-secondary dark:text-dark-text-secondary space-y-1">
                    {lawyer.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                </ul>
            </div>
        </div>

        <div className="mt-8 flex justify-end">
            <button 
                onClick={() => onSendRequest(lawyer)} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={isRequestSent}
                title={isRequestSent ? `Request already ${existingRequest?.status}` : "Send a request to this lawyer"}
            >
                {isRequestSent ? `Request ${existingRequest?.status}` : 'Send Request'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfileModal;