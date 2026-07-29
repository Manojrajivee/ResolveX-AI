export interface LoginCredentials {
  email: string;
  passwordHash?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'ENGINEER';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'ENGINEER' | 'VIEWER';
    avatarUrl?: string;
  };
}
