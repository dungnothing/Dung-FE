import { Dialog, IconButton, Typography, Box, TextField, DialogTitle } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import { toast } from 'react-toastify'
import { updateCardAPI } from '~/apis/cards'
import { useState } from 'react'
import EditTimeCard from './CardTime'
import { useTheme } from '@mui/material/styles'
import { cloneDeep } from 'lodash'
import CardButtonGroup from './CardButton/CardButtonGroup'
import CardDescription from './CardDescription'
import CardAttachment from './CardAttachment'
import CardComments from './CardComments'
import { updateCardInBoard } from '~/utils/formatters'

function CardDialog({
  card,
  openDialog,
  setOpenDialog,
  time,
  isExpired,
  board,
  setBoard,
  comments,
  setComments,
  boardState,
  isBoardClosed
}) {
  const [openTimeDialog, setOpenTimeDialog] = useState(false)
  const [editTitle, setEditTitle] = useState(false)
  // Local draft chi ton tai khi user dang edit. Khi khong edit, hien thi card.title tu prop.
  const [titleDraft, setTitleDraft] = useState('')
  const [isEditting, setIsEditting] = useState(false)
  const [descriptionDraft, setDescriptionDraft] = useState('')

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
      const newDescription = descriptionDraft?.trim() === '' ? '' : descriptionDraft
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
      const trimmed = titleDraft.trim()
      if (trimmed.length > 50) return
      if (trimmed.length === 0 || trimmed === card?.title) {
        setEditTitle(false)
        return
      }
      const formData = { cardId: card._id, title: titleDraft, boardId: board._id }
      await updateCardAPI(card._id, formData)
      setEditTitle(false)
      setNewData('title', titleDraft)
    } catch (error) {
      toast.error(error.response.data.message)
      setEditTitle(false)
    }
  }

  const openTitleEdit = () => {
    setTitleDraft(card?.title ?? '')
    setEditTitle(true)
  }

  const openDescriptionEdit = () => {
    setDescriptionDraft(card?.description ?? '')
    setIsEditting(true)
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
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={handleUpdateCardTitle}
            error={titleDraft.trim().length > 50}
            helperText={titleDraft.trim().length > 50 ? 'Tiêu đề không được vượt quá 50 ký tự' : ' '}
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
            onClick={() => !isBoardClosed && openTitleEdit()}
          >
            {card?.title}
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
                ? 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
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
            handleToggleDone={handleToggleDone}
            onCardUpdated={(updatedCard) => setBoard((prev) => updateCardInBoard(prev, updatedCard._id, updatedCard))}
          />
          <CardDescription
            card={card}
            description={descriptionDraft}
            setDescription={setDescriptionDraft}
            isEditting={isEditting}
            setIsEditting={setIsEditting}
            openEdit={openDescriptionEdit}
            boardState={boardState}
            isBoardClosed={isBoardClosed}
            handleChangeDescription={handleChangeDescription}
            iconColor={iconColor}
          />

          {card?.files?.length > 0 && (
            <CardAttachment
              card={card}
              onCardUpdated={(updatedCard) => setBoard((prev) => updateCardInBoard(prev, updatedCard._id, updatedCard))}
            />
          )}
        </Box>
        {/**Comment */}
        <CardComments
          card={card}
          comments={comments}
          setComments={setComments}
          boardState={boardState}
          isBoardClosed={isBoardClosed}
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
