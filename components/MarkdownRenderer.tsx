import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm md:prose-base max-w-none">
      <ReactMarkdown
        components={{
          ul: ({node, ...props}) => <ul className="list-disc pl-5 my-3 space-y-2 text-zinc-300" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-3 space-y-2 text-zinc-300" {...props} />,
          li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
          strong: ({node, ...props}) => <span className="font-bold text-teal-400" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mt-6 mb-3 border-b border-zinc-700 pb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-bold text-teal-100 mt-5 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-md font-semibold text-teal-300 mt-4 mb-2" {...props} />,
          p: ({node, ...props}) => <p className="mb-3 leading-relaxed text-zinc-300" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-teal-500 pl-4 py-1 italic text-zinc-400 bg-zinc-800/30 rounded-r-lg my-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};