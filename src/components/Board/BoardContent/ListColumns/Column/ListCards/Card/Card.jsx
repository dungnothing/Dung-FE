/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import { updateCardAPI } from '~/apis/cards'
import { useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'react-toastify'
import { textColor } from '~/utils/constants'
import CardDialog from './CardDialog'
import { getCommentsAPI } from '~/apis/cards'

function Card({ card, boardState, fetchBoarData, isOverlay = false, setBoard, board }) {
  const [hover, setHover] = useState(false)
  const [isDone, setIsDone] = useState(card?.isDone)
  const [isExpired, setIsExpired] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [comments, setComments] = useState([])

  useEffect(() => {
    setIsDone(card?.isDone)
  }, [card])

  useEffect(() => {
    if (card?.endTime) {
      const currentTime = new Date().getTime()
      const endTime = new Date(card?.endTime).getTime()
      setIsExpired(currentTime > endTime)
    }
  }, [card])

  // Sap xep card
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card },
    disabled: openDialog // Disable sorting when dialog is open
  })

  const ghostMode = isDragging || isOverlay

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #f1c40f' : undefined
  }

  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.commentIds?.length || !!card?.attachments?.length
  }

  const handleOnChange = async () => {
    try {
      const newStatus = !isDone
      setIsDone(newStatus)
      const formData = { cardId: card._id, isDone: newStatus }
      await updateCardAPI(card._id, formData)
    } catch (error) {
      toast.error('Đổi nội dung thất bại')
    }
  }

  const timeShow = new Date(card?.endTime).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  const getComments = async (cardId) => {
    try {
      const comments = await getCommentsAPI(cardId)
      const newComments = comments.reverse()
      setComments(newComments)
    } catch (error) {
      toast.error('Lỗi lấy bình luận!')
    }
  }

  return (
    <>
      <MuiCard
        ref={setNodeRef}
        style={dndKitCardStyles}
        key={card._id}
        {...attributes}
        {...(boardState === 'CLOSED' ? {} : listeners)}
        sx={{
          cursor: 'pointer',
          flexShrink: 0,
          boxShadow: '0 1px 1px  rgba(0, 0, 0, 0.2)',
          opacity: card.FE_PlaceholderCard ? '0' : '1',
          minWidth: card.FE_PlaceholderCard ? '242px' : 'unset',
          minHeight: card.FE_PlaceholderCard ? '1px' : 'unset',
          height: card.FE_PlaceholderCard ? '1px' : 'unset',
          pointerEvents: card.FE_PlaceholderCard ? 'none' : 'auto',
          border: '#A9B5DF',
          '&:hover': { borderColor: (theme) => theme.palette.primary.main }
        }}
        onMouseEnter={() => !isDragging && setHover(true)}
        onMouseLeave={() => !isDragging && setHover(false)}
        onClick={() => {
          setOpenDialog(true)
          getComments(card._id)
        }}
      >
        {card?.background && <CardMedia sx={{ height: '140px' }} image={card?.background} />}
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              minHeight: '20px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {(hover || isDone) && !ghostMode && !openDialog && (
                <Checkbox
                  checked={isDone}
                  onChange={handleOnChange}
                  onClick={(e) => e.stopPropagation()}
                  size="small"
                  sx={{
                    color: '#5CB338',
                    '&.Mui-checked': {
                      color: '#5CB338'
                    },
                    width: '20px',
                    height: '20px'
                  }}
                />
              )}
              <Typography sx={{ color: textColor }}>{card?.title}</Typography>
            </Box>
          </Box>
          {card?.endTime && (
            <Typography
              sx={{
                pt: 2,
                opacity: 0.8,
                fontSize: '12px',
                color: isDone ? 'success.main' : isExpired ? 'error.main' : 'success.main'
              }}
            >
              {timeShow}
            </Typography>
          )}
        </CardContent>

        {shouldShowCardActions() && (
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {!!card?.memberIds?.length && (
              <Button size="small" startIcon={<GroupIcon />} sx={{ color: textColor }}>
                {card?.memberIds?.length}
              </Button>
            )}
            {!!card?.commentIds?.length && (
              <Button size="small" startIcon={<CommentIcon />} sx={{ color: textColor }}>
                {card?.commentIds?.length}
              </Button>
            )}
            {!!card?.attachments?.length && (
              <Button size="small" startIcon={<AttachmentIcon />} sx={{ color: textColor }}>
                {card?.attachments?.length}
              </Button>
            )}
          </CardActions>
        )}
      </MuiCard>
      {/**Dialoag card */}
      <CardDialog
        board={board}
        card={card}
        openDialog={openDialog}
        setOpenDialog={() => setOpenDialog(false)}
        time={card?.endTime}
        fetchBoarData={fetchBoarData}
        isExpired={isExpired}
        setBoard={setBoard}
        comments={comments}
        setComments={setComments}
        boardState={boardState}
      />
    </>
  )
}

export default Card
