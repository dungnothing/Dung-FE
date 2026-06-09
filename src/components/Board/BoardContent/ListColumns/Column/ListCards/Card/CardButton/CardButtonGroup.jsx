import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { Box, IconButton, Tooltip, CircularProgress } from '@mui/material'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { updateCardBackgroundAPI, uploadFileAPI } from '~/apis/cards'
import { getErrorMessage } from '~/utils/messageHelper'
import AddMemberInCard from './AddMemberInCard'

const ActionBtn = ({ title, icon, onClick, disabled, active = false, activeColor = '#635FFF' }) => (
  <Tooltip title={title} arrow placement="top">
    <span>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={{
          borderRadius: '8px',
          p: '7px',
          color: active ? activeColor : 'text.secondary',
          bgcolor: active ? `${activeColor}18` : 'transparent',
          transition: 'background 0.15s, color 0.15s',
          '&:hover': { bgcolor: active ? `${activeColor}28` : 'action.hover' },
          '&.Mui-disabled': { opacity: 0.38 }
        }}
      >
        {icon}
      </IconButton>
    </span>
  </Tooltip>
)

function CardButtonGroup({
  card,
  setOpenTimeDialog,
  isBoardClosed,
  fetchBoarData,
  handleToggleDone
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
      await updateCardBackgroundAPI(card._id, formData)
      fetchBoarData()
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
      await uploadFileAPI(card._id, formData)
      fetchBoarData()
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setLoadingFile(false)
      fileRef.current.value = null
    }
  }

  const isDone = !!card?.isDone

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, alignItems: 'center' }}>
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
        fetchBoarData={fetchBoarData}
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
        title="Thời gian"
        icon={<AccessTimeIcon sx={{ fontSize: 18 }} />}
        onClick={() => setOpenTimeDialog(true)}
        disabled={isBoardClosed}
      />

      <ActionBtn
        title="Thêm ảnh bìa"
        icon={isLoading ? <CircularProgress size={16} /> : <ImageIcon sx={{ fontSize: 18 }} />}
        onClick={() => backgroundRef.current?.click()}
        disabled={isBoardClosed || isLoading}
      />
      <input type="file" ref={backgroundRef} style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleChangeCardBackground} />

      <ActionBtn
        title="Đính kèm file"
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
