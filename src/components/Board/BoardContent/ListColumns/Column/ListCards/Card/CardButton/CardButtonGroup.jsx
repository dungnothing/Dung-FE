import { Box } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ImageIcon from '@mui/icons-material/Image'
import MemberInCard from './MemberInCard'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { updateCardBackgroundAPI, uploadFileAPI } from '~/apis/cards'
import RenderTooltip from './RenderTooltip'
import CardUpload from './CardUpload'
import AddMemberInCard from './AddMemberInCard'

function CardButtonGroup({
  card,
  anchorEl,
  setAnchorEl,
  openMemberDialog,
  setOpenMemberDialog,
  getMemberInCard,
  memberInCard,
  setOpenTimeDialog,
  boardState,
  fetchBoarData
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
      toast.error('Lỗi rồi bro')
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
      <AddMemberInCard
        disabled={boardState !== 'OPEN'}
        boardId={card?.boardId}
        card={card}
        fetchBoarData={fetchBoarData}
      />

      <RenderTooltip
        title="Thành viên"
        icon={<GroupIcon />}
        handleClick={(event) => {
          setAnchorEl(event.currentTarget)
          setOpenMemberDialog(true)
          getMemberInCard()
        }}
        disabled={boardState !== 'OPEN'}
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
        disabled={boardState !== 'OPEN'}
      />

      <CardUpload
        title="Thêm ảnh bìa"
        icon={<ImageIcon />}
        loading={isLoading}
        disabled={boardState !== 'OPEN'}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        inputRef={backgroundRef}
        onChange={handleChangeCardBackground}
      />

      <CardUpload
        title="Đính kèm file"
        icon={<AttachFileIcon />}
        loading={loadingFile}
        disabled={boardState !== 'OPEN'}
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        inputRef={fileRef}
        onChange={handleUploadFile}
      />
    </Box>
  )
}

export default CardButtonGroup
