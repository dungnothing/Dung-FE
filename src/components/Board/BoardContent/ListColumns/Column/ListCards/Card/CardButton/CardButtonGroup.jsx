import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { Box, Typography, Tooltip, CircularProgress } from '@mui/material'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { updateCardBackgroundAPI, uploadFileAPI } from '~/apis/cards'
import { getErrorMessage } from '~/utils/messageHelper'
import AddMemberInCard from './AddMemberInCard'

const Chip = ({ icon, label, onClick, disabled, active, activeColor = '#635FFF' }) => (
  <Tooltip title={label} arrow>
    <span>
      <Box
        onClick={disabled ? undefined : onClick}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.6,
          px: 1.2,
          py: 0.6,
          borderRadius: '20px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          bgcolor: active ? `${activeColor}15` : 'rgba(0,0,0,0)',
          color: active ? activeColor : 'text.secondary',
          opacity: disabled ? 0.45 : 1,
          transition: 'all 0.15s ease',
          userSelect: 'none',
          '&:hover': disabled ? {} : {
            bgcolor: active ? `${activeColor}22` : 'rgba(0,0,0,0.06)',
            color: active ? activeColor : 'text.primary'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 16 }}>{icon}</Box>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, lineHeight: 1 }}>{label}</Typography>
      </Box>
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
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
      {/* Hoàn thành */}
      <Chip
        icon={isDone ? <CheckCircleIcon sx={{ fontSize: 16, color: '#5CB338' }} /> : <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
        label={isDone ? 'Hoàn thành' : 'Hoàn thành'}
        onClick={handleToggleDone}
        disabled={isBoardClosed}
        active={isDone}
        activeColor="#5CB338"
      />

      {/* Thành viên — dùng AddMemberInCard nhưng render trigger ra ngoài */}
      <AddMemberInCard
        disabled={isBoardClosed}
        boardId={card?.boardId}
        card={card}
        fetchBoarData={fetchBoarData}
        renderTrigger={(onClick) => (
          <Chip
            icon={<PersonAddAlt1Icon sx={{ fontSize: 16 }} />}
            label="Thành viên"
            onClick={onClick}
            disabled={isBoardClosed}
          />
        )}
      />

      {/* Thời gian */}
      <Chip
        icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
        label="Thời gian"
        onClick={() => setOpenTimeDialog(true)}
        disabled={isBoardClosed}
      />

      {/* Ảnh bìa */}
      <Chip
        icon={isLoading ? <CircularProgress size={14} /> : <ImageIcon sx={{ fontSize: 16 }} />}
        label="Ảnh bìa"
        onClick={() => !isLoading && backgroundRef.current?.click()}
        disabled={isBoardClosed || isLoading}
      />
      <input type="file" ref={backgroundRef} style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleChangeCardBackground} />

      {/* Đính kèm */}
      <Chip
        icon={loadingFile ? <CircularProgress size={14} /> : <AttachFileIcon sx={{ fontSize: 16 }} />}
        label="Đính kèm"
        onClick={() => !loadingFile && fileRef.current?.click()}
        disabled={isBoardClosed || loadingFile}
      />
      <input type="file" ref={fileRef} style={{ display: 'none' }}
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleUploadFile} />
    </Box>
  )
}

export default CardButtonGroup
