import CloseIcon from '@mui/icons-material/Close'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ShareIcon from '@mui/icons-material/Share'
import {
  CircularProgress,
  ClickAwayListener,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Select,
  FormControl,
  Chip
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { UserMinus, Crown } from 'lucide-react'
import { useConfirm } from 'material-ui-confirm'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  inviteMemberAPI,
  kickMemberAPI,
  searchUserAPI,
  changeMemberRoleAPI,
  transferOwnershipAPI
} from '~/apis/boards'
import useDebounce from '~/helpers/hooks/useDebonce'
import { textColor } from '~/utils/constants'
import { BOARD_ROLES } from '~/utils/permissions'
import { handleError } from '~/utils/messageHelper'
import validation from '~/utils/validation'
import ShareLink from './ShareLink'

const ROLE_LABELS = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
  OBSERVER: 'Observer'
}

const ROLE_COLORS = {
  OWNER: 'warning',
  ADMIN: 'primary',
  MEMBER: 'success',
  OBSERVER: 'default'
}

function MemberManage({ board, allUserInBoard, fetchAllUserInBoard }) {
  const { boardId } = useParams()
  const user = useSelector((state) => state.comon.user)
  const confirm = useConfirm()
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [open, setOpen] = useState(false)
  const [showPopper, setShowPopper] = useState(false)
  const [input, setInput] = useState('')
  const [inviteRole, setInviteRole] = useState(BOARD_ROLES.MEMBER)
  const [isTyping, setIsTyping] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const [shareLinkOpen, setShareLinkOpen] = useState(false)
  const searchTerm = useDebounce(input, 500)
  const inputRef = useRef(null)
  const ignoreSearch = useRef(false)

  const members = Array.isArray(allUserInBoard) ? allUserInBoard : []
  const myMembership = members.find((m) => m.userId?.toString() === user?.userId?.toString())
  const myRole = myMembership?.role
  const isOwner = myRole === BOARD_ROLES.OWNER
  const isAdmin = myRole === BOARD_ROLES.ADMIN
  const canInvite = isOwner || isAdmin
  const canManage = isOwner || isAdmin

  const availableInviteRoles = isOwner
    ? [BOARD_ROLES.ADMIN, BOARD_ROLES.MEMBER, BOARD_ROLES.OBSERVER]
    : [BOARD_ROLES.MEMBER, BOARD_ROLES.OBSERVER]

  const handleSearchUser = async () => {
    if (ignoreSearch.current) {
      ignoreSearch.current = false
      return
    }
    if (!searchTerm || searchTerm.trim() === '') {
      setSearchResult([])
      setIsTyping(false)
      return
    }
    try {
      setSearchLoading(true)
      const response = await searchUserAPI(searchTerm)
      setSearchResult(response)
    } catch (error) {
      toast.error('Lỗi khi tìm kiếm người dùng')
      setSearchResult([])
    } finally {
      setSearchLoading(false)
      setIsTyping(false)
    }
  }

  const getAllUser = async () => {
    try {
      setLoadingUser(true)
      await fetchAllUserInBoard()
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
      if (inviteRole === BOARD_ROLES.ADMIN) {
        try {
          await confirm({
            title: 'Mời làm Admin',
            description:
              'Admin sẽ có quyền quản lý workflow (tạo/sửa/xoá/khoá cột) và mời/kick thành viên thường. Chỉ phong Admin cho người bạn tin tưởng.',
            confirmationText: 'Tôi hiểu, mời',
            cancellationText: 'Hủy'
          })
        } catch {
          return
        }
      }
      setLoading(true)
      await inviteMemberAPI(boardId, { email: input, role: inviteRole })
      toast.success('Mời thành công')
      setInput('')
      getAllUser()
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleKick = async (targetUserId, targetName, targetRole) => {
    try {
      await confirm({
        title: 'Xóa thành viên',
        description: (
          <span>
            Bạn có chắc muốn xóa{' '}
            <span style={{ fontFamily: 'cursive', fontStyle: 'italic', color: 'purple' }}>{targetName}</span>{' '}
            ({ROLE_LABELS[targetRole]}) khỏi bảng?
          </span>
        ),
        confirmationText: 'Xóa',
        cancellationText: 'Hủy'
      })
      setLoading(true)
      await kickMemberAPI(board._id, targetUserId)
      toast.success('Xóa thành công')
      getAllUser()
    } catch (error) {
      if (error?.name !== 'CancelledError') handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async (targetUserId, newRole) => {
    try {
      setLoading(true)
      await changeMemberRoleAPI(board._id, targetUserId, newRole)
      toast.success('Đổi vai trò thành công')
      getAllUser()
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTransferOwnership = async (targetUserId, targetName) => {
    try {
      await confirm({
        title: 'Chuyển quyền Owner',
        description: (
          <span>
            Bạn sẽ chuyển quyền Owner cho{' '}
            <span style={{ fontFamily: 'cursive', fontStyle: 'italic', color: 'purple' }}>{targetName}</span>
            . Sau khi chuyển, bạn sẽ trở thành Member thường. Hành động này không thể hoàn tác.
          </span>
        ),
        confirmationText: 'Chuyển quyền',
        cancellationText: 'Hủy'
      })
      setLoading(true)
      await transferOwnershipAPI(board._id, targetUserId)
      toast.success('Chuyển Owner thành công')
      getAllUser()
    } catch (error) {
      if (error?.name !== 'CancelledError') handleError(error)
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

  const sortedMembers = [...members].sort((a, b) => {
    const rolePriority = { OWNER: 0, ADMIN: 1, MEMBER: 2, OBSERVER: 3 }
    return (rolePriority[a.role] ?? 99) - (rolePriority[b.role] ?? 99)
  })

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: textColor,
            borderColor: textColor,
            minWidth: 'unset',
            '& .MuiButton-startIcon': { mr: { xs: 0, sm: '8px' } },
            px: { xs: '8px', sm: '15px' },
            '&:hover': { borderColor: textColor }
          }}
          onClick={() => setOpen(true)}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Thành viên
          </Box>
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
          setInput('')
          setSearchResult([])
          setShowPopper(false)
        }}
        sx={{ '& .MuiDialog-paper': { width: '1060px', height: '500px' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DialogTitle sx={{ pb: 0, color: textColor }}>Quản lý thành viên</DialogTitle>
          <IconButton
            onClick={() => {
              setOpen(false)
              setInput('')
              setSearchResult([])
              setShowPopper(false)
            }}
            sx={{ pr: 3, '&:hover': { bgcolor: 'transparent' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {canInvite && (
          <Box>
            <DialogContent
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'stretch',
                position: 'relative',
                pb: 1,
                '& .MuiOutlinedInput-root': { height: 36 },
                '& .MuiButton-root': { height: 36 }
              }}
            >
              <ClickAwayListener onClickAway={() => setShowPopper(false)}>
                <Box sx={{ flex: 1, position: 'relative' }}>
                  <TextField
                    fullWidth
                    ref={inputRef}
                    placeholder="Tên/Email"
                    variant="outlined"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      setShowPopper(true)
                      setIsTyping(true)
                      ignoreSearch.current = false
                    }}
                    onFocus={() => {
                      if (input.trim() !== '') setShowPopper(true)
                    }}
                    slotProps={{
                      input: {
                        sx: {
                          '& input': { padding: '0 14px', fontSize: '14px', color: textColor }
                        }
                      }
                    }}
                  />
                  <Popper
                    open={showPopper && input.trim() !== ''}
                    anchorEl={inputRef.current}
                    placement="bottom-start"
                    style={{ zIndex: 1300, width: inputRef.current?.offsetWidth }}
                    disablePortal={false}
                  >
                    <Paper elevation={3} sx={{ maxHeight: 300, overflowY: 'auto', mt: 0.5 }}>
                      <MenuList>
                        {(searchLoading || isTyping) && input.trim() !== '' ? (
                          <MenuItem disabled sx={{ justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={24} />
                          </MenuItem>
                        ) : searchResult?.length > 0 ? (
                          searchResult?.map((u, index) => (
                            <MenuItem
                              key={index}
                              onClick={() => {
                                ignoreSearch.current = true
                                setInput(u?.email || u?.userName)
                                setShowPopper(false)
                              }}
                              sx={{ display: 'flex', gap: 1.5, alignItems: 'center', py: 1.5 }}
                            >
                              <Avatar alt={u?.userName} src={u?.userAvatar || ''} sx={{ width: 36, height: 36 }} />
                              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <Typography variant="body2" sx={{ color: textColor, fontWeight: 500 }}>
                                  {u?.userName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {u?.email}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))
                        ) : input.trim() !== '' ? (
                          <MenuItem disabled sx={{ justifyContent: 'center', py: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Không tìm thấy người dùng
                            </Typography>
                          </MenuItem>
                        ) : null}
                      </MenuList>
                    </Paper>
                  </Popper>
                </Box>
              </ClickAwayListener>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  sx={{ '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center' } }}
                >
                  {availableInviteRoles.map((r) => (
                    <MenuItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                onClick={handleInvite}
                sx={{ color: textColor, borderColor: textColor }}
                disabled={loading || input.trim() === ''}
              >
                Mời
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: textColor,
                  borderColor: textColor,
                  minWidth: 'unset',
                  '&:hover': { borderColor: textColor }
                }}
                onClick={() => {
                  setOpen(false)
                  setShareLinkOpen(true)
                }}
              >
                <ShareIcon size={20} />
              </Button>
            </DialogContent>
          </Box>
        )}

        <DialogTitle sx={{ pt: 1, pb: 1, color: textColor, fontSize: '1rem' }}>Danh sách</DialogTitle>
        <Box sx={{ maxHeight: '260px', overflowY: 'auto', px: 3, pb: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
          {loadingUser ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <Box className="flex flex-col gap-2">
              {sortedMembers.map((m) => {
                const isSelf = m.userId?.toString() === user?.userId?.toString()
                const targetIsOwner = m.role === BOARD_ROLES.OWNER
                const targetIsAdmin = m.role === BOARD_ROLES.ADMIN
                const canKick =
                  canManage && !isSelf && !targetIsOwner && (isOwner || (isAdmin && !targetIsAdmin))
                const canChangeRole =
                  canManage && !isSelf && !targetIsOwner &&
                  (isOwner || (isAdmin && !targetIsAdmin))
                const canTransferHere = isOwner && !isSelf && !targetIsOwner

                const availableTargetRoles = isOwner
                  ? [BOARD_ROLES.ADMIN, BOARD_ROLES.MEMBER, BOARD_ROLES.OBSERVER]
                  : [BOARD_ROLES.MEMBER, BOARD_ROLES.OBSERVER]

                return (
                  <Box
                    key={m.userId?.toString()}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.5
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                      <Avatar alt={m.userName} src={m.avatar || ''} sx={{ width: 40, height: 40 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Typography sx={{ color: textColor, fontWeight: 500, fontSize: '0.9rem' }}>
                            {m.userName}
                          </Typography>
                          {isSelf && (
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>(bạn)</Typography>
                          )}
                        </Box>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{m.email}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                      {canChangeRole ? (
                        <FormControl size="small" sx={{ minWidth: 110 }}>
                          <Select
                            value={m.role}
                            onChange={(e) => handleChangeRole(m.userId?.toString(), e.target.value)}
                            disabled={loading}
                          >
                            {availableTargetRoles.map((r) => (
                              <MenuItem key={r} value={r}>
                                {ROLE_LABELS[r]}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip
                          label={ROLE_LABELS[m.role] || m.role}
                          color={ROLE_COLORS[m.role]}
                          size="small"
                          icon={targetIsOwner ? <Crown size={14} /> : undefined}
                        />
                      )}
                      {canTransferHere && (
                        <IconButton
                          title="Chuyển quyền Owner"
                          onClick={() => handleTransferOwnership(m.userId?.toString(), m.userName)}
                          disabled={loading}
                        >
                          <Crown size={16} />
                        </IconButton>
                      )}
                      {canKick && (
                        <IconButton
                          title="Xóa khỏi bảng"
                          onClick={() => handleKick(m.userId?.toString(), m.userName, m.role)}
                          disabled={loading}
                        >
                          <UserMinus size={16} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
      </Dialog>

      <ShareLink board={board} open={shareLinkOpen} onClose={() => setShareLinkOpen(false)} />
    </>
  )
}

export default MemberManage
