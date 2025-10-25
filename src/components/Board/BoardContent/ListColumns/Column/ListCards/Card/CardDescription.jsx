import { useState, useEffect, useRef } from 'react'
import { textColor } from '~/utils/constants'
import { Box, Typography, TextField, Button, IconButton, Dialog } from '@mui/material'
import { DescriptionIcon } from '~/icon/Icon'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import RichTextEditor from '~/helpers/components/RichTextEditor'
import { useTheme } from '@mui/material/styles'

function CardDescription({
  card,
  description,
  setDescription,
  isEditting,
  setIsEditting,
  boardState,
  handleChangeDescription,
  iconColor
}) {
  const canEdit = boardState === 'OPEN'
  const theme = useTheme()
  const textColor2 = theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('')
  const contentRef = useRef(null)

  useEffect(() => {
    if (!contentRef.current) return
    const imgs = contentRef.current.querySelectorAll('img')
    imgs.forEach((img) => {
      img.style.cursor = 'pointer'
      img.onclick = () => {
        setPreviewSrc(img.src)
        setPreviewOpen(true)
      }
    })
  }, [description])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon color={iconColor} />
          <Typography sx={{ color: textColor }}>Mô tả</Typography>
        </Box>

        {/* Nút Chỉnh sửa */}
        {description?.trim() && canEdit && !isEditting && (
          <IconButton size="small" onClick={() => setIsEditting(true)}>
            <EditIcon fontSize="small" sx={{ color: textColor }} />
          </IconButton>
        )}
      </Box>

      {/* Nội dung */}
      {isEditting && canEdit ? (
        <Box className="pl-6 py-1">
          <RichTextEditor value={description} onChange={setDescription} cardId={card.id} />
        </Box>
      ) : (
        <Box className="pl-6 w-full">
          {description?.trim() ? (
            <div ref={contentRef} dangerouslySetInnerHTML={{ __html: description }} style={{ color: textColor2 }} />
          ) : (
            <TextField
              disabled={!canEdit}
              multiline
              minRows={2}
              sx={{
                fontStyle: 'italic',
                color: '#999',
                borderRadius: '8px',
                width: '100%',
                '& .MuiInputBase-input': {
                  cursor: canEdit ? 'text' : 'not-allowed'
                },
                '& .MuiOutlinedInput-root': {
                  p: '10px 12px'
                }
              }}
              placeholder="Thêm mô tả..."
              onClick={() => {
                if (canEdit) setIsEditting(true)
              }}
            />
          )}
        </Box>
      )}

      {/* Action buttons */}
      {isEditting && (
        <Box sx={{ display: 'flex', pl: 3, gap: 1 }}>
          <Button
            onClick={handleChangeDescription}
            variant="contained"
            sx={{ color: textColor, backgroundColor: '#E67514' }}
          >
            Lưu
          </Button>
          <Button
            onClick={() => {
              setIsEditting(false)
              setDescription(card.description)
            }}
            variant="outlined"
            sx={{ color: textColor }}
          >
            Hủy
          </Button>
        </Box>
      )}

      {/* Preview dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }
        }}
      >
        <IconButton
          onClick={() => setPreviewOpen(false)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#fff'
          }}
        >
          <CloseIcon />
        </IconButton>
        <img src={previewSrc} alt="preview" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 8 }} />
      </Dialog>
    </Box>
  )
}

export default CardDescription
