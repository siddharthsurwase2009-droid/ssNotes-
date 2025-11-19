import { User } from '../types';

// IMPORTANT: This is a mock authentication service for demonstration purposes.
// It uses localStorage and is NOT secure for a production environment.

const USERS_KEY = 'ssnotes_users';
const CURRENT_USER_KEY = 'ssnotes_current_user';

// Helper to get users from localStorage
const getUsers = (): { [email: string]: string } => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

// Helper to save users to localStorage
const saveUsers = (users: { [email: string]: string }) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      if (users[email]) {
        return reject(new Error('User with this email already exists.'));
      }
      users[email] = password; // In a real app, hash the password!
      saveUsers(users);
      const newUser: User = { email };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      resolve(newUser);
    }, 500);
  });
};

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      if (!users[email] || users[email] !== password) {
        return reject(new Error('Invalid email or password.'));
      }
      const user: User = { email };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      resolve(user);
    }, 500);
  });
};

export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            if (!users[email]) {
                // Still resolve to prevent user enumeration attacks
                console.warn(`Password reset requested for non-existent user: ${email}`);
                return resolve();
            }
            // In a real app, you would generate a token and send an email.
            // Here, we just log it to the console for demonstration.
            alert(`A password reset link has been sent to ${email} (check console for simulation).`);
            console.log(`Simulating password reset for ${email}. A real implementation would send an email with a unique link.`);
            resolve();
        }, 500);
    });
};