import Box from '@mui/material/Box'

import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip, MenuItem } from '@mui/material'
import { updateBoardDetailsAPI, deleteBoardAPI } from '~/apis/boards'
import { useState } from 'react'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import Menu from '@mui/material/Menu'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import DoneIcon from '@mui/icons-material/Done'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom'
import AddNewUser from './AddNewUser'
import { textColor } from '~/utils/constants'
import { changeAdminAPI } from '~/apis/boards'
import DialogChangeAdmin from './DialogChangeAdmin'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import { addStarBoardAPI, removeStarBoardAPI } from '~/apis/boards'
import { useSelector, useDispatch } from 'react-redux'
import { setStarBoards } from '~/redux/features/comon'
import FilterTable from './FilterTable'
import FilterListIcon from '@mui/icons-material/FilterList'
import useConfirmDialog from '~/helpers/components/useConfirmDialog'

function BoardBar({
  board,
  setBoard,
  allUserInBoard,
  getAllUserInBoard,
  permissions,
  setFilters,
  filters,
  filterLoading
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(board?.title)
  const [visibility, setVisibility] = useState(board?.visibility)
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElMore, setAnchorElMore] = useState(null)
  const [memberId, setMemberId] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [open, setOpen] = useState(false)
  const [anchorFilter, setAnchorFilter] = useState(false)
  const navigate = useNavigate()
  const common = useSelector((state) => state.comon)
  const dispatch = useDispatch()

  const handleUpdateTitle = async () => {
    try {
      await updateBoardDetailsAPI(board._id, { title: editedTitle.trim() })
      setBoard({ ...board, title: editedTitle.trim() })
      setIsEditing(false)
    } catch (error) {
      toast.error(`${error.response.data.message}`)
    }
  }

  const handleVisibilityChange = async (isPrivate) => {
    try {
      await updateBoardDetailsAPI(board._id, { visibility: isPrivate ? 'PRIVATE' : 'PUBLIC' })
      toast.success('Trạng thái bảng đã thay đổi')
      setAnchorElMore(null)
    } catch (error) {
      toast.error(`${error.response.data.message}`)
    }
  }

  const handleChangStateBoard = async () => {
    try {
      const newBoardState = board?.boardState === 'OPEN' ? 'CLOSED' : 'OPEN'
      await updateBoardDetailsAPI(board._id, { boardState: newBoardState })
      setBoard({ ...board, boardState: newBoardState })
      if (newBoardState === 'CLOSED') {
        toast.success('Bảng đã được đóng và dữ liệu sẽ không thể chỉnh sửa')
      }
      setAnchorElMore(null)
    } catch (error) {
      toast.error('Lỗi rồi bro')
    }
  }

  const handleDeleteBoard = async () => {
    try {
      await deleteBoardAPI(board._id)
      toast.success('Xóa bảng thành công')
      setTimeout(() => {
        navigate('/dashboard')
      }, [1000])
    } catch (error) {
      toast.error('Lỗi khi xóa bảng')
    }
  }
  const handleConfirmDeleteBoard = useConfirmDialog({ type: 'bảng', title: board?.title, action: handleDeleteBoard })

  const handleChangeAdmin = async () => {
    try {
      await changeAdminAPI(board._id, memberId)
      toast.success('Thay đổi admin thành công')
      navigate('/dashboard')
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`${error.response.data.message}`)
      } else {
        toast.error('Lỗi khi thay đổi admin')
      }
    }
  }

  const handleConfirmChangeAdmin = useConfirmDialog({
    type: 'bảng',
    title: board?.title,
    action: handleChangeAdmin,
    isChange: true
  })

  const handleStarBoard = async () => {
    try {
      const isStar = common?.starBoards?.some((star) => star._id === board._id)
      if (isStar) {
        await removeStarBoardAPI(board._id)
        dispatch(setStarBoards(common.starBoards.filter((star) => star._id !== board._id)))
      } else {
        await addStarBoardAPI(board._id)
        dispatch(setStarBoards([...common.starBoards, { _id: board._id, title: board.title }]))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        paddingX: 1,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333446' : 'transparent'),
        '&::-webkit-scrollbar-track': { m: 1 }
      }}
    >
      {/** Bên trái */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ pl: 2, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 2 }}>
          {isEditing ? (
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUpdateTitle()
                }
              }}
              onBlur={handleUpdateTitle}
              autoFocus
              variant="outlined"
              sx={{
                fontSize: '1.2rem',
                input: {
                  color: textColor,
                  padding: '4px 8px',
                  height: '32px'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: textColor
                  },
                  '&:hover fieldset': {
                    borderColor: textColor
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: textColor
                  }
                }
              }}
            />
          ) : (
            <Typography
              variant="subtitle2"
              onClick={() => setIsEditing(true)}
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: textColor,
                cursor: 'pointer'
              }}
            >
              {board?.title}
            </Typography>
          )}
          <Box
            ref={(el) => setAnchorEl(el)}
            sx={{
              bgcolor: open ? '#DCDFE4' : 'transparent',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setOpen(!open)}
          >
            <Tooltip title="Trạng thái xem" placement="bottom">
              {visibility === 'PRIVATE' ? (
                <LockIcon sx={{ color: textColor }} />
              ) : (
                <PublicIcon sx={{ color: textColor }} />
              )}
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setOpen(false)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
            >
              <Box sx={{ width: '400px' }}>
                <MenuItem
                  sx={{ whiteSpace: 'normal' }}
                  onClick={() => {
                    handleVisibilityChange(false)
                    setVisibility('PUBLIC')
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                      <PublicIcon fontSize="small" />
                      <ListItemText sx={{ marginLeft: '10px' }}>Public</ListItemText>
                      {visibility === 'PUBLIC' && <DoneIcon fontSize="small" />}
                    </Box>
                    <Box>
                      <Typography>
                        Bất kì ai sử dụng web này đều có thể nhìn thấy. Chỉ thành viên trong nhóm mới có thể chỉnh sửa
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem
                  sx={{ whiteSpace: 'normal' }}
                  onClick={() => {
                    handleVisibilityChange(true)
                    setVisibility('PRIVATE')
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                      <LockIcon fontSize="small" />
                      <ListItemText sx={{ marginLeft: '10px' }}>Private</ListItemText>
                      {visibility === 'PRIVATE' && <DoneIcon fontSize="small" />}
                    </Box>
                    <Box>
                      <Typography>
                        Chỉ thành viên của bảng này mới được xem. Chủ bảng có thể tắt chỉnh sửa thông tin và thêm xóa
                        thành viên
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              </Box>
            </Menu>
          </Box>
          <Tooltip title="Đánh dấu" placement="bottom">
            {common?.starBoards?.some((star) => star._id === board._id) ? (
              <StarIcon onClick={() => handleStarBoard(board._id)} sx={{ color: 'gold', cursor: 'pointer' }} />
            ) : (
              <StarOutlineIcon
                onClick={() => handleStarBoard(board._id)}
                sx={{ cursor: 'pointer', color: textColor }}
              />
            )}
          </Tooltip>
        </Box>
      </Box>

      {/** Bên phải */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          onClick={(e) => {
            setAnchorFilter(e.currentTarget)
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            width: 34,
            height: 34,
            justifyContent: 'center',
            '&:hover': {
              bgcolor: '#DCDFE4'
            },
            '&:active': {
              bgcolor: '#DCDFE4'
            }
          }}
        >
          <FilterListIcon sx={{ color: textColor }} />
        </Box>
        <FilterTable
          anchorFilter={anchorFilter}
          setAnchorFilter={setAnchorFilter}
          setFilters={setFilters}
          filters={filters}
          filterLoading={filterLoading}
        />
        {/*  Invite */}
        <AddNewUser board={board} getAllUserInBoard={getAllUserInBoard} allUserInBoard={allUserInBoard} />

        {/*  Avatar */}
        <AvatarGroup
          max={5}
          sx={{
            gap: '3px',
            '& .MuiAvatar-root': {
              width: '34px',
              height: '34px',
              fontSize: '16px',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            },
            '& .admin-avatar': {
              border: '2px solid #4DA8DA',
              boxSizing: 'border-box'
            }
          }}
        >
          <Tooltip title={allUserInBoard.admin.adminName}>
            <Avatar
              alt={allUserInBoard.admin.adminName}
              src={allUserInBoard.admin.adminAvatar}
              className="admin-avatar"
            />
          </Tooltip>
          {allUserInBoard.members.map((user, index) => (
            <Tooltip title={user.memberName} key={index}>
              <Avatar alt={user.memberName} src={user.memberAvatar} />
            </Tooltip>
          ))}
        </AvatarGroup>
        {/*  Nút more thêm tính năng đóng mở bảng và xóa bảng */}
        <Box>
          <MoreVertIcon
            sx={{ color: textColor, cursor: 'pointer' }}
            onClick={(e) => setAnchorElMore(e.currentTarget)}
          />
          <Menu anchorEl={anchorElMore} open={Boolean(anchorElMore)} onClose={() => setAnchorElMore(null)}>
            <MenuItem onClick={handleChangStateBoard}>
              {board?.boardState === 'OPEN' ? 'Đóng cửa trái tim' : 'Mở cửa trái tim'}
            </MenuItem>
            <MenuItem disabled={!permissions?.DELETE_BOARD} onClick={handleConfirmDeleteBoard}>
              Xóa bảng
            </MenuItem>
            <MenuItem disabled={!permissions?.CHANGE_ADMIN} onClick={() => setOpenDialog(true)}>
              Thay đổi admin
            </MenuItem>
          </Menu>
        </Box>
        {/* Dialog thay đổi admin */}
        <DialogChangeAdmin
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          board={board}
          getAllUserInBoard={getAllUserInBoard}
          allUserInBoard={allUserInBoard}
          setMemberId={setMemberId}
          handleConfirmChangeAdmin={handleConfirmChangeAdmin}
          memberId={memberId}
        />
      </Box>
    </Box>
  )
}

export default BoardBar
