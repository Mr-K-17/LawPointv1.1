import type { Lawyer, Client, ClientRequest, LawyerUpPost, Case, Chat } from './types';
import { UserRole } from './types';

export const DUMMY_LAWYERS: Lawyer[] = [
  {
    id: 'l1',
    name: 'Anjali Sharma',
    email: 'anjali.sharma@example.com',
    phone: '9876543210',
    dob: '1985-05-20',
    citizenId: 'CIT12345',
    password: 'password123',
    barCouncilId: 'BCI123456',
    gender: 'Female',
    qualification: 'LL.M. in Corporate Law',
    university: 'National Law School of India University',
    gradYear: 2010,
    achievements: ['Won the National Moot Court Competition 2009', 'Published paper on Corporate Governance'],
    awards: ['Young Lawyer of the Year 2018'],
    bio: 'A seasoned corporate lawyer with over a decade of experience in mergers, acquisitions, and corporate restructuring. Known for a meticulous approach and client-centric solutions.',
    domainStrengths: ['Corporate Law', 'Mergers & Acquisitions'],
    casesWon: 85,
    casesLost: 15,
    specialization: ['Corporate Law', 'M&A', 'Intellectual Property'],
    experienceYears: 12,
    location: 'Mumbai, India',
    avgPrice: 5000,
    profilePicUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop',
  },
  {
    id: 'l2',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '9988776655',
    dob: '1982-11-15',
    citizenId: 'CIT67890',
    password: 'password123',
    barCouncilId: 'BCI789012',
    gender: 'Male',
    qualification: 'J.D. with specialization in Criminal Law',
    university: 'Harvard Law School',
    gradYear: 2008,
    achievements: ['Successfully defended in over 50 high-profile criminal cases', 'Guest lecturer at various law schools'],
    awards: ['Top Criminal Defense Attorney 2020 - Legal Eagle Awards'],
    bio: 'Aggressive and strategic criminal defense lawyer with a proven track record of securing favorable outcomes for clients. Specializes in complex criminal litigation.',
    domainStrengths: ['Criminal Defense', 'Litigation'],
    casesWon: 120,
    casesLost: 25,
    specialization: ['Criminal Law', 'White-Collar Crime', 'Civil Rights'],
    experienceYears: 15,
    location: 'Delhi, India',
    avgPrice: 8000,
    profilePicUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'l3',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '9123456789',
    dob: '1990-02-10',
    citizenId: 'CIT54321',
    password: 'password123',
    barCouncilId: 'BCI345678',
    gender: 'Female',
    qualification: 'LL.B.',
    university: 'University of Delhi',
    gradYear: 2015,
    achievements: ['Pro-bono work for several NGOs', 'Specialist in Family Court mediation'],
    awards: ['Community Service Award 2019'],
    bio: 'A compassionate and dedicated family law practitioner focusing on divorce, child custody, and domestic violence cases. Believes in resolving disputes amicably through mediation.',
    domainStrengths: ['Family Law', 'Mediation'],
    casesWon: 45,
    casesLost: 5,
    specialization: ['Family Law', 'Divorce Law', 'Child Custody'],
    experienceYears: 8,
    location: 'Bangalore, India',
    avgPrice: 3500,
    profilePicUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop'
  },
   {
    id: 'l4',
    name: 'Vikram Rathore',
    email: 'vikram.rathore@example.com',
    phone: '8123456789',
    dob: '1988-09-01',
    citizenId: 'CIT98765',
    password: 'password123',
    barCouncilId: 'BCI987654',
    gender: 'Male',
    qualification: 'M.S. in Cyber Law and Security',
    university: 'Stanford University',
    gradYear: 2013,
    achievements: ['Keynote speaker at DEF CON 2022', 'Consultant for multiple tech unicorns'],
    awards: ['Cyber Sentinel Award 2021'],
    bio: 'A leading expert in cyber law, data privacy, and intellectual property in the digital age. Adept at navigating the complex intersection of technology and law.',
    domainStrengths: ['Cyber Law', 'Data Privacy'],
    casesWon: 60,
    casesLost: 8,
    specialization: ['Cyber Law', 'Data Privacy', 'Intellectual Property'],
    experienceYears: 10,
    location: 'Hyderabad, India',
    avgPrice: 6000,
    profilePicUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop',
  },
   {
    id: 'l5',
    name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    phone: '7123456789',
    dob: '1992-04-12',
    citizenId: 'CIT11223',
    password: 'password123',
    barCouncilId: 'BCI112233',
    gender: 'Female',
    qualification: 'LL.M. in Environmental Law',
    university: 'Yale Law School',
    gradYear: 2017,
    achievements: ['Lead counsel in a major environmental protection PIL', 'Works with the UN Environmental Programme'],
    awards: ['Green Justice Award 2023'],
    bio: 'Passionate advocate for environmental justice, focusing on climate change litigation, pollution control, and conservation policies. Committed to protecting our planet through legal action.',
    domainStrengths: ['Environmental Law', 'Public Interest Litigation'],
    casesWon: 30,
    casesLost: 4,
    specialization: ['Environmental Law', 'Human Rights', 'Public Interest Litigation'],
    experienceYears: 6,
    location: 'Chennai, India',
    avgPrice: 4000,
    profilePicUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
  },
  {
    id: 'l6',
    name: 'Siddharth Menon',
    email: 'sid.menon@example.com',
    phone: '6123456789',
    dob: '1980-07-22',
    citizenId: 'CIT44556',
    password: 'password123',
    barCouncilId: 'BCI445566',
    gender: 'Male',
    qualification: 'LL.B. with focus on Real Estate Law',
    university: 'Symbiosis Law School',
    gradYear: 2005,
    achievements: ['Handled property transactions worth over $500 million', 'Expert in RERA compliance'],
    awards: ['Realty Lawyer of the Year 2019'],
    bio: 'Specializes in all aspects of real estate law, including property transactions, leasing, zoning, and litigation. Provides comprehensive legal support for developers, investors, and homeowners.',
    domainStrengths: ['Real Estate Law', 'Property Litigation'],
    casesWon: 95,
    casesLost: 10,
    specialization: ['Real Estate Law', 'Contract Law', 'Litigation'],
    experienceYears: 18,
    location: 'Pune, India',
    avgPrice: 7500,
    profilePicUrl: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1921&auto=format&fit=crop',
  },
  {
    id: 'l7',
    name: 'Isabelle Rodriguez',
    email: 'isabelle.r@example.com',
    phone: '5123456789',
    dob: '1989-12-30',
    citizenId: 'CIT77889',
    password: 'password123',
    barCouncilId: 'BCI778899',
    gender: 'Female',
    qualification: 'J.D., International and Immigration Law',
    university: 'New York University School of Law',
    gradYear: 2014,
    achievements: ['Secured asylum for over 100 clients', 'AILA Pro Bono Service Award'],
    awards: ['Immigration Lawyer of the Year 2022'],
    bio: 'Dedicated to helping individuals and families navigate the complexities of immigration law. Expertise in visas, green cards, asylum, and deportation defense.',
    domainStrengths: ['Immigration Law', 'Asylum Law'],
    casesWon: 150,
    casesLost: 20,
    specialization: ['Immigration Law', 'Asylum & Refugee Law', 'Human Rights'],
    experienceYears: 9,
    location: 'New York, USA',
    avgPrice: 5500,
    profilePicUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
  }
];

