import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { accessViaShareLinkAPI } from '~/apis/shareLinks'
import { handleError } from '~/utils/messageHelper'

function ShareLinkAccess() {
  const { boardId, token } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.comon.user)

  useEffect(() => {
    if (!token || !boardId) return

    const access = async () => {
      // Nếu user chưa đăng nhập, redirect sang login
      if (!user?.userId) {
        navigate(`/sign-in?redirect=/board/${boardId}/share/${token}`)
        return
      }

      try {
        const result = await accessViaShareLinkAPI(token)
        if (result.success) {
          navigate(`/boards/${result.boardId}`)
        }
      } catch (error) {
        handleError(error, 'Không thể truy cập bảng qua link này')
        setTimeout(() => navigate('/dashboard'), 2000)
      }
    }

    access()
  }, [token, boardId, user?.userId, navigate])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: 2
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="h6">Đang kiểm tra quyền truy cập...</Typography>
    </Box>
  )
}

export default ShareLinkAccess
