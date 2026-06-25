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
  Divider
} from '@mui/material'
import { toast } from 'react-toastify'
import { Copy, X } from 'lucide-react'
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '600px'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DialogTitle sx={{ color: textColor }}>Chia sẻ qua link</DialogTitle>
        <IconButton onClick={onClose} sx={{ mr: 1, '&:hover': { bgcolor: 'transparent' } }}>
          <X size={20} />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: textColor, fontWeight: 500 }}>Bật chia sẻ link</Typography>
              <Switch
                disabled={!isAdmin}
                checked={isEnabled}
                onChange={handleToggle}
              />
            </Box>

            {/* Share Link Section */}
            {isEnabled && shareLink && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5', borderRadius: 1 }}>
                {/* Link Display */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={`${window.location.origin}/board/${boardId}/share/${shareLink}`}
                    InputProps={{ readOnly: true }}
                    size="small"
                    sx={{
                      '& input': {
                        fontSize: '12px',
                        color: textColor
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCopyLink}
                    startIcon={<Copy size={16} />}
                    sx={{ color: textColor, borderColor: textColor }}
                  >
                    Sao chép
                  </Button>
                </Box>

                {/* Expiration */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Hết hạn: {formatExpiresAt(expiresAt)}
                  </Typography>
                  {isAdmin && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                      <TextField
                        type="datetime-local"
                        size="small"
                        value={tempExpiresAt ? new Date(tempExpiresAt).toISOString().slice(0, 16) : ''}
                        onChange={(e) => {
                          const value = e.target.value
                          setTempExpiresAt(value ? new Date(value).toISOString() : null)
                        }}
                        sx={{
                          flex: 1,
                          '& input': {
                            color: textColor,
                            fontSize: '12px'
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
                        sx={{ color: textColor, borderColor: textColor }}
                      >
                        Cập nhật
                      </Button>
                    </Box>
                  )}
                </Box>

                <Typography variant="caption" sx={{ color: 'success.main', fontStyle: 'italic' }}>
                  ✓ Link đang hoạt động
                </Typography>
              </Box>
            )}

            {!isEnabled && (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                Link chia sẻ đã bị tắt
              </Typography>
            )}

            {!isAdmin && (
              <Typography variant="caption" sx={{ color: 'warning.main' }}>
                Chỉ admin mới có thể bật/tắt chia sẻ link
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ShareLink