export const DUMMY_CLIENTS: Client[] = [
    {
        id: 'c1',
        name: 'John Doe',
        username: 'john_doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        dob: '1992-08-25',
        citizenId: 'CID98765',
        password: 'password123',
        profilePicUrl: `https://api.dicebear.com/8.x/initials/svg?seed=JohnDoe`,
        currentCase: {
            caseType: 'Cyber Law',
            description: 'My company\'s proprietary source code was stolen by a former employee who is now working for a competitor. I need to file an injunction and sue for damages for this intellectual property theft.',
            urgency: 'high',
            status: 'pending',
            notes: [],
            files: [],
        }
    }
];

const client1 = DUMMY_CLIENTS[0];
const lawyer1 = DUMMY_LAWYERS[0];
const lawyer2 = DUMMY_LAWYERS[1];
const lawyer3 = DUMMY_LAWYERS[2];
const lawyer4 = DUMMY_LAWYERS[3];

export const DUMMY_CLIENT_REQUESTS: ClientRequest[] = [
    {
        id: 'req1',
        client: { id: client1.id, name: client1.name, profilePicUrl: client1.profilePicUrl },
        lawyer: { id: lawyer1.id, name: lawyer1.name, profilePicUrl: lawyer1.profilePicUrl },
        caseDetails: DUMMY_CLIENTS[0].currentCase!,
        status: 'pending'
    },
];

