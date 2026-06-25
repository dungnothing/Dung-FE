import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Switch,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  InputAdornment
} from '@mui/material'
import { toast } from 'react-toastify'
import { Copy, X, CheckCircle, Lock } from 'lucide-react'
import { getShareLinkAPI, enableShareLinkAPI, updateExpirationAPI, disableShareLinkAPI } from '~/apis/shareLinks'
import { textColor } from '~/utils/constants'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { handleError } from '~/utils/messageHelper'

function ShareLink({ board, open, onClose }) {
  const { boardId } = useParams()
  const user = useSelector((state) => state.comon.user)
  const [loading, setLoading] = useState(false)
  const [shareLink, setShareLink] = useState(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [expiresAt, setExpiresAt] = useState(null)
  const [tempExpiresAt, setTempExpiresAt] = useState(null)

  const isAdmin = user?.userId === board?.adminId

  const fetchShareLink = async () => {
    try {
      setLoading(true)
      const data = await getShareLinkAPI(boardId)
      setIsEnabled(data.isEnabled)
      setShareLink(data.token)
      setExpiresAt(data.expiresAt)
      setTempExpiresAt(data.expiresAt)
    } catch (error) {
      handleError(error, 'Lỗi khi lấy share link')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchShareLink()
    }
  }, [open])

  const handleToggle = async (e) => {
    const enabled = e.target.checked
    try {
      setLoading(true)
      if (enabled) {
        const data = await enableShareLinkAPI(boardId, expiresAt)
        setShareLink(data.token)
        setIsEnabled(true)
        toast.success('Bật chia sẻ link thành công')
      } else {
        await disableShareLinkAPI(boardId)
        setIsEnabled(false)
        setShareLink(null)
        toast.success('Tắt chia sẻ link thành công')
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateExpiration = async () => {
    try {
      setLoading(true)
      const data = await updateExpirationAPI(boardId, tempExpiresAt)
      setExpiresAt(data.expiresAt)
      toast.success('Cập nhật hạn sử dụng thành công')
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (!shareLink) return
    const link = `${window.location.origin}/board/${boardId}/share/${shareLink}`
    navigator.clipboard.writeText(link)
    toast.success('Sao chép link thành công')
  }

  const formatExpiresAt = (date) => {
    if (!date) return 'Không bao giờ hết hạn'
    return new Date(date).toLocaleString('vi-VN')
  }

  const shareLink_full = shareLink ? `${window.location.origin}/board/${boardId}/share/${shareLink}` : ''

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '90%', sm: '550px' },
          borderRadius: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5 }}>
        <DialogTitle sx={{ color: textColor, fontWeight: 600, p: 0, fontSize: '1.3rem' }}>
          Chia sẻ qua link
        </DialogTitle>
        <IconButton onClick={onClose} size="small" sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}>
          <X size={22} />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Toggle Section */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 1.5,
                border: (theme) => `1px solid ${theme.palette.divider}`
              }}
            >
              <Box>
                <Typography sx={{ color: textColor, fontWeight: 600, mb: 0.3 }}>
                  Bật chia sẻ link
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {isAdmin ? 'Bất cứ ai có link cũng có thể truy cập' : 'Chỉ admin có thể bật/tắt'}
                </Typography>
              </Box>
              <Switch
                disabled={!isAdmin || loading}
                checked={isEnabled}
                onChange={handleToggle}
                size="medium"
              />
            </Box>

            {/* Share Link Section */}
            {isEnabled && shareLink && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Link Display */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ color: textColor, fontWeight: 600, fontSize: '0.95rem' }}>
                    Link chia sẻ
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'stretch' }}>
                    <TextField
                      fullWidth
                      value={shareLink_full}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={18} style={{ color: 'rgba(0,0,0,0.4)' }} />
                          </InputAdornment>
                        ),
                        endAdornment: isEnabled && (
                          <InputAdornment position="end">
                            <CheckCircle size={18} style={{ color: '#4caf50' }} />
                          </InputAdornment>
                        )
                      }}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          borderRadius: 1,
                          fontSize: '0.85rem'
                        },
                        '& input': {
                          color: textColor,
                          fontFamily: 'monospace',
                          userSelect: 'all'
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleCopyLink}
                      startIcon={<Copy size={16} />}
                      sx={{
                        whiteSpace: 'nowrap',
                        bgcolor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      Sao chép
                    </Button>
                  </Box>
                </Box>

                {/* Expiration Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography sx={{ color: textColor, fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                      Hạn sử dụng
                    </Typography>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderRadius: 1,
                        border: (theme) => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Typography variant="body2" sx={{ color: textColor, fontWeight: 500 }}>
                        {formatExpiresAt(expiresAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {isAdmin && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                      <TextField
                        type="datetime-local"
                        size="small"
                        label="Đặt hạn sử dụng"
                        value={tempExpiresAt ? new Date(tempExpiresAt).toISOString().slice(0, 16) : ''}
                        onChange={(e) => {
                          const value = e.target.value
                          setTempExpiresAt(value ? new Date(value).toISOString() : null)
                        }}
                        sx={{
                          flex: 1,
                          '& input': {
                            color: textColor,
                            fontSize: '0.9rem'
                          }
                        }}
                        slotProps={{
                          input: {
                            min: new Date().toISOString().slice(0, 16)
                          }
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleUpdateExpiration}
                        disabled={loading || JSON.stringify(tempExpiresAt) === JSON.stringify(expiresAt)}
                        sx={{
                          color: textColor,
                          borderColor: textColor,
                          '&:disabled': { opacity: 0.5 }
                        }}
                      >
                        Cập nhật
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Status */}
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                    borderLeft: '3px solid #4caf50',
                    borderRadius: 1
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#2e7d32',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.7
                    }}
                  >
                    <CheckCircle size={14} /> Link đang hoạt động
                  </Typography>
                </Box>
              </Box>
            )}

            {!isEnabled && shareLink && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  borderLeft: '3px solid #f44336',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" sx={{ color: '#c62828' }}>
                  Link chia sẻ đã bị tắt
                </Typography>
              </Box>
            )}

            {!isAdmin && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'rgba(255, 193, 7, 0.1)',
                  borderLeft: '3px solid #ffc107',
                  borderRadius: 1
                }}
              >
                <Typography variant="caption" sx={{ color: '#f57f17', fontWeight: 500 }}>
                  Chỉ admin mới có thể bật/tắt chia sẻ link
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ShareLink
