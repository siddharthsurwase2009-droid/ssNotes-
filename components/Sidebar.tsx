import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { SearchIcon } from './icons/SearchIcon';

interface SidebarProps {
  branch: string;
  setBranch: (branch: string) => void;
  semester: string;
  setSemester: (semester: string) => void;
  subject: string;
  setSubject: (subject: string) => void;
  branches: string[];
  semesters: string[];
  subjects: string[];
  onGenerate: () => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  branch,
  setBranch,
  semester,
  setSemester,
  subject,
  setSubject,
  branches,
  semesters,
  subjects,
  onGenerate,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Reset search term when the list of subjects changes
  useEffect(() => {
    setSearchTerm('');
  }, [branch, semester]);
  
  const isButtonDisabled = !branch || !semester || !subject || isLoading;

  const filteredSubjects = subjects.filter(sub => 
    sub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 p-6 md:border-r border-gray-200 dark:border-gray-700">
      <div className="space-y-6">
        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            1. Select Branch
          </label>
          <select
            id="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option value="">Choose a branch</option>
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            2. Select Semester
          </label>
          <select
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            disabled={!branch}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 disabled:opacity-50"
          >
            <option value="">Choose a semester</option>
            {semesters.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            3. Select Subject
          </label>
          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
                type="text"
                id="subject-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!semester}
                placeholder="Search for a subject..."
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 disabled:opacity-50"
            />
          </div>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!semester}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 disabled:opacity-50"
          >
            <option value="">Choose a subject</option>
            {filteredSubjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onGenerate}
          disabled={isButtonDisabled}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 dark:disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate Notes
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;