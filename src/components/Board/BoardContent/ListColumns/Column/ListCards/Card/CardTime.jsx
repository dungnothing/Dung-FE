import { Dialog, DialogContent, IconButton, Typography, Box, Button, DialogTitle } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import { TimePicker } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { updateCardAPI, updateCancelCardAPI } from '~/apis/cards'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'
import { getErrorMessage } from '~/utils/messageHelper'

function EditTimeCard({ openTimeDialog, handleCloseTimeDialog, card, board, setBoard }) {
  // Draft cua picker chi co y nghia trong luc dialog mo. Khi dialog mo, init lai tu card.endTime
  // de phan anh state moi nhat (vd khi nguoi khac update card qua socket).
  const [time, setTime] = useState(null)
  useEffect(() => {
    if (openTimeDialog) {
      setTime(card?.endTime ? dayjs(card?.endTime) : null)
    }
  }, [openTimeDialog, card?.endTime])

  const setNewTime = (newTime) => {
    const newBoard = cloneDeep(board)
    const column = newBoard.columns.find((col) => col.cardOrderIds?.includes(card._id))
    if (!column) return
    const cardIndex = column.cards.findIndex((c) => c._id === card._id)
    column.cards[cardIndex].endTime = newTime ? newTime.toISOString() : null
    setBoard(newBoard)
  }

  const handleUpdateEndTime = async () => {
    try {
      if (!time) {
        toast.error('Vui lòng chọn ngày hợp lệ')
        return
      }
      const formData = { cardId: card._id, endTime: time.toISOString(), boardId: board._id }
      await updateCardAPI(card._id, formData)
      handleCloseTimeDialog()
      setNewTime(time)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi khi cập nhật thời gian'))
    }
  }

  const handleCancelEndTime = async () => {
    try {
      const formData = { cardId: card._id, endTime: null }
      await updateCancelCardAPI(card._id, formData)
      handleCloseTimeDialog()
      setNewTime(null)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi khi hủy thời gian'))
    }
  }

  const bgButton = (theme) => {
    theme.palette.mode === 'dark' ? '#B6C2CF' : '#0073ea'
  }

  return (
    <Dialog
      open={openTimeDialog}
      onClose={handleCloseTimeDialog}
      maxWidth="xs"
      fullWidth
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      sx={{ bottom: '20vh', margin: 'auto' }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}
      >
        <DialogTitle sx={{ color: textColor }}>Chọn thời gian</DialogTitle>
        <IconButton
          sx={{ '&:hover, &:focus, &:active': { background: 'transparent' }, p: 2 }}
          onClick={handleCloseTimeDialog}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ p: 1, color: textColor }}>Ngày hết hạn</Typography>
          <DatePicker
            sx={{ p: 1 }}
            value={time ? dayjs(time) : null}
            onChange={(newTime) => setTime(newTime ? newTime.toDate() : null)}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ p: 1, color: textColor }}>Giờ hết hạn</Typography>
          <TimePicker
            format="HH:mm"
            fullWidth
            sx={{ p: 1, pl: '20px', color: textColor, width: '248px' }}
            value={time ? dayjs(time) : null}
            onChange={(newTime) => setTime(newTime ? newTime.toDate() : null)}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'end' }}>
          <Button onClick={handleUpdateEndTime} variant="contained" sx={{ bgcolor: bgButton }}>
            Lưu
          </Button>
          <Button onClick={handleCancelEndTime} variant="outlined" sx={{ color: textColor }}>
            Hủy lịch
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default EditTimeCard
