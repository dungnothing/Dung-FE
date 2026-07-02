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

  const myRole = (board?.members || []).find((m) => m.userId?.toString() === user?.userId?.toString())?.role
  const isAdmin = myRole === 'OWNER' || myRole === 'ADMIN'

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DialogTitle sx={{ color: textColor }}>Chia sẻ qua link</DialogTitle>
        <IconButton onClick={onClose} sx={{ mr: 1, '&:hover': { bgcolor: 'transparent' } }}>
          <X size={20} />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ pt: 2.5, pb: 2.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography sx={{ color: textColor, fontWeight: 600, mb: 0.5 }}>Bật chia sẻ link</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {isAdmin ? 'Bất cứ ai có link cũng có thể truy cập' : 'Chỉ admin có thể bật/tắt'}
                </Typography>
              </Box>
              <Switch disabled={!isAdmin || loading} checked={isEnabled} onChange={handleToggle} />
            </Box>

            {/* Share Link */}
            {isEnabled && shareLink && (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ color: textColor, fontWeight: 600 }}>Link chia sẻ</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      value={shareLink_full}
                      InputProps={{ readOnly: true }}
                      size="small"
                      sx={{
                        '& input': {
                          fontSize: '0.85rem',
                          color: textColor
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleCopyLink}
                      startIcon={<Copy size={16} />}
                      sx={{ minWidth: 'fit-content' }}
                    >
                      Sao chép
                    </Button>
                  </Box>
                </Box>

                {/* Expiration */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ color: textColor, fontWeight: 600 }}>Hạn sử dụng</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {formatExpiresAt(expiresAt)}
                  </Typography>
                  {isAdmin && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        type="datetime-local"
                        size="small"
                        value={tempExpiresAt ? new Date(tempExpiresAt).toISOString().slice(0, 16) : ''}
                        onChange={(e) => {
                          const value = e.target.value
                          setTempExpiresAt(value ? new Date(value).toISOString() : null)
                        }}
                        sx={{ flex: 1 }}
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

                {/* Status */}
                <Typography variant="caption" sx={{ color: 'success.main', fontStyle: 'italic' }}>
                  ✓ Link đang hoạt động
                </Typography>
              </>
            )}

            {!isEnabled && shareLink && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Link chia sẻ đã bị tắt
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ShareLink
