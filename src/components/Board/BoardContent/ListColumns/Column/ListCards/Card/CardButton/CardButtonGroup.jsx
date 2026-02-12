import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import GroupIcon from '@mui/icons-material/Group'
import ImageIcon from '@mui/icons-material/Image'
import { Box, Checkbox } from '@mui/material'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { updateCardBackgroundAPI, uploadFileAPI } from '~/apis/cards'
import { getErrorMessage } from '~/utils/messageHelper'
import AddMemberInCard from './AddMemberInCard'
import CardUpload from './CardUpload'
import MemberInCard from './MemberInCard'
import RenderTooltip from './RenderTooltip'

function CardButtonGroup({
  card,
  anchorEl,
  setAnchorEl,
  openMemberDialog,
  setOpenMemberDialog,
  getMemberInCard,
  memberInCard,
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
        gap: 1,
        alignItems: 'center',
        py: 1
      }}
    >
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <Checkbox
          checked={!!card?.isDone}
          onChange={handleToggleDone}
          disabled={isBoardClosed}
          sx={{
            display: { xs: 'inline-flex', sm: 'none' },
            color: '#5CB338',
            '&.Mui-checked': { color: '#5CB338' },
            px: 0
          }}
        />
      </Box>

      <AddMemberInCard disabled={isBoardClosed} boardId={card?.boardId} card={card} fetchBoarData={fetchBoarData} />

      <RenderTooltip
        title="Thành viên"
        icon={<GroupIcon />}
        handleClick={(event) => {
          setAnchorEl(event.currentTarget)
          setOpenMemberDialog(true)
          getMemberInCard()
        }}
        disabled={isBoardClosed}
      />

      <MemberInCard
        anchorEl={anchorEl}
        memberInCard={memberInCard}
        open={openMemberDialog}
        onClose={() => setOpenMemberDialog(false)}
      />

      <RenderTooltip
        title="Thời gian"
        icon={<AccessTimeIcon />}
        handleClick={() => setOpenTimeDialog(true)}
        disabled={isBoardClosed}
      />

      <CardUpload
        title="Thêm ảnh bìa"
        icon={<ImageIcon />}
        loading={isLoading}
        disabled={isBoardClosed}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        inputRef={backgroundRef}
        onChange={handleChangeCardBackground}
      />

      <CardUpload
        title="Đính kèm file"
        icon={<AttachFileIcon />}
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
