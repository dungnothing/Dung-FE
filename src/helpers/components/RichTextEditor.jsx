import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Box, Tooltip, CircularProgress } from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import ImageIcon from '@mui/icons-material/Image'
import { useEffect, useState, useRef } from 'react'
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

function RichTextEditor({ value, onChange, cardId }) {
  const theme = useTheme()
  const inputRef = useRef(null)
  const [isActive, setIsActive] = useState({ bold: false, italic: false })
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, CustomImage],
    content: value || '',
    onUpdate: ({ editor }) => {
      let html = editor.getHTML()
      if (html === '<p></p>' || html === '<p><br></p>') {
        html = ''
      }
      onChange?.(html)
    }
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
      if (res) {
        editor.chain().focus().setImage({ src: res }).run()
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          border: '1px solid #ccc',
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          background: theme.palette.mode === 'dark' ? '#282D33' : '#E9EBEE'
        }}
      >
        <Tooltip title="In đậm" placement="top">
          <div
            className="cursor-pointer hover:bg-[#F5EFE6]"
            style={{ backgroundColor: isActive.bold ? '#CBDCEB' : '' }}
            onClick={() => {
              editor.chain().focus().toggleBold().run()
              setIsActive({ ...isActive, bold: !isActive.bold })
            }}
          >
            <FormatBoldIcon
              sx={{
                color: isActive.bold ? '#1976d2' : theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'
              }}
            />
          </div>
        </Tooltip>

        <Tooltip title="Nghiêng" placement="top">
          <div
            className="cursor-pointer hover:bg-[#F5EFE6]"
            style={{ backgroundColor: isActive.italic ? '#CBDCEB' : '' }}
            onClick={() => {
              editor.chain().focus().toggleItalic().run()
              setIsActive({ ...isActive, italic: !isActive.italic })
            }}
          >
            <FormatItalicIcon
              sx={{
                color: isActive.italic ? '#1976d2' : theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'
              }}
            />
          </div>
        </Tooltip>

        <Tooltip title="Thêm ảnh" placement="top">
          <div
            className={`cursor-pointer hover:bg-[#F5EFE6] ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => !uploading && inputRef.current?.click()}
          >
            <input
              type="file"
              style={{ display: 'none' }}
              ref={inputRef}
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) addImage(file)
              }}
            />
            <ImageIcon
              sx={{
                color: theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'
              }}
            />
          </div>
        </Tooltip>

        {uploading && <CircularProgress size={20} sx={{ ml: 1 }} />}
      </Box>

      {/* Editor */}
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: '0 0 8px 8px',
          minHeight: '120px',
          '& .ProseMirror': {
            minHeight: '120px',
            height: '100%',
            outline: 'none',
            padding: '8px',
            cursor: 'text',
            color: `${theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'} !important`,
            '& p': {
              margin: 0,
              color: `${theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'} !important`
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
