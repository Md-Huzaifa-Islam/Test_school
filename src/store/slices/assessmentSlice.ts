import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Assessment,
  AssessmentState,
  Timer,
  ExamSecuritySettings,
  AssessmentResult,
} from "@/types";

// Initial security settings
const defaultSecuritySettings: ExamSecuritySettings = {
  preventBackNavigation: true,
  disableRightClick: true,
  disablePrint: true,
  disableCopy: true,
  fullScreenMode: true,
  recordVideo: false,
  preventTabSwitch: true,
};

// Initial state
const initialState: AssessmentState = {
  currentAssessment: null,
  results: [],
  timer: null,
  isLoading: false,
  error: null,
  securitySettings: defaultSecuritySettings,
};

// Assessment slice
const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Set current assessment
    setCurrentAssessment: (state, action: PayloadAction<Assessment | null>) => {
      state.currentAssessment = action.payload;
    },

    // Update assessment
    updateAssessment: (state, action: PayloadAction<Partial<Assessment>>) => {
      if (state.currentAssessment) {
        state.currentAssessment = {
          ...state.currentAssessment,
          ...action.payload,
        };
      }
    },

    // Add assessment result
    addResult: (state, action: PayloadAction<AssessmentResult>) => {
      state.results.unshift(action.payload);
    },

    // Set timer
    setTimer: (state, action: PayloadAction<Timer | null>) => {
      state.timer = action.payload;
    },

    // Update timer
    updateTimer: (state, action: PayloadAction<Partial<Timer>>) => {
      if (state.timer) {
        state.timer = { ...state.timer, ...action.payload };
      }
    },

    // Start timer
    startTimer: (
      state,
      action: PayloadAction<{ totalTime: number; startTime: string }>
    ) => {
      state.timer = {
        totalTime: action.payload.totalTime,
        remainingTime: action.payload.totalTime,
        isRunning: true,
        isPaused: false,
        startTime: action.payload.startTime,
      };
    },

    // Pause timer
    pauseTimer: (state) => {
      if (state.timer) {
        state.timer.isRunning = false;
        state.timer.isPaused = true;
      }
    },

    // Resume timer
    resumeTimer: (state) => {
      if (state.timer) {
        state.timer.isRunning = true;
        state.timer.isPaused = false;
      }
    },

    // Stop timer
    stopTimer: (state, action: PayloadAction<string>) => {
      if (state.timer) {
        state.timer.isRunning = false;
        state.timer.endTime = action.payload;
      }
    },

    // Update remaining time
    updateRemainingTime: (state, action: PayloadAction<number>) => {
      if (state.timer) {
        state.timer.remainingTime = Math.max(0, action.payload);
        if (state.timer.remainingTime === 0) {
          state.timer.isRunning = false;
        }
      }
    },

    // Update security settings
    updateSecuritySettings: (
      state,
      action: PayloadAction<Partial<ExamSecuritySettings>>
    ) => {
      state.securitySettings = { ...state.securitySettings, ...action.payload };
    },

    // Clear assessment data
    clearAssessment: (state) => {
      state.currentAssessment = null;
      state.timer = null;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  setCurrentAssessment,
  updateAssessment,
  addResult,
  setTimer,
  updateTimer,
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  updateRemainingTime,
  updateSecuritySettings,
  clearAssessment,
  clearError,
} = assessmentSlice.actions;

// Export reducer
export default assessmentSlice.reducer;

// Selectors
export const selectAssessments = (state: any) => state.assessment.assessments;
export const selectCurrentAssessment = (state: any) =>
  state.assessment.currentAssessment;
export const selectAssessmentResults = (state: any) => state.assessment.results;
export const selectTimer = (state: any) => state.assessment.timer;
export const selectAssessmentLoading = (state: any) =>
  state.assessment.isLoading;
export const selectAssessmentError = (state: any) => state.assessment.error;
export const selectSecuritySettings = (state: any) =>
  state.assessment.securitySettings;
