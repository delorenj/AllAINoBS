import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content: string | undefined | null
  className?: string
}

const styles = {
  h1: 'text-3xl font-bold mb-6 text-white',
  h2: 'text-2xl font-bold mb-4 text-white',
  h3: 'text-xl font-bold mb-3 text-white',
  p: 'mb-4 leading-relaxed text-gray-300',
  a: 'text-cyan-400 hover:underline',
  ul: 'list-disc pl-6 mb-4 space-y-2 text-gray-300',
  ol: 'list-decimal pl-6 mb-4 space-y-2 text-gray-300',
  li: 'leading-relaxed',
  blockquote: 'border-l-4 border-cyan-400 pl-4 italic text-gray-400 my-4',
  code: 'bg-slate-800 px-2 py-1 rounded text-cyan-400 text-sm font-mono',
  pre: 'bg-slate-800 p-4 rounded-lg overflow-x-auto mb-4',
  table: 'w-full border-collapse mb-4',
  th: 'border border-slate-700 p-2 bg-slate-800 text-left text-white',
  td: 'border border-slate-700 p-2 text-gray-300',
  img: 'max-w-full h-auto rounded-lg my-4',
  hr: 'border-slate-700 my-8',
  strong: 'text-white font-semibold',
}

export function MarkdownContent({
  content,
  className = '',
}: MarkdownContentProps) {
  if (!content) return null

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children: headingChildren }) => <h1 className={styles.h1}>{headingChildren}</h1>,
          h2: ({ children: headingChildren }) => <h2 className={styles.h2}>{headingChildren}</h2>,
          h3: ({ children: headingChildren }) => <h3 className={styles.h3}>{headingChildren}</h3>,
          p: ({ children: paragraphChildren }) => <p className={styles.p}>{paragraphChildren}</p>,
          a: ({ href, children: anchorChildren }) => (
            <a
              href={href}
              className={styles.a}
              target="_blank"
              rel="noopener noreferrer"
            >
              {anchorChildren}
            </a>
          ),
          ul: ({ children: unorderedChildren }) => <ul className={styles.ul}>{unorderedChildren}</ul>,
          ol: ({ children: orderedChildren }) => <ol className={styles.ol}>{orderedChildren}</ol>,
          li: ({ children: listItemChildren }) => <li className={styles.li}>{listItemChildren}</li>,
          blockquote: ({ children: blockquoteChildren }) => (
            <blockquote className={styles.blockquote}>{blockquoteChildren}</blockquote>
          ),
          code: ({ className: codeClassName, children: codeChildren }) => {
            const isCodeBlock = codeClassName?.includes('language-')
            if (isCodeBlock) {
              return (
                <pre className={styles.pre}>
                  <code className="text-sm font-mono text-gray-300">
                    {codeChildren}
                  </code>
                </pre>
              )
            }
            return <code className={styles.code}>{codeChildren}</code>
          },
          pre: ({ children: preChildren }) => <>{preChildren}</>,
          table: ({ children: tableChildren }) => (
            <table className={styles.table}>{tableChildren}</table>
          ),
          th: ({ children: headerChildren }) => <th className={styles.th}>{headerChildren}</th>,
          td: ({ children: cellChildren }) => <td className={styles.td}>{cellChildren}</td>,
          img: ({ src, alt }) => (
            <img src={src} alt={alt || ''} className={styles.img} />
          ),
          hr: () => <hr className={styles.hr} />,
          strong: ({ children: strongChildren }) => (
            <strong className={styles.strong}>{strongChildren}</strong>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
