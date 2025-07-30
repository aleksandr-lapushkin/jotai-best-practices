import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
}

export function CodeBlock({ children, language = 'typescript', className = '' }: CodeBlockProps) {
  return (
    <div className={`rounded-lg overflow-hidden border ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        showLineNumbers={false}
        wrapLines={false}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  )
}