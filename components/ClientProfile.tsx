import React, { useState } from 'react';
import type { Client } from '../types';

interface ClientProfileProps {
    client: Client;
    onUpdateProfile: (updatedClient: Client) => void;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ client, onUpdateProfile }) => {
    const [formData, setFormData] = useState<Client>(client);
    const [feedback, setFeedback] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile(formData);
        setFeedback('Profile updated successfully!');
        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Edit Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-light-secondary dark:bg-dark-secondary p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                    <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                    <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                    <Input label="Citizen ID" name="citizenId" value={formData.citizenId} onChange={handleChange} />
                </div>
                <div>
                    <Input label="New Password (optional)" name="password" type="password" value={formData.password || ''} onChange={handleChange} placeholder="Leave blank to keep current password" />
                </div>
                {feedback && <p className="text-green-400 text-center font-semibold">{feedback}</p>}
                <div className="text-right">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

const Input = ({ label, ...props }: {label: string, name: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, [key: string]: any}) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">{label}</label>
        <input {...props} id={props.name} className="mt-1 block w-full bg-light-primary dark:bg-dark-primary border border-light-accent dark:border-dark-accent rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
    </div>
);

export default ClientProfile;