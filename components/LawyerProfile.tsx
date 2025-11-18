import React, { useState } from 'react';
import type { Lawyer } from '../types';

interface LawyerProfileProps {
    lawyer: Lawyer;
    onUpdateProfile: (updatedLawyer: Lawyer) => void;
}

const LawyerProfile: React.FC<LawyerProfileProps> = ({ lawyer, onUpdateProfile }) => {
    const [formData, setFormData] = useState({
        ...lawyer,
        specialization: lawyer.specialization.join(', '),
        achievements: lawyer.achievements.join('\n'),
        awards: lawyer.awards.join('\n'),
    });
    const [feedback, setFeedback] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const processedValue = type === 'number' ? parseInt(value, 10) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedLawyer: Lawyer = {
            ...formData,
            specialization: formData.specialization.split(',').map(s => s.trim()),
            achievements: formData.achievements.split('\n').filter(a => a.trim()),
            awards: formData.awards.split('\n').filter(a => a.trim()),
        };
        onUpdateProfile(updatedLawyer);
        setFeedback('Profile updated successfully!');
        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
             <h2 className="text-3xl font-bold mb-6 text-center">Edit Your Professional Profile</h2>
            <fieldset className="p-6 bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-md">
                <legend className="px-2 font-semibold text-xl">Personal Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                    <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                </div>
            </fieldset>

             <fieldset className="p-6 bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-md">
                <legend className="px-2 font-semibold text-xl">Practice Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input label="Specializations (comma-separated)" name="specialization" value={formData.specialization} onChange={handleChange} required placeholder="e.g., Corporate Law, Criminal Law"/>
                    <Input label="Years of Experience" name="experienceYears" type="number" value={formData.experienceYears} onChange={handleChange} required />
                    <Input label="Location (City, Country)" name="location" value={formData.location} onChange={handleChange} required />
                    <Input label="Average Fee per Case ($)" name="avgPrice" type="number" value={formData.avgPrice} onChange={handleChange} required />
                </div>
            </fieldset>

            <fieldset className="p-6 bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-md">
                <legend className="px-2 font-semibold text-xl">Profile Customization</legend>
                <div className="space-y-4 mt-4">
                    <TextArea label="Bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} placeholder="Tell clients a bit about yourself..." />
                    <TextArea label="Achievements (one per line)" name="achievements" value={formData.achievements} onChange={handleChange} rows={3} />
                    <TextArea label="Awards (one per line)" name="awards" value={formData.awards} onChange={handleChange} rows={3} />
                    <Input label="Profile Picture URL" name="profilePicUrl" value={formData.profilePicUrl} onChange={handleChange} placeholder="https://..."/>
                </div>
            </fieldset>
            {feedback && <p className="text-green-400 text-center font-semibold">{feedback}</p>}
            <div className="text-center">
                 <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg">
                    Save All Changes
                </button>
            </div>
        </form>
    );
};


const Input = ({ label, ...props }: {label: string, name: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, [key: string]: any}) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">{label}</label>
        <input {...props} id={props.name} className="mt-1 block w-full bg-light-primary dark:bg-dark-primary border border-light-accent dark:border-dark-accent rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
    </div>
);

const TextArea = ({ label, ...props }: {label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, [key: string]: any}) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">{label}</label>
        <textarea {...props} id={props.name} className="mt-1 block w-full bg-light-primary dark:bg-dark-primary border border-light-accent dark:border-dark-accent rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
    </div>
);

export default LawyerProfile;