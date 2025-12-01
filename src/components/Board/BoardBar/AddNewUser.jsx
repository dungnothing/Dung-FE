import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { addMemberToBoardAPI, removeMemberFromBoardAPI, searchUserAPI } from '~/apis/boards'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import validation from '~/utils/validation'
import { textColor } from '~/utils/constants'
import { useConfirm } from 'material-ui-confirm'
import { useSelector } from 'react-redux'

function AddNewUser({ board, getAllUserInBoard, allUserInBoard }) {
  const [openInviteDialog, setOpenInviteDialog] = useState(false)
  const [inviteInput, setInviteInput] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [anchorElSearch, setAnchorElSearch] = useState(null)
  const [isSearchingUser, setIsSearchingUser] = useState(false)
  const userRedux = useSelector((state) => state.comon.user)
  const confirm = useConfirm()

  const inviteTextFieldRef = useRef(null)

  const handleInvite = async () => {
    if (!validation.isEmail(inviteInput)) {
      toast.error('Email không hợp lệ')
      return
    }
    try {
      await addMemberToBoardAPI(board._id, { email: inviteInput })
      await getAllUserInBoard()
      toast.success('Mời thành viên thành công')
      setInviteInput('')
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`${error.response.data.message}`)
      } else {
        toast.error('Lỗi khi mời thành viên')
      }
    }
  }

  useEffect(() => {
    const trimmedInput = inviteInput.trim()
    if (validation.isEmail(trimmedInput) || !trimmedInput) {
      setSearchResult([])
      setAnchorElSearch(null)
      setIsSearchingUser(false)
      return
    }
    setIsSearchingUser(true)
    const timeOutId = setTimeout(async () => {
      try {
        const res = await searchUserAPI(trimmedInput)
        const existingMemberIds = new Set([
          allUserInBoard.admin._id,
          ...(allUserInBoard.members || []).map((m) => m._id)
        ])
        const filteredUsers = res.filter((user) => !existingMemberIds.has(user._id))
        setSearchResult(filteredUsers)
        if (inviteTextFieldRef.current) {
          setAnchorElSearch(inviteTextFieldRef.current)
          inviteTextFieldRef.current.focus()
        }
      } catch (error) {
        setSearchResult([])
        toast.error('Lỗi khi tìm kiếm người dùng')
      } finally {
        setIsSearchingUser(false)
      }
    }, 1000)
    return () => clearTimeout(timeOutId)
  }, [inviteInput, allUserInBoard])

  const handleSelectUser = (user) => {
    setInviteInput(user.email)
    setAnchorElSearch(null)
  }

  const handleRemoveMember = async (memberId) => {
    try {
      if (!memberId) {
        toast.error('Không tìm thấy')
        return
      }
      await removeMemberFromBoardAPI(board._id, memberId)
      await getAllUserInBoard()
      toast.success('Xóa thành viên thành công')
    } catch (error) {
      toast.error('Lỗi khi xóa thành viên')
    }
  }

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<PersonAddIcon />}
        sx={{
          color: textColor,
          borderColor: textColor,
          '&:hover': { borderColor: textColor }
        }}
        onClick={() => setOpenInviteDialog(true)}
      >
        Mời
      </Button>
      <Dialog
        open={openInviteDialog}
        onClose={() => setOpenInviteDialog(false)}
        sx={{
          '& .MuiDialog-paper': {
            width: '1060px',
            height: '400px'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DialogTitle sx={{ pb: 0, color: textColor }}>Mời thêm các thành viên</DialogTitle>
          <IconButton onClick={() => setOpenInviteDialog(false)} sx={{ pr: 3, '&:hover': { bgcolor: 'transparent' } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          <DialogContent sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Tên/Email"
              variant="outlined"
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              ref={inviteTextFieldRef}
              InputProps={{
                sx: {
                  height: 40,
                  alignItems: 'center',
                  '& input': {
                    padding: '0 14px',
                    fontSize: '14px',
                    color: textColor
                  }
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={handleInvite}
              sx={{ color: textColor, borderColor: textColor }}
              disabled={isSearchingUser || inviteInput.trim() === ''}
            >
              Mời
            </Button>
            <Menu
              anchorEl={anchorElSearch}
              open={Boolean(anchorElSearch) && inviteInput.trim() !== ''}
              disableRestoreFocus
              onClose={() => setAnchorElSearch(null)}
              sx={{
                '& .MuiPaper-root': {
                  width: inviteTextFieldRef.current ? inviteTextFieldRef.current.clientWidth + 8 : 'auto',
                  maxHeight: 200,
                  overflowY: 'auto',
                  maxWidth: '481px'
                },
                zIndex: (theme) => theme.zIndex.modal + 1
              }}
            >
              {isSearchingUser ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1, color: textColor }} />
                  Đang tìm kiếm...
                </MenuItem>
              ) : searchResult.length > 0 ? (
                searchResult.map((user) => (
                  <MenuItem
                    key={user._id}
                    onClick={() => handleSelectUser(user)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Avatar
                      alt={user.userName || user.email}
                      src={user.avatar || ''}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ color: textColor }}>
                        {user.userName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: textColor }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                inviteInput.trim() !== '' && (
                  <MenuItem disabled sx={{ color: textColor }}>
                    Không tìm thấy người dùng phù hợp
                  </MenuItem>
                )
              )}
            </Menu>
          </DialogContent>
        </Box>
        <DialogTitle sx={{ pt: 0, color: textColor }}>Thành viên</DialogTitle>
        <Box sx={{ maxHeight: '200px', overflowY: 'auto', px: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
          {/* Hiển thị admin nếu có */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar alt={allUserInBoard.admin.adminName} src={allUserInBoard.admin.adminAvatar || ''} />
            <Typography sx={{ color: textColor }}>{allUserInBoard.admin.adminName} (Admin)</Typography>
          </Box>

          {/* Hiển thị danh sách members */}
          <Box>
            {allUserInBoard.members.map((member, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar alt={member.memberName} src={member.memberAvatar || ''} />
                  <Typography sx={{ color: textColor }}>{member.memberName}</Typography>
                </Box>
                {userRedux?.userId === board?.adminId && (
                  <IconButton
                    onClick={() => {
                      confirm({
                        title: 'Xóa thành viên',
                        description: (
                          <span>
                            Bạn có chắc muốn xóa thành viên{' '}
                            <span style={{ fontFamily: 'cursive', fontStyle: 'italic', color: 'purple' }}>
                              {member.memberName}
                            </span>{' '}
                            chứ?
                          </span>
                        ),
                        confirmationText: 'Xóa',
                        cancellationText: 'Hủy'
                      }).then(() => {
                        handleRemoveMember(member.memberId)
                      })
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

export default AddNewUser
