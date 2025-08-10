// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "student" | "supervisor";
  currentLevel?: CompetencyLevel;
  isEmailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: "student" | "supervisor";
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Assessment Types
export type CompetencyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type AssessmentStep = 1 | 2 | 3;
export type AssessmentStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "expired";

export interface Question {
  id: string;
  competency: string;
  level: CompetencyLevel;
  step: AssessmentStep;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
}

export interface Answer {
  questionId: string;
  selectedAnswer: number;
  timeSpent?: number;
}

export interface Assessment {
  id: string;
  userId: string;
  step: AssessmentStep;
  status: AssessmentStatus;
  questions: Question[];
  answers: Answer[];
  startTime?: string;
  endTime?: string;
  timeLimit: number; // in minutes
  score?: number;
  level?: CompetencyLevel;
  certified?: boolean;
  canProceed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentResult {
  assessmentId: string;
  score: number;
  level: CompetencyLevel;
  certified: boolean;
  canProceed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  feedback: string;
}

export interface CreateAssessmentRequest {
  step: AssessmentStep;
  competencies?: string[];
}

export interface SubmitAssessmentRequest {
  answers: Answer[];
  timeSpent: number;
}

// Certificate Types
export interface Certificate {
  id: string;
  userId: string;
  level: CompetencyLevel;
  issuedAt: string;
  certificateNumber: string;
  competencies: string[];
  score: number;
  validUntil?: string;
}

// Profile Types
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Competency Types
export interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
  levels: CompetencyLevel[];
}

// Demo Data Types (for development)
export interface DemoUser extends User {
  password?: string;
}

export interface DemoAssessment extends Omit<Assessment, "questions"> {
  questionsCount: number;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Dashboard Types
export interface DashboardStats {
  totalAssessments: number;
  completedAssessments: number;
  currentLevel: CompetencyLevel | null;
  certificatesEarned: number;
  averageScore: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: "assessment_started" | "assessment_completed" | "certificate_earned";
  title: string;
  description: string;
  timestamp: string;
  level?: CompetencyLevel;
  score?: number;
}

// Filter and Search Types
export interface AssessmentFilter {
  status?: AssessmentStatus;
  step?: AssessmentStep;
  level?: CompetencyLevel;
  dateFrom?: string;
  dateTo?: string;
}

export interface QuestionFilter {
  competency?: string;
  level?: CompetencyLevel;
  step?: AssessmentStep;
  difficulty?: "easy" | "medium" | "hard";
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "student" | "supervisor";
  agreeToTerms: boolean;
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: any;
  badge?: string | number;
  children?: NavigationItem[];
}

// Theme Types
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}
