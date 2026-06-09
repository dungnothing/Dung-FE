import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Box, Tooltip, Divider, CircularProgress } from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import CodeIcon from '@mui/icons-material/Code'
import ImageIcon from '@mui/icons-material/Image'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import TitleIcon from '@mui/icons-material/Title'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { uploadDescriptionAPI } from '~/apis/cards'
import { useTheme } from '@mui/material/styles'

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: 'max-width:33%;height:auto;border-radius:6px;display:block;margin:8px 0;',
        renderHTML: () => ({
          style: 'max-width:33%;height:auto;border-radius:6px;display:block;margin:8px 0;'
        })
      }
    }
  }
})

const ToolBtn = ({ title, onClick, active, children }) => {
  const theme = useTheme()
  return (
    <Tooltip title={title} placement="top" arrow>
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: '6px',
          cursor: 'pointer',
          color: active
            ? '#635FFF'
            : theme.palette.mode === 'dark' ? '#B6C2CF' : '#44546f',
          bgcolor: active
            ? 'rgba(99,95,255,0.12)'
            : 'transparent',
          transition: 'background 0.15s, color 0.15s',
          '&:hover': {
            bgcolor: active ? 'rgba(99,95,255,0.18)' : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
          }
        }}
      >
        {children}
      </Box>
    </Tooltip>
  )
}

function RichTextEditor({ value, onChange, cardId }) {
  const theme = useTheme()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [, forceUpdate] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit, CustomImage],
    content: value || '',
    onUpdate: ({ editor }) => {
      let html = editor.getHTML()
      if (html === '<p></p>' || html === '<p><br></p>') html = ''
      onChange?.(html)
    },
    onSelectionUpdate: () => forceUpdate((n) => n + 1),
    onTransaction: () => forceUpdate((n) => n + 1)
  })

  useEffect(() => {
    if (editor) editor.commands.focus()
  }, [editor])

  if (!editor) return null

  const addImage = async (file) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('uploadDescription', file)
      const res = await uploadDescriptionAPI(cardId, formData)
      if (res) editor.chain().focus().setImage({ src: res }).run()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  const isDark = theme.palette.mode === 'dark'
  const borderColor = isDark ? '#3a3f47' : '#e0e3e7'
  const toolbarBg = isDark ? '#1e2329' : '#f7f8fa'

  return (
    <Box
      sx={{
        border: `1px solid ${borderColor}`,
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        '&:focus-within': {
          borderColor: '#635FFF',
          boxShadow: '0 0 0 3px rgba(99,95,255,0.12)'
        },
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.25,
          px: 1,
          py: 0.75,
          bgcolor: toolbarBg,
          borderBottom: `1px solid ${borderColor}`
        }}
      >
        {/* Text style */}
        <ToolBtn title="In đậm (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <FormatBoldIcon sx={{ fontSize: 18 }} />
        </ToolBtn>
        <ToolBtn title="Nghiêng (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <FormatItalicIcon sx={{ fontSize: 18 }} />
        </ToolBtn>
        <ToolBtn title="Gạch ngang" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
          <FormatStrikethroughIcon sx={{ fontSize: 18 }} />
        </ToolBtn>
        <ToolBtn title="Tiêu đề" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          <TitleIcon sx={{ fontSize: 18 }} />
        </ToolBtn>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.25, borderColor }} />

        {/* List */}
        <ToolBtn title="Danh sách" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <FormatListBulletedIcon sx={{ fontSize: 18 }} />
        </ToolBtn>
        <ToolBtn title="Danh sách số" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <FormatListNumberedIcon sx={{ fontSize: 18 }} />
        </ToolBtn>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.25, borderColor }} />

        {/* Block */}
        <ToolBtn title="Trích dẫn" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
          <FormatQuoteIcon sx={{ fontSize: 18 }} />
        </ToolBtn>
        <ToolBtn title="Code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')}>
          <CodeIcon sx={{ fontSize: 18 }} />
        </ToolBtn>
        <ToolBtn title="Đường kẻ ngang" onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false}>
          <HorizontalRuleIcon sx={{ fontSize: 18 }} />
        </ToolBtn>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.25, borderColor }} />

        {/* Media */}
        <ToolBtn
          title="Chèn ảnh"
          onClick={() => !uploading && inputRef.current?.click()}
          active={false}
        >
          {uploading ? <CircularProgress size={15} /> : <ImageIcon sx={{ fontSize: 18 }} />}
        </ToolBtn>
        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          accept="image/png,image/jpeg,image/jpg"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) addImage(file)
            e.target.value = null
          }}
        />
      </Box>

      {/* Editor area */}
      <Box
        sx={{
          minHeight: 120,
          bgcolor: isDark ? '#282d33' : '#fff',
          '& .ProseMirror': {
            minHeight: 120,
            outline: 'none',
            p: '10px 14px',
            color: isDark ? '#B6C2CF' : '#172b4d',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            '& p': { margin: '0 0 4px' },
            '& h2': { fontSize: '1.1rem', fontWeight: 700, margin: '8px 0 4px', color: isDark ? '#B6C2CF' : '#172b4d' },
            '& ul, & ol': { pl: '20px', my: '4px' },
            '& li': { mb: '2px' },
            '& blockquote': {
              borderLeft: '3px solid #635FFF',
              pl: '12px',
              ml: 0,
              color: isDark ? '#8fa3bf' : '#6b778c',
              fontStyle: 'italic',
              my: '6px'
            },
            '& code': {
              bgcolor: isDark ? '#1a1f27' : '#f0f1f3',
              color: '#e74c3c',
              borderRadius: '4px',
              px: '4px',
              py: '1px',
              fontSize: '0.85em',
              fontFamily: 'monospace'
            },
            '& hr': { border: 'none', borderTop: `1px solid ${borderColor}`, my: '10px' },
            '& p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              color: '#aaa',
              pointerEvents: 'none',
              float: 'left',
              height: 0
            }
          }
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}

export default RichTextEditor
