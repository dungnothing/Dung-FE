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

function AddMemberInCard({ disabled, boardId, card, fetchBoarData }) {
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
      toast.error('Lỗi rồi bro')
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
      await updateCardAPI(card._id, { memberIds: selectedUsers, cardId: card._id })
      fetchBoarData()
      setOpenAnchor(null)
    } catch (error) {
      toast.error('Lỗi rồi bro')
    }
  }

  return (
    <>
      <Tooltip title="Thêm thành viên">
        <Button
          startIcon={<PersonAddIcon />}
          sx={{
            color: textColor,
            border: '1px solid #DCDFE4'
          }}
          onClick={(e) => setOpenAnchor(e.currentTarget)}
          variant="outlined"
          disabled={disabled}
        ></Button>
      </Tooltip>
      <Popover
        anchorEl={openAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={Boolean(openAnchor)}
        onClose={() => setOpenAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              minWidth: '320px',
              height: 'auto',
              maxHeight: '400px',
              display: 'flex',
              flexDirection: 'column'
            }
          }
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex' }}>
          <Typography
            sx={{
              pl: 2,
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            variant="subtitle1"
          >
            Thành viên
          </Typography>
          <IconButton onClick={() => setOpenAnchor(null)} disableRipple>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search */}
        <TextField
          size="small"
          sx={{ pl: 2, pr: 2, width: '100%' }}
          placeholder="Tìm kiếm"
          onChange={(e) => setTerm(e.target.value)}
        />

        {/* Danh sách user */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {users.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {users.map((user) => (
                <Box key={user._id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox checked={selectedUsers.includes(user._id)} onChange={() => handleToggleUser(user._id)} />
                  <Avatar src={user?.avatar} alt="" sizes="" sx={{ width: 30, height: 30 }} />
                  <Typography variant="body2">{user.userName}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography className="flex items-center justify-center p-4">Không tìm thấy thành viên</Typography>
          )}
        </Box>

        {/* Footer: nút submit */}
        <Box sx={{ p: 1, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" sx={{ bgcolor: '#C38FFF' }} onClick={handleSubmit}>
            Thêm
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default AddMemberInCard
