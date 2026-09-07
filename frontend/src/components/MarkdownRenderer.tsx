import React from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * Escapes raw HTML tags to prevent XSS attacks
 */
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Parses inline markdown (bold, italic, inline code, links, images, strikethrough)
 */
const parseInline = (text: string): string => {
  let parsed = escapeHtml(text)

  // Images: ![alt](url)
  parsed = parsed.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g,
    '<img src="$2" alt="$1" class="md-image" loading="lazy" />'
  )

  // Links: [text](url)
  parsed = parsed.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>'
  )

  // Bold: **text** or __text__
  parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  parsed = parsed.replace(/__([^_]+)__/g, '<strong>$1</strong>')

  // Italic: *text* or _text_
  parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  parsed = parsed.replace(/_([^_]+)_/g, '<em>$1</em>')

  // Strikethrough: ~~text~~
  parsed = parsed.replace(/~~([^~]+)~~/g, '<del>$1</del>')

  // Inline Code: `code`
  parsed = parsed.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')

  return parsed
}

/**
 * Custom safe Markdown Parser & Renderer component
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content || !content.trim()) {
    return <div className={`markdown-body ${className}`}><p className="md-empty">Chưa có nội dung.</p></div>
  }

  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // 1. Code Blocks: ```lang ... ```
    if (line.trim().startsWith('```')) {
      const language = line.trim().slice(3).trim() || 'text'
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // Skip closing ```
      const rawCode = codeLines.join('\n')
      elements.push(
        <div key={`code-${i}`} className="md-code-block">
          <div className="md-code-header">
            <span className="md-code-lang">{language}</span>
          </div>
          <pre className="md-code-pre">
            <code>{rawCode}</code>
          </pre>
        </div>
      )
      continue
    }

    // 2. Headings: # H1, ## H2, ### H3, #### H4, ##### H5, ###### H6
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2]
      const parsedHeading = parseInline(text)
      const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      elements.push(
        <HeadingTag
          key={`heading-${i}`}
          className={`md-heading md-h${level}`}
          dangerouslySetInnerHTML={{ __html: parsedHeading }}
        />
      )
      i++
      continue
    }

    // 3. Blockquotes: > text
    if (line.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      const parsedQuote = quoteLines.map((l) => parseInline(l)).join('<br />')
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="md-blockquote"
          dangerouslySetInnerHTML={{ __html: parsedQuote }}
        />
      )
      continue
    }

    // 4. Horizontal Rule: --- or ***
    if (/^(---|---|\*\*\*)\s*$/.test(line.trim())) {
      elements.push(<hr key={`hr-${i}`} className="md-hr" />)
      i++
      continue
    }

    // 5. Unordered Lists: - item or * item
    if (/^\s*[-*]\s+/.test(line)) {
      const listItems: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="md-ul">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ul>
      )
      continue
    }

    // 6. Ordered Lists: 1. item
    if (/^\s*\d+\.\s+/.test(line)) {
      const listItems: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s+/, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="md-ol">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ol>
      )
      continue
    }

    // 7. Empty Lines
    if (!line.trim()) {
      i++
      continue
    }

    // 8. Regular Paragraphs
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].match(/^(#{1,6})\s+/) &&
      !lines[i].startsWith('>') &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^(---|---|\*\*\*)\s*$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }
    const parsedPara = paraLines.map((l) => parseInline(l)).join('<br />')
    elements.push(
      <p
        key={`para-${i}`}
        className="md-p"
        dangerouslySetInnerHTML={{ __html: parsedPara }}
      />
    )
  }

  return <div className={`markdown-body ${className}`}>{elements}</div>
}

export default MarkdownRenderer
