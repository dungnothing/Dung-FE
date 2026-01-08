import { useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Avatar, Typography, LinearProgress, IconButton } from '@mui/material'
import { Camera, Briefcase, MapPin, CalendarDays } from 'lucide-react'
import BasicInfo from './BasicInfo'
import { toast } from 'react-toastify'
import { updateAvatarAPI } from '~/apis/auth'
import { useDispatch } from 'react-redux'
import { updateUserInfo } from '~/redux/features/comon'
import { textColor } from '~/utils/constants'
import BasicLoading from '~/helpers/components/BasicLoading'

function PersonalInfo() {
  const user = useSelector((state) => state.comon.user)
  const avatarRef = useRef(null)
  const dipatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    avatarRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận các định dạng: JPG, PNG, WEBP!')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Kích thước ảnh tối đa là 5MB!')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      setIsLoading(true)
      const res = await updateAvatarAPI(formData)
      dipatch(updateUserInfo(res))
      avatarRef.current.value = null
      toast.success('Upload thành công')
    } catch (error) {
      toast.error('Upload thất bại:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Tính tỷ lệ hoàn thành hồ sơ
  const rate = useMemo(() => {
    if (!user) return 0
    const fields = [user.userName, user.email, user.phone, user.organization, user.address]
    const filled = fields.filter((v) => v && v.length > 0).length
    return Math.round((filled / fields.length) * 100)
  }, [user])

  return (
    <Box className="w-full flex flex-col gap-2 relative">
      {isLoading && (
        <Box
          sx={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <BasicLoading />
        </Box>
      )}
      {/* Card chính */}
      <Box
        className="relative flex flex-col rounded-[12px]"
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff'),
          boxShadow:
            '0px 2px 1px -1px rgba(107, 114, 128, 0.03), 0px 1px 1px 0px rgba(107, 114, 128, 0.04), 0px 1px 3px 0px rgba(107, 114, 128, 0.08)'
        }}
      >
        {/* Cover */}
        <img
          className="w-full h-[125px] object-cover rounded-t-[12px]"
          src="https://images.pexels.com/photos/140234/pexels-photo-140234.jpeg"
          alt="cover"
        />

        {/* Avatar */}
        <Box className="absolute top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit flex justify-center items-center">
          <Avatar
            src={user?.avatar || '/default-avatar.png'}
            sx={{
              width: 96,
              height: 96,
              border: (theme) => `4px solid ${theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff'}`
            }}
          />
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              bgcolor: '#7C3AED',
              color: 'white',
              width: 26,
              height: 26,
              '&:hover': { bgcolor: '#6D28D9' }
            }}
          >
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} ref={avatarRef} />
            <Camera size={14} />
          </IconButton>
        </Box>

        {/* Thông tin cơ bản */}
        <Box className="flex flex-col items-center mt-[60px] mb-4">
          <Typography variant="h6" sx={{ fontWeight: 600, color: textColor }}>
            {user?.userName || 'Chưa có tên'}
          </Typography>

          <Box className="flex items-center gap-6 mt-1 text-sm" sx={{ color: textColor, opacity: 0.7 }}>
            <Box className="flex items-center gap-1">
              <Briefcase size={14} /> {user?.organization || 'Chưa có chức vụ'}
            </Box>
            <Box className="flex items-center gap-1">
              <MapPin size={14} /> {user?.address || 'Chưa có địa chỉ'}
            </Box>
            <Box className="flex items-center gap-1">
              <CalendarDays size={14} />
              Tham gia:{' '}
              {user?.createdAt
                ? new Date(Number(user.createdAt)).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                : 'N/A'}
            </Box>
          </Box>
        </Box>

        {/* Thanh hoàn thành hồ sơ + nút hành động */}
        <Box className="flex items-center justify-between h-full">
          <Box className="px-6 pb-4 w-80">
            <Typography variant="body2" sx={{ color: textColor, opacity: 0.7, mb: 1 }}>
              Mức độ hoàn thiện
            </Typography>
            <Box className="flex items-center gap-2">
              <LinearProgress
                variant="determinate"
                value={rate}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  flex: 1,
                  backgroundColor: '#E5E7EB',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#16A34A'
                  }
                }}
              />
              <Typography variant="body2" sx={{ color: textColor, opacity: 0.7 }}>
                {rate}%
              </Typography>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box className="px-6 pb-4 w-80">
            <Typography variant="body2" sx={{ color: textColor, opacity: 0.7, mb: 1 }}>
              Trạng thái vip
            </Typography>
            <Box className="flex items-center gap-2">
              <LinearProgress
                variant="determinate"
                value={60}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  flex: 1,
                  backgroundColor: '#E5E7EB',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: user?.isVip ? '#16A34A' : '#FCB53B'
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Component thông tin chi tiết */}
      <BasicInfo />
    </Box>
  )
}

export default PersonalInfo
