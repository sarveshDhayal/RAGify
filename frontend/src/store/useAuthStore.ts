import { create } from 'zustand';

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load initial state from local storage
  const storedToken = localStorage.getItem('ragify_token');
  const storedUser = localStorage.getItem('ragify_user');
  
  return {
    token: storedToken,
    user: storedUser ? JSON.parse(storedUser) : null,
    loading: false, // Local storage is sync, so no loading state needed
    login: (token, user) => {
      localStorage.setItem('ragify_token', token);
      localStorage.setItem('ragify_user', JSON.stringify(user));
      set({ token, user });
    },
    logout: () => {
      localStorage.removeItem('ragify_token');
      localStorage.removeItem('ragify_user');
      set({ token: null, user: null });
    },
    setLoading: (loading) => set({ loading }),
  };
});
