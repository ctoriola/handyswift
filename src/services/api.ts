const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  role: 'user' | 'provider';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      full_name: string;
      role: string;
    };
    token: string;
  };
  error?: string;
}

// Auth endpoints
export const authAPI = {
  async register(data: SignUpData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async updateProfile(token: string, data: any) {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Jobs endpoints
export const jobsAPI = {
  async postJob(token: string, data: any) {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getJobs(token: string, query?: string) {
    const response = await fetch(
      `${API_URL}/jobs${query ? `?${query}` : ''}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  async getJob(token: string, id: string) {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async getOffers(token: string, jobId: string) {
    const response = await fetch(`${API_URL}/jobs/${jobId}/offers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async acceptOffer(token: string, jobId: string, offerId: string) {
    const response = await fetch(
      `${API_URL}/jobs/${jobId}/offers/${offerId}/accept`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  async rejectOffer(token: string, jobId: string, offerId: string) {
    const response = await fetch(
      `${API_URL}/jobs/${jobId}/offers/${offerId}/reject`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  async closeJob(token: string, jobId: string) {
    const response = await fetch(`${API_URL}/jobs/${jobId}/close`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};

// Bookings endpoints
export const bookingsAPI = {
  async getBookings(token: string, query?: string) {
    const response = await fetch(
      `${API_URL}/bookings${query ? `?${query}` : ''}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  async getBooking(token: string, id: string) {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async cancelBooking(token: string, id: string) {
    const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};
