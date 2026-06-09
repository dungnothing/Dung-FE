import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import { Box, Checkbox } from '@mui/material'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { updateCardBackgroundAPI, uploadFileAPI } from '~/apis/cards'
import { getErrorMessage } from '~/utils/messageHelper'
import AddMemberInCard from './AddMemberInCard'
import CardUpload from './CardUpload'
import RenderTooltip from './RenderTooltip'

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: 'center',
        py: 0.5,
        px: 0.5,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8f9fa',
        borderRadius: '10px',
        border: '1px solid #DCDFE4'
      }}
    >
      <Checkbox
        checked={!!card?.isDone}
        onChange={handleToggleDone}
        disabled={isBoardClosed}
        size="small"
        sx={{
          color: '#5CB338',
          '&.Mui-checked': { color: '#5CB338' },
          p: '6px'
        }}
      />

      <AddMemberInCard disabled={isBoardClosed} boardId={card?.boardId} card={card} fetchBoarData={fetchBoarData} />

      <RenderTooltip
        title="Thời gian"
        icon={<AccessTimeIcon fontSize="small" />}
        handleClick={() => setOpenTimeDialog(true)}
        disabled={isBoardClosed}
      />

      <CardUpload
        title="Thêm ảnh bìa"
        icon={<ImageIcon fontSize="small" />}
        loading={isLoading}
        disabled={isBoardClosed}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        inputRef={backgroundRef}
        onChange={handleChangeCardBackground}
      />

      <CardUpload
        title="Đính kèm file"
        icon={<AttachFileIcon fontSize="small" />}
        loading={loadingFile}
        disabled={isBoardClosed}
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        inputRef={fileRef}
        onChange={handleUploadFile}
      />
    </Box>
  )
}

export default CardButtonGroup
