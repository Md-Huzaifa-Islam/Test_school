import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UIState } from "@/types";

// Initial state
const initialState: UIState = {
  sidebarOpen: false,
  theme: "light",
  language: "en",
  isFullScreen: false,
};

// UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Toggle sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Set sidebar state
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Set theme
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },

    // Set language
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },

    // Toggle fullscreen
    toggleFullScreen: (state) => {
      state.isFullScreen = !state.isFullScreen;
    },

    // Set fullscreen state
    setFullScreen: (state, action: PayloadAction<boolean>) => {
      state.isFullScreen = action.payload;
    },

    // Reset UI state
    resetUI: (state) => {
      state.sidebarOpen = false;
      state.isFullScreen = false;
    },
  },
});

// Export actions
export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLanguage,
  toggleFullScreen,
  setFullScreen,
  resetUI,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;

// Selectors
export const selectUI = (state: { ui: UIState }) => state.ui;
export const selectSidebarOpen = (state: { ui: UIState }) =>
  state.ui.sidebarOpen;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectLanguage = (state: { ui: UIState }) => state.ui.language;
export const selectIsFullScreen = (state: { ui: UIState }) =>
  state.ui.isFullScreen;
