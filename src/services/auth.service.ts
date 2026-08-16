import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return {
      token: 'mock_jwt_token_alex_mercer_2026',
      user: {
        id: 'usr_01',
        name: 'Alex Mercer',
        email: credentials.email,
        role: 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      },
    };
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return {
      token: 'mock_jwt_token_new_user_2026',
      user: {
        id: `usr_${Date.now()}`,
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
      },
    };
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Password reset instructions sent to ${email}`,
    };
  },
};
