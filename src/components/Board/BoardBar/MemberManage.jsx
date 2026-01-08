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
import { addMemberToBoardAPI, removeMemberFromBoardAPI, searchUserAPI, getAllUserInBoardAPI } from '~/apis/boards'
import { IconButton, Popper, Paper, MenuList, MenuItem } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BasicLoading from '~/helpers/components/BasicLoading'
import useDebounce from '~/helpers/hooks/useDebonce'
import { useConfirm } from 'material-ui-confirm'
import validation from '~/utils/validation'
import { UserMinus } from 'lucide-react'

function MemberManage({ board }) {
  const { boardId } = useParams()
  const user = useSelector((state) => state.comon.user)
  const confirm = useConfirm()
  const [loading, setLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [allUser, setAllUser] = useState([])
  const searchTerm = useDebounce(input, 500)
  const inputRef = useRef(null)

  const handleSearchUser = async () => {
    if (!searchTerm || searchTerm.trim() === '') {
      setSearchResult([])
      return
    }

    try {
      setLoading(true)
      const response = await searchUserAPI(searchTerm)
      setSearchResult(response)
    } catch (error) {
      toast.error('Lỗi khi tìm kiếm người dùng')
      setSearchResult([])
    } finally {
      setLoading(false)
    }
  }

  const getAllUser = async () => {
    try {
      setLoadingUser(true)
      const response = await getAllUserInBoardAPI(boardId)
      setAllUser(response)
    } catch (error) {
      toast.error('Lỗi khi lấy thông tin người dùng')
    } finally {
      setLoadingUser(false)
    }
  }

  const handleInvite = async () => {
    try {
      if (!validation.isEmail(input)) {
        toast.error('Email không hợp lệ')
        return
      }
      setLoading(true)
      await addMemberToBoardAPI(boardId, { email: input })
      toast.success('Mời thành công')
    } catch (error) {
      toast.error('Lỗi khi mời người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (userId) => {
    try {
      setLoading(true)
      await removeMemberFromBoardAPI(userId)
      toast.success('Mời thành công')
    } catch (error) {
      toast.error('Lỗi khi mời người dùng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearchUser()
  }, [searchTerm])

  useEffect(() => {
    if (!boardId || !open) return
    getAllUser()
  }, [boardId, open])

  return (
    <>
      {loadingUser && <BasicLoading />}
      <Box>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: textColor,
            borderColor: textColor,
            '&:hover': { borderColor: textColor }
          }}
          onClick={() => setOpen(true)}
        >
          Mời
        </Button>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false)
            setInput('')
          }}
          sx={{
            '& .MuiDialog-paper': {
              width: '1060px',
              height: '400px'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <DialogTitle sx={{ pb: 0, color: textColor }}>Mời thêm các thành viên</DialogTitle>
            <IconButton onClick={() => setOpen(false)} sx={{ pr: 3, '&:hover': { bgcolor: 'transparent' } }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box>
            <DialogContent sx={{ display: 'flex', gap: 1, position: 'relative' }}>
              <Box sx={{ flex: 1, position: 'relative' }}>
                <TextField
                  fullWidth
                  ref={inputRef}
                  placeholder="Tên/Email"
                  variant="outlined"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  slotProps={{
                    input: {
                      sx: {
                        height: 40,
                        '& input': {
                          padding: '0 14px',
                          fontSize: '14px',
                          color: textColor
                        }
                      }
                    }
                  }}
                />
                <Popper
                  open={Boolean(inputRef.current) && input.trim() !== ''}
                  anchorEl={inputRef.current}
                  placement="bottom-start"
                  style={{ zIndex: 1300, width: inputRef.current?.offsetWidth }}
                  disablePortal={false}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      maxHeight: 300,
                      overflowY: 'auto',
                      mt: 0.5,
                      boxShadow: '0px 4px 20px rgba(0,0,0,0.1)'
                    }}
                  >
                    <MenuList>
                      {loading ? (
                        <MenuItem disabled sx={{ justifyContent: 'center', py: 2 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Đang tìm kiếm...
                          </Typography>
                        </MenuItem>
                      ) : searchResult?.length > 0 ? (
                        searchResult?.map((user, index) => (
                          <MenuItem
                            key={index}
                            onClick={() => {
                              setInput(user?.email || user?.userName)
                              inputRef.current = null
                            }}
                            sx={{
                              display: 'flex',
                              gap: 1.5,
                              alignItems: 'center',
                              py: 1.5
                            }}
                          >
                            <Avatar alt={user?.userName} src={user?.userAvatar || ''} sx={{ width: 36, height: 36 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                              <Typography variant="body2" sx={{ color: textColor, fontWeight: 500 }}>
                                {user?.userName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {user?.email}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled sx={{ justifyContent: 'center', py: 2 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Không tìm thấy người dùng
                          </Typography>
                        </MenuItem>
                      )}
                    </MenuList>
                  </Paper>
                </Popper>
              </Box>
              <Button
                variant="outlined"
                onClick={handleInvite}
                sx={{ color: textColor, borderColor: textColor }}
                disabled={loading || input.trim() === ''}
              >
                Mời
              </Button>
            </DialogContent>
          </Box>
          <DialogTitle sx={{ pt: 0, color: textColor }}>Thành viên</DialogTitle>
          <Box sx={{ maxHeight: '200px', overflowY: 'auto', px: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
            {/* Hiển thị admin nếu có */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar alt={allUser?.admin?.adminName} src={allUser?.admin?.adminAvatar || ''} />
              <div className="flex flex-col gap-1">
                <p>
                  {allUser?.admin?.adminName} <span>(Admin)</span>
                </p>
                <p className="text-xs opacity-50">{allUser?.admin?.adminEmail}</p>
              </div>
            </Box>

            {/* Hiển thị danh sách members */}
            <Box className="flex flex-col gap-2">
              {allUser?.members?.map((member, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar alt={member?.memberName} src={member?.memberAvatar || ''} />
                    <div className="flex flex-col gap-1">
                      <p>{member?.memberName}</p>
                      <p className="text-xs opacity-50">{member?.memberEmail}</p>
                    </div>
                  </Box>
                  {user?.userId === board?.adminId && (
                    <IconButton
                      onClick={() => {
                        confirm({
                          title: 'Xóa thành viên',
                          description: (
                            <span>
                              Bạn có chắc muốn xóa thành viên{' '}
                              <span style={{ fontFamily: 'cursive', fontStyle: 'italic', color: 'purple' }}>
                                {member?.memberName}
                              </span>{' '}
                              chứ?
                            </span>
                          ),
                          confirmationText: 'Xóa',
                          cancellationText: 'Hủy'
                        }).then(() => {
                          handleRemove(member?.memberId)
                        })
                      }}
                    >
                      <UserMinus size={16} />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Dialog>
      </Box>
    </>
  )
}

export default MemberManage
