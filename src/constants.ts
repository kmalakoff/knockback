// Dispose state constants
export const KB_DISPOSE_STATE = {
  ACTIVE: 0, // Not disposed, ready to use
  DISPOSING: 1, // Currently disposing (prevents re-entry)
  DISPOSED: 2, // Disposal complete (prevents double-disposal)
} as const;
