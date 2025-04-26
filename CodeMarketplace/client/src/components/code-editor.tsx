import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

// A simple implementation of a code editor
// In a real app, you might want to use a library like Monaco Editor or CodeMirror
const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load highlight.js for syntax highlighting
    const loadHighlightJs = async () => {
      const hljs = await import('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js');
      const element = editorRef.current;
      if (element) {
        element.innerHTML = `<pre><code class="language-${language}">${escapeHtml(value)}</code></pre>`;
        hljs.default.highlightElement(element.querySelector('code')!);
      }
    };

    loadHighlightJs();

    // Load highlight.js styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [value, language]);

  // Escape HTML to prevent XSS
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative w-full h-full font-mono text-sm">
      <textarea
        value={value}
        onChange={handleInput}
        spellCheck="false"
        className="w-full h-full p-4 bg-[#1E1E1E] text-white font-mono resize-none outline-none absolute top-0 left-0 z-10 opacity-50"
        style={{ caretColor: 'white', lineHeight: '1.5' }}
      />
      <div 
        ref={editorRef}
        className="w-full h-full p-4 bg-[#1E1E1E] text-white font-mono overflow-auto absolute top-0 left-0"
        style={{ pointerEvents: 'none', lineHeight: '1.5' }}
      />
    </div>
  );
};

export default CodeEditor;