export const DUMMY_LAWYERUP_POSTS: LawyerUpPost[] = [
    {
        id: 'p1',
        lawyerId: 'l2',
        lawyerName: 'Rohan Mehta',
        lawyerProfilePicUrl: lawyer2.profilePicUrl,
        text: 'Just won a landmark case today! A testament to weeks of hard work and dedication from the entire team. Justice prevailed. #CriminalDefense #Victory',
        imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop',
        timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        likes: ['l1', 'l3', 'c1'], 
        comments: [
            {
                id: 'c1-1',
                text: 'Congratulations, Rohan! Well deserved.',
                timestamp: new Date(Date.now() - 3600000 * 1),
                commenter: { id: 'l1', name: 'Anjali Sharma', profilePicUrl: lawyer1.profilePicUrl, role: UserRole.LAWYER }
            }
        ],
    },
    {
        id: 'p2',
        lawyerId: 'l1',
        lawyerName: 'Anjali Sharma',
        lawyerProfilePicUrl: lawyer1.profilePicUrl,
        text: 'Attending the Annual Corporate Law Summit 2024. Excited to connect with fellow professionals and discuss the future of M&A.',
        timestamp: new Date(Date.now() - 3600000 * 8), // 8 hours ago
        likes: ['l2'],
        comments: [],
    },
    {
        id: 'p3',
        lawyerId: 'l3',
        lawyerName: 'Priya Singh',
        lawyerProfilePicUrl: lawyer3.profilePicUrl,
        text: 'Published a new article on the importance of mediation in family law disputes. It\'s crucial to prioritize the well-being of children during difficult times. Link in bio.',
        imageUrl: 'https://images.unsplash.com/photo-1589216532372-1c2a36790039?q=80&w=2070&auto=format&fit=crop',
        timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
        likes: ['l1', 'l2', 'c1'],
        comments: [
             {
                id: 'c3-1',
                text: 'Great article, Priya. Very insightful.',
                timestamp: new Date(Date.now() - 3600000 * 22),
                commenter: { id: 'l2', name: 'Rohan Mehta', profilePicUrl: lawyer2.profilePicUrl, role: UserRole.LAWYER }
            },
            {
                id: 'c3-2',
                text: 'This is really helpful, thank you for sharing!',
                timestamp: new Date(Date.now() - 3600000 * 20),
                commenter: { id: 'c1', name: 'John Doe', profilePicUrl: client1.profilePicUrl, role: UserRole.CLIENT }
            }
        ],
    },
     {
        id: 'p4',
        lawyerId: 'l4',
        lawyerName: 'Vikram Rathore',
        lawyerProfilePicUrl: lawyer4.profilePicUrl,
        text: 'The landscape of data privacy is evolving rapidly with the advent of AI. It\'s imperative for businesses to stay ahead of compliance. #DataPrivacy #CyberLaw #AI',
        timestamp: new Date(Date.now() - 3600000 * 48), // 2 days ago
        likes: ['l1', 'l5'],
        comments: [],
    },
];


export const DUMMY_CASES: Case[] = [
    {
        id: 'case1',
        clientId: 'c1',
        lawyerId: 'l3',
        caseType: 'Family Law',
        description: 'Initial consultation regarding child custody arrangements.',
        urgency: 'moderate',
        status: 'active',
        notes: ['Meeting scheduled for next week.', 'Client to provide financial documents.'],
        files: [],
    }
];

export const DUMMY_CHATS: Chat[] = [
    {
        id: 'chat-req1',
        participantIds: [client1.id, lawyer1.id],
        participants: {
             [client1.id]: { name: client1.name, profilePicUrl: client1.profilePicUrl },
             [lawyer1.id]: { name: lawyer1.name, profilePicUrl: lawyer1.profilePicUrl }
        },
        messages: []
    },
    {
        id: 'chat1',
        participantIds: [client1.id, lawyer3.id],
        participants: {
            [client1.id]: { name: client1.name, profilePicUrl: client1.profilePicUrl },
            [lawyer3.id]: { name: lawyer3.name, profilePicUrl: lawyer3.profilePicUrl }
        },
        messages: [
            { id: 'm1', senderId: 'c1', receiverId: 'l3', text: 'Hello Priya, thank you for accepting my case.', timestamp: new Date(Date.now() - 3600000 * 5) },
            { id: 'm2', senderId: 'l3', receiverId: 'c1', text: 'You\'re welcome, John. I\'m here to help. Let\'s schedule a call to discuss the details.', timestamp: new Date(Date.now() - 3600000 * 4) }
        ]
    }
];