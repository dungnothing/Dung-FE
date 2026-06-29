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
  openEdit,
  isBoardClosed,
  handleChangeDescription,
  iconColor
}) {
  const canEdit = !isBoardClosed
  const theme = useTheme()
  const textColor2 = theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('')
  const contentRef = useRef(null)

  // Khi khong edit: hien thi mo ta tu prop (tu dong sync khi socket update).
  // Khi edit: hien thi draft cua user dang go.
  const displayDescription = isEditting ? description : card?.description

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
  }, [displayDescription])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon color={iconColor} />
          <Typography sx={{ color: textColor, fontWeight: 600, fontSize: '15px' }}>Mô tả</Typography>
        </Box>

        {/* Nút Chỉnh sửa */}
        {card?.description?.trim() && canEdit && !isEditting && (
          <IconButton size="small" onClick={openEdit}>
            <EditIcon fontSize="small" sx={{ color: textColor }} />
          </IconButton>
        )}
      </Box>

      {/* Nội dung */}
      {isEditting && canEdit ? (
        <Box sx={{ pl: 3.5, py: 0.5 }}>
          <RichTextEditor value={description} onChange={setDescription} cardId={card.id} />
        </Box>
      ) : (
        <Box sx={{ pl: 3.5, width: '100%' }}>
          {displayDescription?.trim() ? (
            <div ref={contentRef} dangerouslySetInnerHTML={{ __html: displayDescription }} style={{ color: textColor2 }} />
          ) : (
            <Box
              onClick={() => { if (canEdit) openEdit() }}
              sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9'),
                color: 'text.secondary',
                borderRadius: '8px',
                px: 1.75,
                py: 1.25,
                fontSize: '14px',
                minHeight: 56,
                cursor: canEdit ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
                '&:hover': canEdit ? { bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#273548' : '#e6ebf2') } : {}
              }}
            >
              Thêm mô tả chi tiết hơn cho card này...
            </Box>
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
            onClick={() => setIsEditting(false)}
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
