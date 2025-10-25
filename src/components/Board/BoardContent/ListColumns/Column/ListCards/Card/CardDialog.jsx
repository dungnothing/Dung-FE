import { Dialog, IconButton, Typography, Box, TextField, DialogTitle, Avatar } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateCardAPI, getMemberAPI, createCommentAPI } from '~/apis/cards'
import { useState } from 'react'
import EditTimeCard from './CardTime'
import { useTheme } from '@mui/material/styles'
import { cloneDeep } from 'lodash'
import CardButtonGroup from './CardButton/CardButtonGroup'
import CardDescription from './CardDescription'
import CardAttachment from './CardAttachment'

function CardDialog({
  card,
  openDialog,
  setOpenDialog,
  time,
  isExpired,
  fetchBoarData,
  board,
  setBoard,
  comments,
  setComments,
  boardState
}) {
  const user = useSelector((state) => state.comon.user)
  const [openTimeDialog, setOpenTimeDialog] = useState(false)
  const [openMemberDialog, setOpenMemberDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [memberInCard, setMemberInCard] = useState()
  const [cardTitle, setCardTitle] = useState(card?.title)
  const [editTitle, setEditTitle] = useState(false)
  const [description, setDescription] = useState(card?.description)
  const [isEditting, setIsEditting] = useState(false)

  const [isCommentLoading, setIsCommentLoading] = useState(false)
  const [content, setContent] = useState('')

  const theme = useTheme()
  const iconColor = theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'

  const setNewData = (type, data) => {
    const newBoard = cloneDeep(board)
    const column = newBoard.columns.find((col) => col._id === card.columnId)
    const cardIndex = column.cards.findIndex((c) => c._id === card._id)
    column.cards[cardIndex][type] = data
    setBoard(newBoard)
  }

  const handleChangeDescription = async () => {
    try {
      const newDescription = description?.trim() === '' ? '' : description
      const formData = { cardId: card._id, description: newDescription }
      await updateCardAPI(card._id, formData)
      setIsEditting(false)
      setNewData('description', newDescription)
    } catch (error) {
      toast.error('Loi roi')
    }
  }

  const getMemberInCard = async () => {
    try {
      const members = await getMemberAPI(card._id)
      setMemberInCard(members)
    } catch (error) {
      toast.error('Lỗi lấy thành viên!')
    }
  }

  const handleUpdateCardTitle = async () => {
    try {
      const formData = { cardId: card._id, title: cardTitle }
      await updateCardAPI(card._id, formData)
      setEditTitle(false)
      setNewData('title', cardTitle)
    } catch (error) {
      toast.error(error.response.data.message)
      setCardTitle(card?.title)
      setEditTitle(false)
    }
  }

  const handleCreateComment = async () => {
    try {
      setIsCommentLoading(true)
      const formData = {
        cardId: card._id,
        columnId: card.columnId,
        boardId: card.boardId,
        content: content
      }
      const newComment = await createCommentAPI(formData)
      const newCommentId = newComment._id
      const newBoard = cloneDeep(board)
      const column = newBoard.columns.find((col) => col._id === card.columnId)
      const cardIndex = column.cards.findIndex((c) => c._id === card._id)
      column.cards[cardIndex].commentIds.push(newCommentId)
      setBoard(newBoard)
      setContent('')
      setComments([{ ...formData, _id: newCommentId, createdAt: new Date(), userInfo: user }, ...comments])
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setIsCommentLoading(false)
    }
  }

  const checkTime = (time) => {
    const currentTime = new Date().getTime()
    const timeAgo = new Date(time).getTime()
    const diffTime = (currentTime - timeAgo) / 1000
    const diffMinutes = Math.floor(diffTime / 60)
    const diffHours = Math.floor(diffTime / 3600)
    const diffDays = Math.floor(diffTime / 86400)
    const diffWeeks = Math.floor(diffTime / 604800)

    if (diffMinutes == 0) {
      return 'Vừa xong'
    }

    if (diffMinutes < 60) {
      return `${diffMinutes}m trước`
    }

    if (diffHours < 24) {
      return `${diffHours}h trước`
    }

    if (diffDays < 7) {
      return `${diffDays}d trước`
    }

    if (diffWeeks < 4) {
      return `${diffWeeks}w trước`
    }

    return `${Math.floor(diffTime / 2592000)} tháng trước`
  }

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      maxWidth={false}
      disableEnforceFocus
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            width: '1000px',
            maxHeight: '620px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }
        }
      }}
    >
      <Box
        sx={{
          borderBottom: '1px solid #ccc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      >
        {/* Phần title / TextField */}
        {editTitle && boardState === 'OPEN' ? (
          <TextField
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            onBlur={() => {
              setEditTitle(false)
              if (cardTitle.trim().length > 50) return
              handleUpdateCardTitle()
            }}
            error={cardTitle.trim().length > 50}
            helperText={cardTitle.trim().length > 50 ? 'Tiêu đề không được vượt quá 50 ký tự' : ' '}
            fullWidth
            variant="outlined"
            size="small"
            autoFocus
            sx={{
              px: 3,
              py: 2,
              input: {
                color: textColor,
                fontSize: '20px',
                fontWeight: 500,
                py: '2px',
                pl: '4px'
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (cardTitle.trim().length > 50) return
                handleUpdateCardTitle()
              }
            }}
          />
        ) : (
          <DialogTitle
            sx={{
              color: textColor,
              cursor: 'pointer',
              flex: 1,
              p: 2
            }}
            onClick={() => setEditTitle(true)}
          >
            {cardTitle}
          </DialogTitle>
        )}

        {/* Nút đóng */}
        <IconButton
          disableRipple
          sx={{
            alignSelf: 'flex-start',
            p: 2,
            pt: 2.5
          }}
          onClick={(event) => {
            event.stopPropagation()
            setOpenDialog()
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {card?.background && (
        <div className="w-full flex justify-center items-center bg-[#8590a2]">
          <a href={card?.background} target="_blank" rel="noreferrer">
            <img src={card?.background} alt="" className="w-[270px] h-[152px] object-cover" />
          </a>
        </div>
      )}

      {/* Nội dung chính */}
      <Box sx={{ display: 'flex', gap: 1, width: '100%', height: '100%', overflow: 'hidden', pb: 1 }}>
        <Box
          sx={{
            width: '62%',
            borderRight: '1px solid #ccc',
            pt: 1,
            pb: 2,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxHeight: '100%',
            overflow: 'auto'
          }}
        >
          {time && (
            <Typography sx={{ opacity: 1, color: isExpired ? 'red' : 'green' }} variant="subtitle1">
              {isExpired
                ? `Đã hết hạn lúc: ${new Date(time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - ${new Date(time).toLocaleDateString()}`
                : `Đến hạn lúc: ${new Date(time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - ${new Date(time).toLocaleDateString()}`}
            </Typography>
          )}
          {/**Thanh thao tác */}
          <CardButtonGroup
            card={card}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            openMemberDialog={openMemberDialog}
            setOpenMemberDialog={setOpenMemberDialog}
            getMemberInCard={getMemberInCard}
            memberInCard={memberInCard}
            setOpenTimeDialog={setOpenTimeDialog}
            boardState={boardState}
            fetchBoarData={fetchBoarData}
          />
          <CardDescription
            card={card}
            description={description}
            setDescription={setDescription}
            isEditting={isEditting}
            setIsEditting={setIsEditting}
            boardState={boardState}
            handleChangeDescription={handleChangeDescription}
            iconColor={iconColor}
          />

          {card?.files?.length > 0 && <CardAttachment card={card} fetchBoarData={fetchBoarData} />}
        </Box>
        {/**Comment */}
        <Box sx={{ pt: 1, flexDirection: 'column', gap: 1.5, display: 'flex', width: '38%', pr: 2 }}>
          <Box sx={{ display: 'flex' }}>
            <AutoAwesomeMosaicIcon sx={{ color: textColor }} />
            <Typography sx={{ pl: 1, color: textColor }}>Hoạt động</Typography>
          </Box>
          <TextField
            fullWidth
            placeholder="Viết bình luận..."
            disabled={isCommentLoading || boardState !== 'OPEN'}
            variant="outlined"
            size="small"
            value={content}
            sx={{
              pl: 4,
              color: textColor,
              '& .MuiInputBase-input': {
                cursor: isCommentLoading || boardState !== 'OPEN' ? 'not-allowed' : 'text'
              }
            }}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateComment()
              }
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxHeight: '320px',
              pr: 1,
              width: '100%',
              height: '100%',
              overflowY: 'auto'
            }}
          >
            {comments?.map((comment) => (
              <Box
                key={comment._id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  pl: 2,
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <Avatar
                  alt={comment.userInfo?.userName}
                  src={comment.userInfo?.avatar || ''}
                  sx={{ width: 35, height: 35 }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#E2E5E9'),
                    p: 1,
                    justifyContent: 'center',
                    borderRadius: '12px'
                  }}
                >
                  <div className="flex gap-1 items-center">
                    <div style={{ color: textColor }} className="font-[500] text-[15px]">
                      {comment.userInfo?.userName}
                    </div>
                    <div className={`text-[12px] color-${textColor}`}>{checkTime(comment.createdAt)}</div>
                  </div>
                  <div style={{ color: textColor }} className="text-[13px] whitespace-pre-line break-words break-all">
                    {comment.content}
                  </div>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <EditTimeCard
        board={board}
        openTimeDialog={openTimeDialog}
        handleCloseTimeDialog={() => setOpenTimeDialog(false)}
        card={card}
        setBoard={setBoard}
      />
    </Dialog>
  )
}

export default CardDialog
