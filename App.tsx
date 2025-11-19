
import React, { useState, useEffect, useCallback } from 'react';
import { CURRICULUM_DATA } from './constants';
import { generateNotesForSubject } from './services/geminiService';
import * as authService from './services/authService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteDisplay from './components/NoteDisplay';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import { Curriculum, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<'login' | 'signup' | 'forgotPassword' | 'app'>('app');

  const [branch, setBranch] = useState<string>('');
  const [semester, setSemester] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  
  const [subjects, setSubjects] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setPage('app');
    } else {
      setPage('login');
    }
  }, []);

  const branches = Object.keys(CURRICULUM_DATA);
  const semesters = branch ? Object.keys(CURRICULUM_DATA[branch as keyof Curriculum] || {}) : [];

  useEffect(() => {
    if (branch && semester) {
      const branchData = CURRICULUM_DATA[branch as keyof Curriculum];
      if (branchData) {
        const semesterData = branchData[semester as keyof typeof branchData];
        setSubjects(semesterData || []);
        setSubject('');
      }
    } else {
      setSubjects([]);
      setSubject('');
    }
  }, [branch, semester]);

  const handleGenerateNotes = useCallback(async () => {
    if (!branch || !semester || !subject) {
      setError('Please select a branch, semester, and subject.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setNotes('');

    try {
      const generatedNotes = await generateNotesForSubject(branch, semester, subject);
      setNotes(generatedNotes);
    } catch (err: any) {
      console.error("Note generation failed:", err);
      let errorMessage = 'An unexpected error occurred. Please try again later.';

      if (err && err.message) {
        const lowerCaseMessage = err.message.toLowerCase();
        if (lowerCaseMessage.includes('api key not valid') || lowerCaseMessage.includes('api_key_invalid')) {
          errorMessage = 'Your API key is invalid. Please ensure it is configured correctly.';
        } else if (lowerCaseMessage.includes('quota')) {
          errorMessage = 'You have exceeded your API quota. Please check your usage or try again later.';
        } else if (lowerCaseMessage.includes('resource has been exhausted')) {
            errorMessage = 'The service is currently experiencing high traffic. Please try again in a few moments.';
        } else if (lowerCaseMessage.includes('safety')) {
            errorMessage = 'The request was blocked due to safety policies. Please try a different subject or topic.';
        } else if (err.toString().includes('503') || err.toString().includes('500')) {
            errorMessage = 'The AI service is temporarily unavailable. Please try again later.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [branch, semester, subject]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setPage('app');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setPage('login');
  };

  if (page === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setPage} />;
  }
  if (page === 'signup') {
    return <SignUpPage onSignUpSuccess={handleLoginSuccess} onNavigate={setPage} />;
  }
  if (page === 'forgotPassword') {
    return <ForgotPasswordPage onNavigate={setPage} />;
  }
  
  if (!user) {
    // Should not happen if logic is correct, but a good fallback.
    return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setPage} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header user={user} onLogout={handleLogout} />
      <div className="flex flex-col md:flex-row">
        <Sidebar
          branch={branch}
          setBranch={setBranch}
          semester={semester}
          setSemester={setSemester}
          subject={subject}
          setSubject={setSubject}
          branches={branches}
          semesters={semesters}
          subjects={subjects}
          onGenerate={handleGenerateNotes}
          isLoading={isLoading}
        />
        <main className="flex-1 p-4 md:p-8">
          <div className="w-full max-w-4xl mx-auto">
            <NoteDisplay notes={notes} isLoading={isLoading} error={error} subject={subject} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
