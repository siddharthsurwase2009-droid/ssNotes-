
import React, { useState } from 'react';
import * as authService from '../../services/authService';
import { BookOpenIcon } from '../icons/BookOpenIcon';

interface ForgotPasswordPageProps {
  onNavigate: (page: 'login') => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await authService.requestPasswordReset(email);
      setMessage(`If an account with email ${email} exists, a password reset link has been sent.`);
    } catch (err: any) {
      // For security, we don't show specific errors here.
      setMessage(`If an account with email ${email} exists, a password reset link has been sent.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-3">
          <BookOpenIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {message ? (
            <div className="text-center">
              <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
              <button
                onClick={() => onNavigate('login')}
                className="mt-4 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                &larr; Back to Sign in
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>

              <div>
                <button type="submit" disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 dark:disabled:bg-primary-800">
                  {isLoading ? 'Sending...' : 'Send password reset email'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  &larr; Back to Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
