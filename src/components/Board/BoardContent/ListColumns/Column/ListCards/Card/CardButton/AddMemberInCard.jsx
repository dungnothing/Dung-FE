import { Button, Tooltip, Box, IconButton, Typography, TextField, Checkbox, Avatar } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import { useState, useEffect } from 'react'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Popover from '@mui/material/Popover'
import { toast } from 'react-toastify'
import { findUserInBoardAPI } from '~/apis/boards'
import { updateCardAPI } from '~/apis/cards'
import useDebounce from '~/helpers/hooks/useDebonce'
import { useParams } from 'react-router-dom'
import { getErrorMessage } from '~/utils/messageHelper'

function AddMemberInCard({ disabled, card, fetchBoarData, renderTrigger }) {
  const { boardId } = useParams()
  const [openAnchor, setOpenAnchor] = useState(null)
  const [term, setTerm] = useState('')
  const debouncedTerm = useDebounce(term, 500)
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState(card?.memberIds || [])

  const findUserInBoard = async () => {
    try {
      const response = await findUserInBoardAPI(boardId, term)
      setUsers(response)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi khi tìm kiếm người dùng'))
    }
  }

  useEffect(() => {
    if (openAnchor) {
      findUserInBoard()
    }
  }, [debouncedTerm, openAnchor])

  const handleToggleUser = (userId) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSubmit = async () => {
    try {
      await updateCardAPI(card._id, { memberIds: selectedUsers, cardId: card._id, boardId })
      fetchBoarData()
      setOpenAnchor(null)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi khi thêm thành viên'))
    }
  }

  return (
    <>
      {renderTrigger
        ? renderTrigger((e) => setOpenAnchor(e.currentTarget))
        : (
          <Tooltip title="Thành viên" arrow>
            <span>
              <IconButton
                size="small"
                onClick={(e) => setOpenAnchor(e.currentTarget)}
                disabled={disabled}
                sx={{
                  color: textColor,
                  borderRadius: '8px',
                  p: '6px',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
                  '&.Mui-disabled': { opacity: 0.4 }
                }}
              >
                <PersonAddIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )
      }

      <Popover
        anchorEl={openAnchor}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={Boolean(openAnchor)}
        onClose={() => setOpenAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              maxHeight: 420,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }
          }
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 1.5, pb: 1, borderBottom: '1px solid #f0f0f0' }}>
          <Typography sx={{ flex: 1, fontWeight: 600, fontSize: '0.95rem', color: textColor }}>
            Thành viên
          </Typography>
          <IconButton size="small" onClick={() => setOpenAnchor(null)} sx={{ color: 'text.secondary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Search */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Tìm kiếm..."
            onChange={(e) => setTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '8px' }
            }}
          />
        </Box>

        {/* Danh sách user */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 1, pb: 1 }}>
          {users.length > 0 ? (
            users.map((user) => {
              const isSelected = selectedUsers.includes(user._id)
              return (
                <Box
                  key={user._id}
                  onClick={() => handleToggleUser(user._id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    bgcolor: isSelected ? 'rgba(99,91,255,0.06)' : 'transparent',
                    '&:hover': { bgcolor: isSelected ? 'rgba(99,91,255,0.1)' : 'rgba(0,0,0,0.04)' }
                  }}
                >
                  <Avatar src={user?.avatar} alt={user.userName} sx={{ width: 32, height: 32 }} />
                  <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: textColor }}>
                    {user.userName}
                  </Typography>
                  <Checkbox
                    checked={isSelected}
                    size="small"
                    sx={{
                      p: 0,
                      color: '#635FFF',
                      '&.Mui-checked': { color: '#635FFF' }
                    }}
                  />
                </Box>
              )
            })
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Không tìm thấy thành viên
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" size="small" onClick={() => setOpenAnchor(null)}
            sx={{ borderRadius: '8px', textTransform: 'none', color: textColor, borderColor: '#DCDFE4' }}>
            Hủy
          </Button>
          <Button variant="contained" size="small" onClick={handleSubmit}
            sx={{ borderRadius: '8px', textTransform: 'none', bgcolor: '#635FFF', '&:hover': { bgcolor: '#4E4BFF' } }}>
            Lưu
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default AddMemberInCard
