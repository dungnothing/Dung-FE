import { Dialog, IconButton, Typography, Box, TextField, DialogTitle } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import { toast } from 'react-toastify'
import { updateCardAPI } from '~/apis/cards'
import { useState, useEffect } from 'react'
import EditTimeCard from './CardTime'
import { useTheme } from '@mui/material/styles'
import { cloneDeep } from 'lodash'
import CardButtonGroup from './CardButton/CardButtonGroup'
import CardDescription from './CardDescription'
import CardAttachment from './CardAttachment'
import CardComments from './CardComments'

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
  boardState,
  isBoardClosed,
  onCommentCountChange
}) {
  const [openTimeDialog, setOpenTimeDialog] = useState(false)
  const [cardTitle, setCardTitle] = useState(card?.title)
  const [editTitle, setEditTitle] = useState(false)
  const [description, setDescription] = useState(card?.description)
  const [isEditting, setIsEditting] = useState(false)
  const [commentCount, setCommentCount] = useState(card?.commentIds?.length || 0)

  // Forward comment count changes to parent Card component
  useEffect(() => {
    if (onCommentCountChange) {
      onCommentCountChange(commentCount)
    }
  }, [commentCount, onCommentCountChange])

  const theme = useTheme()
  const iconColor = theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'

  const setNewData = (type, data) => {
    const newBoard = cloneDeep(board)
    const column = newBoard.columns.find((col) => col.cardOrderIds?.includes(card._id))
    if (!column) return
    const cardIndex = column.cards.findIndex((c) => c._id === card._id)
    column.cards[cardIndex][type] = data
    setBoard(newBoard)
  }

  const handleChangeDescription = async () => {
    try {
      const newDescription = description?.trim() === '' ? '' : description
      const formData = { cardId: card._id, description: newDescription, boardId: board._id }
      await updateCardAPI(card._id, formData)
      setIsEditting(false)
      setNewData('description', newDescription)
    } catch (error) {
      toast.error('Loi roi')
    }
  }

  const handleUpdateCardTitle = async () => {
    try {
      if (cardTitle.trim().length > 50) {
        setCardTitle(card?.title)
        return
      }
      const formData = { cardId: card._id, title: cardTitle, boardId: board._id }
      await updateCardAPI(card._id, formData)
      setEditTitle(false)
      setNewData('title', cardTitle)
    } catch (error) {
      toast.error(error.response.data.message)
      setCardTitle(card?.title)
      setEditTitle(false)
    }
  }

  const handleToggleDone = async () => {
    try {
      const newStatus = !card?.isDone
      const formData = { cardId: card._id, isDone: newStatus, boardId: board._id }
      await updateCardAPI(card._id, formData)
      setNewData('isDone', newStatus)
    } catch (error) {
      toast.error('Lỗi cập nhật trạng thái')
    }
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
            width: { xs: '100%', sm: '90vw', md: '1000px' },
            maxWidth: '1000px',
            maxHeight: { xs: '90dvh' },
            height: '100%',
            m: { xs: 1, sm: 2 },
            display: 'flex',
            flexDirection: 'column'
          }
        }
      }}
    >
      <Box
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#2c3e50' : '#e4e6ea'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 1.5,
          minHeight: 56,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc'),
          flexShrink: 0
        }}
      >
        {/* Phần title / TextField */}
        {editTitle && !isBoardClosed ? (
          <TextField
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            onBlur={() => {
              handleUpdateCardTitle()
              setEditTitle(false)
            }}
            error={cardTitle.trim().length > 50}
            helperText={cardTitle.trim().length > 50 ? 'Tiêu đề không được vượt quá 50 ký tự' : ' '}
            fullWidth
            variant="standard"
            size="small"
            autoFocus
            sx={{
              input: {
                color: textColor,
                fontSize: '18px',
                fontWeight: 600,
                py: '4px',
                px: 0,
                border: 0
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdateCardTitle()
              }
            }}
          />
        ) : (
          <DialogTitle
            sx={{
              color: textColor,
              cursor: isBoardClosed ? 'default' : 'pointer',
              flex: 1,
              p: 0,
              fontSize: '1.1rem',
              fontWeight: 600,
              lineHeight: 1.4
            }}
            onClick={() => !isBoardClosed && setEditTitle(true)}
          >
            {cardTitle}
          </DialogTitle>
        )}

        {/* Nút đóng */}
        <IconButton
          size="small"
          sx={{ ml: 1, flexShrink: 0, color: 'text.secondary' }}
          onClick={(event) => {
            event.stopPropagation()
            setOpenDialog()
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {card?.background && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)'
                : 'linear-gradient(135deg, #e0e7ff 0%, #f5d0fe 50%, #fce7f3 100%)',
            py: 2,
            flexShrink: 0
          }}
        >
          <a href={card?.background} target="_blank" rel="noreferrer">
            <img
              src={card?.background}
              alt=""
              style={{
                maxHeight: 160,
                maxWidth: '90%',
                objectFit: 'contain',
                borderRadius: 8,
                display: 'block',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
          </a>
        </Box>
      )}

      {/* Nội dung chính */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 0,
          width: '100%',
          height: '100%',
          overflow: { xs: 'auto', sm: 'hidden' },
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0f172a' : '#ffffff')
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: '62%' },
            borderRight: { xs: 'none', sm: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#2c3e50' : '#e4e6ea'}` },
            borderBottom: { xs: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#2c3e50' : '#e4e6ea'}`, sm: 'none' },
            pt: 2.5,
            pb: 3,
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            maxHeight: { xs: 'none', sm: '100%' },
            overflow: { xs: 'visible', sm: 'auto' }
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
            setOpenTimeDialog={setOpenTimeDialog}
            isBoardClosed={isBoardClosed}
            fetchBoarData={fetchBoarData}
            handleToggleDone={handleToggleDone}
          />
          <CardDescription
            card={card}
            description={description}
            setDescription={setDescription}
            isEditting={isEditting}
            setIsEditting={setIsEditting}
            boardState={boardState}
            isBoardClosed={isBoardClosed}
            handleChangeDescription={handleChangeDescription}
            iconColor={iconColor}
          />

          {card?.files?.length > 0 && <CardAttachment card={card} fetchBoarData={fetchBoarData} />}
        </Box>
        {/**Comment */}
        <CardComments
          card={card}
          comments={comments}
          setComments={setComments}
          boardState={boardState}
          isBoardClosed={isBoardClosed}
          onCommentCountChange={setCommentCount}
        />
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
