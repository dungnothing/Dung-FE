import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { Box, Button, CircularProgress } from '@mui/material'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { updateCardBackgroundAPI, uploadFileAPI } from '~/apis/cards'
import { getErrorMessage } from '~/utils/messageHelper'
import AddMemberInCard from './AddMemberInCard'

const ActionBtn = ({ title, icon, onClick, disabled, active = false, activeColor = '#635FFF' }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    startIcon={icon}
    disableElevation
    sx={{
      borderRadius: '8px',
      px: 1.5,
      py: 0.75,
      minWidth: 'auto',
      fontSize: '13px',
      fontWeight: 500,
      textTransform: 'none',
      color: active ? activeColor : 'text.secondary',
      bgcolor: active ? `${activeColor}18` : (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#eceff3'),
      transition: 'background 0.15s, color 0.15s',
      '& .MuiButton-startIcon': { mr: 0.75 },
      '& .MuiButton-startIcon > svg': { fontSize: 18 },
      '&:hover': {
        bgcolor: active ? `${activeColor}28` : (theme) => (theme.palette.mode === 'dark' ? '#3a4a5e' : '#dfe3e8')
      },
      '&.Mui-disabled': { opacity: 0.5 }
    }}
  >
    {title}
  </Button>
)

function CardButtonGroup({
  card,
  setOpenTimeDialog,
  isBoardClosed,
  handleToggleDone,
  onCardUpdated
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingFile, setLoadingFile] = useState(false)

  const backgroundRef = useRef(null)
  const fileRef = useRef(null)
  const allowBackground = ['image/png', 'image/jpeg', 'image/jpg']
  const allowFile = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  const handleChangeCardBackground = async (event) => {
    try {
      setIsLoading(true)
      const image = event.target.files[0]
      if (!allowBackground.includes(image.type)) {
        toast.error('Chỉ được tải lên file png, jpg, jpeg')
        return
      }
      const formData = new FormData()
      formData.append('cardBackground', image)
      const updatedCard = await updateCardBackgroundAPI(card._id, formData)
      onCardUpdated(updatedCard)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi khi thay đổi ảnh bìa'))
    } finally {
      setIsLoading(false)
      backgroundRef.current.value = null
    }
  }

  const handleUploadFile = async (event) => {
    try {
      setLoadingFile(true)
      const file = event.target.files[0]
      if (!allowFile.includes(file.type)) {
        toast.error('Chỉ được tải lên file pdf, doc, docx')
        return
      }
      const formData = new FormData()
      formData.append('file', file, file.name)
      const updatedCard = await uploadFileAPI(card._id, formData)
      onCardUpdated(updatedCard)
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setLoadingFile(false)
      fileRef.current.value = null
    }
  }

  const isDone = !!card?.isDone

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center' }}>
      <ActionBtn
        title={isDone ? 'Bỏ hoàn thành' : 'Đánh dấu hoàn thành'}
        icon={isDone
          ? <CheckCircleIcon sx={{ fontSize: 18 }} />
          : <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />}
        onClick={handleToggleDone}
        disabled={isBoardClosed}
        active={isDone}
        activeColor="#5CB338"
      />

      <AddMemberInCard
        disabled={isBoardClosed}
        boardId={card?.boardId}
        card={card}
        onCardUpdated={onCardUpdated}
        renderTrigger={(onClick) => (
          <ActionBtn
            title="Thành viên"
            icon={<PersonAddAlt1Icon sx={{ fontSize: 18 }} />}
            onClick={onClick}
            disabled={isBoardClosed}
          />
        )}
      />

      <ActionBtn
        title="Ngày"
        icon={<AccessTimeIcon sx={{ fontSize: 18 }} />}
        onClick={() => setOpenTimeDialog(true)}
        disabled={isBoardClosed}
      />

      <ActionBtn
        title="Ảnh bìa"
        icon={isLoading ? <CircularProgress size={16} /> : <ImageIcon sx={{ fontSize: 18 }} />}
        onClick={() => backgroundRef.current?.click()}
        disabled={isBoardClosed || isLoading}
      />
      <input type="file" ref={backgroundRef} style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleChangeCardBackground} />

      <ActionBtn
        title="Đính kèm"
        icon={loadingFile ? <CircularProgress size={16} /> : <AttachFileIcon sx={{ fontSize: 18 }} />}
        onClick={() => fileRef.current?.click()}
        disabled={isBoardClosed || loadingFile}
      />
      <input type="file" ref={fileRef} style={{ display: 'none' }}
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleUploadFile} />
    </Box>
  )
}

export default CardButtonGroup
