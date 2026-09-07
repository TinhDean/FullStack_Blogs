import React, { useState, useRef } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  rows?: number
  minHeight?: string
}

type TabMode = 'write' | 'preview' | 'split'

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung bài viết bằng Markdown...',
  disabled = false,
  rows = 14,
  minHeight
}) => {
  const [mode, setMode] = useState<TabMode>('write')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  /**
   * Helper to insert or wrap markdown syntax at current cursor/selection
   */
  const insertSyntax = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || defaultText

    const replacement = `${before}${selectedText}${after}`
    const newValue = value.substring(0, start) + replacement + value.substring(end)

    onChange(newValue)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className='md-editor-container'>
      {/* Editor Header: Toolbar & Mode Switcher */}
      <div className='md-editor-header'>
        {/* Formatting Toolbar */}
        <div className='md-toolbar'>
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('**', '**', 'văn bản in đậm')}
            disabled={disabled}
            title='In đậm (Ctrl+B)'
          >
            <strong>B</strong>
          </button>
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('*', '*', 'văn bản in nghiêng')}
            disabled={disabled}
            title='In nghiêng (Ctrl+I)'
          >
            <em>I</em>
          </button>
          <div className='md-toolbar-divider' />
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('# ', '', 'Tiêu đề lớn')}
            disabled={disabled}
            title='Tiêu đề H1'
          >
            H1
          </button>
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('## ', '', 'Tiêu đề phụ')}
            disabled={disabled}
            title='Tiêu đề H2'
          >
            H2
          </button>
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('### ', '', 'Tiêu đề nhỏ')}
            disabled={disabled}
            title='Tiêu đề H3'
          >
            H3
          </button>
          <div className='md-toolbar-divider' />
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('> ', '', 'Trích dẫn hay')}
            disabled={disabled}
            title='Trích dẫn (Blockquote)'
          >
            ❝
          </button>
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('`', '`', 'code')}
            disabled={disabled}
            title='Inline Code'
          >
            {'`code`'}
          </button>
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('\n```javascript\n', '\n```\n', '// Nhập code tại đây')}
            disabled={disabled}
            title='Khối Code (Code Block)'
          >
            {'</>'}
          </button>
          <div className='md-toolbar-divider' />
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('[', '](https://example.com)', 'Tên liên kết')}
            disabled={disabled}
            title='Chèn liên kết (Link)'
          >
            🔗
          </button>
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('![', '](https://picsum.photos/800/400)', 'Mô tả ảnh')}
            disabled={disabled}
            title='Chèn hình ảnh'
          >
            🖼️
          </button>
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('- ', '', 'Mục danh sách')}
            disabled={disabled}
            title='Danh sách gạch đầu dòng'
          >
            • List
          </button>
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('1. ', '', 'Mục đầu tiên')}
            disabled={disabled}
            title='Danh sách đánh số'
          >
            1. List
          </button>
          <button
            type='button'
            className='md-toolbar-btn'
            onClick={() => insertSyntax('\n---\n', '', '')}
            disabled={disabled}
            title='Đường phân cách (Divider)'
          >
            —
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className='md-tabs'>
          <button
            type='button'
            className={`md-tab-btn ${mode === 'write' ? 'active' : ''}`}
            onClick={() => setMode('write')}
          >
            ✍️ Soạn thảo
          </button>
          <button
            type='button'
            className={`md-tab-btn ${mode === 'preview' ? 'active' : ''}`}
            onClick={() => setMode('preview')}
          >
            👁️ Xem trước
          </button>
          <button
            type='button'
            className={`md-tab-btn md-tab-split ${mode === 'split' ? 'active' : ''}`}
            onClick={() => setMode('split')}
          >
            ⚡ Song song
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className={`md-editor-body md-mode-${mode}`}>
        {/* Write Pane */}
        {(mode === 'write' || mode === 'split') && (
          <div className='md-pane md-pane-write'>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className='md-textarea'
              style={minHeight ? { minHeight } : undefined}
            />
          </div>
        )}

        {/* Preview Pane */}
        {(mode === 'preview' || mode === 'split') && (
          <div className='md-pane md-pane-preview' style={minHeight ? { minHeight } : undefined}>
            <div className='md-preview-header'>Xem trước nội dung:</div>
            <div className='md-preview-content'>
              <MarkdownRenderer content={value} />
            </div>
          </div>
        )}
      </div>

      {/* Footer Helper */}
      <div className='md-editor-footer'>
        <span>💡 Hỗ trợ cú pháp Markdown chuẩn (In đậm, In nghiêng, Tiêu đề, Khối code, Link, Ảnh, Danh sách).</span>
        <span>{value.length} ký tự</span>
      </div>
    </div>
  )
}

export default MarkdownEditor
