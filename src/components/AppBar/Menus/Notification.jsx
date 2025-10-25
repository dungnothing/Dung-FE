import { Box, Tooltip, Badge, Menu, MenuItem, Typography, IconButton, Button } from '@mui/material'
import { textColor } from '~/utils/constants'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { CheckCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { markAllAsReadAPI } from '~/apis/notification'
import { setNotifications } from '~/redux/features/comon'

function Notification() {
  const navigate = useNavigate()
  const dipatch = useDispatch()
  const notifications = useSelector((state) => state?.comon?.notifications || [])
  const unReadCount = notifications?.filter((item) => !item.isRead)?.length
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChooseClick = (data) => {
    if (data.boardId) {
      navigate(`/boards/${data.boardId}`)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadAPI()
      const newNotifications = notifications.map((item) => ({ ...item, isRead: true }))
      dipatch(setNotifications(newNotifications))
      toast.success('Đánh dấu thành công')
    } catch (error) {
      toast.error('Danh dau that bai')
    }
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <IconButton onClick={handleClick}>
          <Badge color="error" badgeContent={unReadCount}>
            <NotificationsNoneIcon sx={{ color: textColor }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted={false}
        slotProps={{
          paper: { sx: { mt: 1.5, maxHeight: 600, maxWidth: 360, minWidth: 360 } }
        }}
      >
        <div className="flex flex-col gap-2 px-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-[20px] font-semibold ">Thông báo</p>
            <Button
              startIcon={<CheckCheck size={16} />}
              sx={{ color: '#adb5bd' }}
              size="small"
              onClick={handleMarkAllAsRead}
            >
              Đã đọc
            </Button>
          </div>

          <div className="w-full h-[1px] bg-gray-400 flex justify-center items-center" />
          <div className="w-full h-full">
            {notifications?.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#777' }}>
                Không có thông báo nào
              </Typography>
            ) : (
              notifications?.map((notification) => (
                <MenuItem
                  key={notification._id}
                  onClick={() => {
                    handleChooseClick(notification)
                    handleClose()
                  }}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    width: '100%',
                    whiteSpace: 'normal'
                  }}
                >
                  <img src="https://picsum.photos/32/32" alt="" className="w-[32px] h-[32px] rounded-full" />
                  <p className="flex-1 break-words">{notification.content}</p>
                </MenuItem>
              ))
            )}
          </div>
        </div>
      </Menu>
    </Box>
  )
}

export default Notification
