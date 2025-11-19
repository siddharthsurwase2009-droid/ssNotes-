import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpenIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            ssNotes
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <UserIcon className="w-5 h-5" />
              <span>{user.email}</span>
            </div>
          )}
          <button
            onClick={onLogout}
            className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            aria-label="Log out"
          >
            <LogoutIcon className="w-5 h-5 mr-1" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;