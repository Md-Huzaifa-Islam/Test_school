/**
 * User authentication and authorization types
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "student" | "supervisor";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface OTPData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Assessment and question types
 */
export type CompetencyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type AssessmentStep = 1 | 2 | 3;

export interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Question {
  id: string;
  competencyId: string;
  level: CompetencyLevel;
  question: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation?: string;
  timeLimit: number; // in seconds
  difficulty: "easy" | "medium" | "hard";
}

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface Assessment {
  id: string;
  userId: string;
  step: AssessmentStep;
  questions: Question[];
  answers: AssessmentAnswer[];
  startTime: string;
  endTime?: string;
  timeLimit: number; // in seconds
  status: AssessmentStatus;
  score?: number;
  percentage?: number;
  certificationLevel?: CompetencyLevel;
  createdAt: string;
  updatedAt: string;
}

export type AssessmentStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "expired"
  | "submitted";

export interface AssessmentAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  answeredAt: string;
}

export interface AssessmentResult {
  assessmentId: string;
  userId: string;
  step: AssessmentStep;
  score: number;
  totalQuestions: number;
  percentage: number;
  certificationLevel: CompetencyLevel | null;
  canProceedToNext: boolean;
  competencyResults: CompetencyResult[];
  createdAt: string;
}

export interface CompetencyResult {
  competencyId: string;
  competencyName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  level: CompetencyLevel;
}

/**
 * Certification types
 */
export interface Certificate {
  id: string;
  userId: string;
  level: CompetencyLevel;
  issueDate: string;
  expiryDate?: string;
  certificateNumber: string;
  verificationCode: string;
  pdfUrl?: string;
}

/**
 * API response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Form validation types
 */
export interface FormError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormError[];
}

/**
 * Timer and exam security types
 */
export interface Timer {
  totalTime: number; // in seconds
  remainingTime: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  startTime: string;
  endTime?: string;
}

export interface ExamSecuritySettings {
  preventBackNavigation: boolean;
  disableRightClick: boolean;
  disablePrint: boolean;
  disableCopy: boolean;
  fullScreenMode: boolean;
  recordVideo: boolean;
  preventTabSwitch: boolean;
}

/**
 * Dashboard and analytics types
 */
export interface DashboardStats {
  totalUsers: number;
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  certificationsIssued: number;
  usersByRole: Record<UserRole, number>;
  assessmentsByLevel: Record<CompetencyLevel, number>;
}

export interface UserProgress {
  userId: string;
  currentStep: AssessmentStep;
  highestLevel: CompetencyLevel | null;
  completedAssessments: Assessment[];
  certificates: Certificate[];
  overallProgress: number; // percentage
}

/**
 * Notification types
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export type NotificationType =
  | "assessment_completed"
  | "certificate_issued"
  | "assessment_reminder"
  | "system_update"
  | "account_verification";

/**
 * Redux store types
 */
export interface RootState {
  auth: AuthState;
  assessment: AssessmentState;
  user: UserState;
  notifications: NotificationState;
  ui: UIState;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AssessmentState {
  currentAssessment: Assessment | null;
  results: AssessmentResult[];
  timer: Timer | null;
  isLoading: boolean;
  error: string | null;
  securitySettings: ExamSecuritySettings;
}

export interface UserState {
  profile: User | null;
  progress: UserProgress | null;
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  language: string;
  isFullScreen: boolean;
}
