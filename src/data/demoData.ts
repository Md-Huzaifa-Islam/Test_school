/**
 * Demo data for the Test_School platform
 * This will be replaced with real API calls later
 */

export interface DemoUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "student" | "supervisor";
  isEmailVerified: boolean;
  createdAt: string;
}

export interface DemoQuestion {
  id: string;
  competency: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  timeLimit: number; // in seconds
}

export interface DemoAssessment {
  id: string;
  userId: string;
  competency: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  status: "not_started" | "in_progress" | "completed" | "expired";
  score: number | null;
  totalQuestions: number;
  correctAnswers: number | null;
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number | null; // in seconds
}

export interface DemoCompetency {
  id: string;
  name: string;
  description: string;
  category: string;
  levels: ("A1" | "A2" | "B1" | "B2" | "C1" | "C2")[];
}

// Demo Users
export const demoUsers: DemoUser[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "student",
    isEmailVerified: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "admin@testschool.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    isEmailVerified: true,
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "3",
    email: "supervisor@testschool.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "supervisor",
    isEmailVerified: true,
    createdAt: "2024-01-10T10:00:00Z",
  },
];

// Demo Competencies
export const demoCompetencies: DemoCompetency[] = [
  {
    id: "1",
    name: "Information and Data Literacy",
    description:
      "Articulate information needs, locate and retrieve digital data, information and content.",
    category: "Information and Digital Literacy",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    id: "2",
    name: "Communication and Collaboration",
    description:
      "Interact, communicate and collaborate through digital technologies.",
    category: "Communication and Collaboration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    id: "3",
    name: "Digital Content Creation",
    description:
      "Create and edit digital content, improve and integrate information.",
    category: "Digital Content Creation",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    id: "4",
    name: "Safety and Security",
    description:
      "Protect devices, data and digital identity, avoid cyber risks.",
    category: "Safety",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    id: "5",
    name: "Problem Solving",
    description:
      "Solve problems and make informed decisions about digital tool usage.",
    category: "Problem Solving",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
];

// Demo Questions
export const demoQuestions: DemoQuestion[] = [
  {
    id: "1",
    competency: "Information and Data Literacy",
    level: "A1",
    difficulty: "easy",
    question: "What is the most common file format for saving text documents?",
    options: [".txt", ".pdf", ".jpg", ".mp3"],
    correctAnswer: 0,
    explanation:
      ".txt is the most basic and common format for plain text documents.",
    timeLimit: 60,
  },
  {
    id: "2",
    competency: "Information and Data Literacy",
    level: "A1",
    difficulty: "easy",
    question: "Which of the following is a web browser?",
    options: [
      "Microsoft Word",
      "Google Chrome",
      "Adobe Photoshop",
      "Calculator",
    ],
    correctAnswer: 1,
    explanation:
      "Google Chrome is a web browser used to access websites on the internet.",
    timeLimit: 45,
  },
  {
    id: "3",
    competency: "Communication and Collaboration",
    level: "A2",
    difficulty: "medium",
    question: "What does CC mean in email?",
    options: [
      "Carbon Copy",
      "Computer Code",
      "Central Command",
      "Creative Commons",
    ],
    correctAnswer: 0,
    explanation:
      "CC stands for Carbon Copy, allowing you to send a copy of the email to additional recipients.",
    timeLimit: 60,
  },
  {
    id: "4",
    competency: "Digital Content Creation",
    level: "B1",
    difficulty: "medium",
    question: "Which software is primarily used for image editing?",
    options: [
      "Microsoft Excel",
      "Adobe Photoshop",
      "VLC Media Player",
      "Notepad",
    ],
    correctAnswer: 1,
    explanation:
      "Adobe Photoshop is the industry standard for professional image editing and manipulation.",
    timeLimit: 90,
  },
  {
    id: "5",
    competency: "Safety and Security",
    level: "B2",
    difficulty: "hard",
    question: "What is two-factor authentication (2FA)?",
    options: [
      "Using two different passwords",
      "Logging in twice",
      "Using two different devices",
      "Adding an extra layer of security with a second verification method",
    ],
    correctAnswer: 3,
    explanation:
      "2FA adds an extra layer of security by requiring a second form of verification beyond just a password.",
    timeLimit: 120,
  },
];

// Demo Assessments
export const demoAssessments: DemoAssessment[] = [
  {
    id: "1",
    userId: "1",
    competency: "Information and Data Literacy",
    level: "A1",
    status: "completed",
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    startedAt: "2024-08-01T09:00:00Z",
    completedAt: "2024-08-01T09:15:00Z",
    timeSpent: 900,
  },
  {
    id: "2",
    userId: "1",
    competency: "Communication and Collaboration",
    level: "A2",
    status: "in_progress",
    score: null,
    totalQuestions: 12,
    correctAnswers: null,
    startedAt: "2024-08-08T10:00:00Z",
    completedAt: null,
    timeSpent: null,
  },
  {
    id: "3",
    userId: "1",
    competency: "Digital Content Creation",
    level: "A1",
    status: "not_started",
    score: null,
    totalQuestions: 8,
    correctAnswers: null,
    startedAt: null,
    completedAt: null,
    timeSpent: null,
  },
];

// Demo Authentication State
export const demoAuthState = {
  user: demoUsers[0], // John Doe as the current user
  isAuthenticated: true,
  accessToken: "demo_access_token_123",
  refreshToken: "demo_refresh_token_456",
};

// Helper functions
export const getDemoUserById = (id: string): DemoUser | undefined => {
  return demoUsers.find((user) => user.id === id);
};

export const getDemoQuestionsByCompetencyAndLevel = (
  competency: string,
  level: string
): DemoQuestion[] => {
  return demoQuestions.filter(
    (q) => q.competency === competency && q.level === level
  );
};

export const getDemoAssessmentsByUserId = (
  userId: string
): DemoAssessment[] => {
  return demoAssessments.filter((assessment) => assessment.userId === userId);
};

export const getDemoCompetencyByName = (
  name: string
): DemoCompetency | undefined => {
  return demoCompetencies.find((comp) => comp.name === name);
};
