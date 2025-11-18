export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  citizenId: string;
  password?: string; // Made optional for security, but present for new users
  profilePicUrl: string;
}

export interface Lawyer extends User {
  barCouncilId: string;
  gender: 'Male' | 'Female' | 'Other';
  qualification: string;
  university: string;
  gradYear: number;
  achievements: string[];
  awards: string[];
  bio: string;
  domainStrengths: string[];
  casesWon: number;
  casesLost: number;
  specialization: string[];
  experienceYears: number;
  location: string;
  avgPrice: number; // Represents the average fee per case.
}

export type CaseUrgency = 'immediate' | 'high' | 'moderate' | 'low' | 'none';

export interface Case {
  id: string;
  clientId: string;
  lawyerId?: string;
  caseType: string;
  description: string;
  urgency: CaseUrgency;
  status: 'pending' | 'active' | 'closed';
  notes: string[];
  files: string[]; // URLs to files
}

export interface Client extends User {
  username: string;
  currentCase?: Omit<Case, 'id' | 'clientId' | 'lawyerId'>;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'LAWBOT' for bot messages
  receiverId: string;
  text: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  participantIds: string[];
  participants: { [key: string]: { name: string, profilePicUrl: string } };
  messages: ChatMessage[];
}

export interface ClientRequest {
  id: string;
  client: { id: string; name: string; profilePicUrl: string; };
  lawyer: { id: string; name: string; profilePicUrl: string; };
  caseDetails: Omit<Case, 'id' | 'clientId' | 'lawyerId'>;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
}

export interface LawyerUpComment {
    id: string;
    text: string;
    timestamp: Date;
    commenter: {
        id: string;
        name: string;
        profilePicUrl: string;
        role: UserRole;
    };
}

export interface LawyerUpPost {
    id: string;
    lawyerId: string;
    lawyerName: string;
    lawyerProfilePicUrl: string;
    text: string;
    imageUrl?: string;
    timestamp: Date;
    likes: string[]; // Array of user IDs who liked the post
    comments: LawyerUpComment[];
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface NewsArticle {
    headline: string;
    summary: string;
    imageUrl: string;
    sourceUrl: string;
    category: string;
}


export enum UserRole {
  CLIENT = 'client',
  LAWYER = 'lawyer',
  NONE = 'none'
}

export enum AuthMode {
    LOGIN = 'login',
    SIGNUP = 'signup'
}