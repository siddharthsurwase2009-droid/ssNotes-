import React, { useState } from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CheckIcon } from './icons/CheckIcon';


const ReactMarkdown = (window as any).ReactMarkdown;
const remarkGfm = (window as any).remarkGfm;

interface NoteDisplayProps {
  notes: string;
  isLoading: boolean;
  error: string | null;
  subject: string;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
    </div>
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
     <div className="space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
    </div>
  </div>
);

const InitialState: React.FC = () => (
    <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <BookOpenIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Welcome to ssNotes</h3>
        <p className="mt-2 text-md text-gray-500 dark:text-gray-400">Select your branch, semester, and subject from the sidebar to generate your study notes with AI.</p>
    </div>
);

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeString = String(children).replace(/\n$/, '');

    const handleCopyCode = () => {
        navigator.clipboard.writeText(codeString).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    
    if (inline) {
        return (
            <code className="px-1.5 py-1 bg-gray-100 dark:bg-gray-700/50 rounded text-sm font-mono text-primary-600 dark:text-primary-400" {...props}>
                {children}
            </code>
        );
    }

    if (match) {
        return (
            <div className="relative my-6 rounded-lg bg-gray-900 dark:bg-[#0d1117] overflow-hidden border border-gray-700 dark:border-gray-800">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 dark:bg-gray-700/20 text-xs">
                    <span className="font-sans text-gray-400 uppercase">{language}</span>
                    <button onClick={handleCopyCode} className="flex items-center text-gray-300 hover:text-white transition-colors">
                        {isCopied ? (
                            <>
                                <CheckIcon className="w-4 h-4 mr-1.5 text-green-500" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <ClipboardIcon className="w-4 h-4 mr-1.5" />
                                Copy code
                            </>
                        )}
                    </button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm" {...props}>
                    <code className={`!bg-transparent !p-0 language-${language}`}>
                        {children}
                    </code>
                </pre>
            </div>
        );
    }
    
    return (
        <pre className="p-4 my-6 bg-gray-100 dark:bg-gray-900/50 rounded-lg overflow-x-auto text-sm border border-gray-200 dark:border-gray-700" {...props}>
            <code>{children}</code>
        </pre>
    )
};


const NoteDisplay: React.FC<NoteDisplayProps> = ({ notes, isLoading, error, subject }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-300 dark:border-red-600 rounded-md">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!notes) {
    return <InitialState />;
  }

  const sanitizeFilename = (name: string) => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notes).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const handleDownload = (format: 'md' | 'txt') => {
    const filename = `${sanitizeFilename(subject || 'notes')}.${format}`;
    const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-2">
        <button
          onClick={handleCopy}
          className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {isCopied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </button>
        <button
          onClick={() => handleDownload('md')}
          className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <DownloadIcon className="w-4 h-4 mr-1" />
          Download .md
        </button>
        <button
          onClick={() => handleDownload('txt')}
          className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <DownloadIcon className="w-4 h-4 mr-1" />
          Download .txt
        </button>
      </div>
      <article className="prose prose-lg dark:prose-invert max-w-none p-6 prose-pre:p-0 prose-pre:bg-transparent">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
            table: ({ node, ...props }) => (
              <div className="w-full overflow-x-auto my-6">
                <table {...props} />
              </div>
            ),
          }}
        >
          {notes}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default NoteDisplay;