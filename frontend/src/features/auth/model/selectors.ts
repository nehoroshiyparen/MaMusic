import { RootState } from "../../../store";

export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthnticated
export const selectIsLoading = (state: RootState) => state.auth.loading
export const selectAuthError = (state: RootState) => state.auth.error