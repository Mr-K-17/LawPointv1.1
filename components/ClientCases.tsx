import React from 'react';
import type { Case, Lawyer } from '../types';
import { BriefcaseIcon } from './icons';

interface ClientCasesProps {
    cases: Case[];
    allLawyers: Lawyer[];
}

const ClientCases: React.FC<ClientCasesProps> = ({ cases, allLawyers }) => {
    
    const getLawyerName = (lawyerId?: string) => {
        if (!lawyerId) return 'Pending Assignment';
        return allLawyers.find(l => l.id === lawyerId)?.name || 'Unknown Lawyer';
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">My Cases</h2>
            {cases.length > 0 ? (
                <div className="space-y-4">
                    {cases.map(caseItem => (
                        <div key={caseItem.id} className="bg-light-secondary dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-xl">{caseItem.caseType}</h3>
                                    <p className="text-light-text-secondary dark:text-dark-text-secondary">Lawyer: {getLawyerName(caseItem.lawyerId)}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    caseItem.status === 'active' ? 'bg-green-500 text-white' : 
                                    caseItem.status === 'closed' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                                }`}>
                                    {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                                </span>
                            </div>
                            <p className="mt-4">{caseItem.description}</p>
                             {caseItem.notes.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-light-accent dark:border-dark-accent">
                                    <h4 className="font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-2">Notes:</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                        {caseItem.notes.map((note, index) => <li key={index}>{note}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 bg-light-secondary dark:bg-dark-secondary rounded-lg">
                    <BriefcaseIcon className="w-12 h-12 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" />
                    <h3 className="text-xl font-semibold">No Cases Yet</h3>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">Your active and past cases will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default ClientCases;