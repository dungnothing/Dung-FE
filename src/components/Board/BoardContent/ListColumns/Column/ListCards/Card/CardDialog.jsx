import { Dialog, IconButton, Typography, Box, TextField, DialogTitle } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import { toast } from 'react-toastify'
import { updateCardAPI, getMemberAPI } from '~/apis/cards'
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
  onCommentCountChange
}) {
  const [openTimeDialog, setOpenTimeDialog] = useState(false)
  const [openMemberDialog, setOpenMemberDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [memberInCard, setMemberInCard] = useState()
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
        <CardComments
          card={card}
          comments={comments}
          setComments={setComments}
          boardState={boardState}
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
