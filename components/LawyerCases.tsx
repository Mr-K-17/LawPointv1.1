import React from 'react';
import type { Case, Client } from '../types';
import { BriefcaseIcon } from './icons';

interface LawyerCasesProps {
    cases: Case[];
    allClients: Client[];
}

const LawyerCases: React.FC<LawyerCasesProps> = ({ cases, allClients }) => {
    
    const getClientName = (clientId: string) => {
        return allClients.find(c => c.id === clientId)?.name || 'Unknown Client';
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Active Cases</h2>
            {cases.length > 0 ? (
                <div className="space-y-4">
                    {cases.map(caseItem => (
                        <div key={caseItem.id} className="bg-light-secondary dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-xl">{caseItem.caseType}</h3>
                                    <p className="text-light-text-secondary dark:text-dark-text-secondary">Client: {getClientName(caseItem.clientId)}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full bg-green-500 text-white`}>
                                    Active
                                </span>
                            </div>
                            <p className="mt-4">{caseItem.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 bg-light-secondary dark:bg-dark-secondary rounded-lg">
                    <BriefcaseIcon className="w-12 h-12 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" />
                    <h3 className="text-xl font-semibold">No Active Cases</h3>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">Accepted client cases will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default LawyerCases;