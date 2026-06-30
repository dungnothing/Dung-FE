import { Box, TextField, Typography, Avatar, Button, IconButton, InputAdornment } from '@mui/material'
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { textColor } from '~/utils/constants'
import { toast } from 'react-toastify'
import { createCommentAPI, getCommentsAPI, deleteCommentAPI } from '~/apis/cards'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { checkTime } from '~/utils/formatters'
import { useCommentSocketHandlers } from '~/sockets/comment'
import { useParams } from 'react-router-dom'

function CardComments({ card, isBoardClosed, onCommentCountChange }) {
  const user = useSelector((state) => state.comon.user)
  const [isCommentLoading, setIsCommentLoading] = useState(false)
  const [content, setContent] = useState('')
  const { boardId } = useParams()

  // Pagination states
  const [comments, setComments] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const limit = 20

  // Load initial comments
  useEffect(() => {
    const loadInitialComments = async () => {
      try {
        const result = await getCommentsAPI(card._id, 1, limit)
        setComments(result.comments || [])
        setTotalCount(result.totalCount || 0)
        setCurrentPage(result.currentPage || 1)
        setHasMore(result.hasMore || false)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi tải comments')
        setComments([])
        setTotalCount(0)
        setCurrentPage(1)
        setHasMore(false)
      }
    }

    loadInitialComments()
  }, [card._id])

  useEffect(() => {
    if (onCommentCountChange) {
      onCommentCountChange(totalCount)
    }
  }, [totalCount, onCommentCountChange])

  useCommentSocketHandlers(card._id, setComments, setTotalCount)

  const handleLoadMore = async () => {
    try {
      setIsLoadingMore(true)
      const nextPage = currentPage + 1
      const result = await getCommentsAPI(card._id, nextPage, limit)

      setComments((prev) => [...prev, ...(result.comments || [])])
      setCurrentPage(result.currentPage || nextPage)
      setHasMore(result.hasMore || false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi tải thêm comments')
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleCreateComment = async () => {
    try {
      setIsCommentLoading(true)
      const formData = {
        cardId: card._id,
        boardId: boardId,
        content: content
      }
      const newComment = await createCommentAPI(formData)
      setComments((prevComments) => [newComment, ...prevComments])
      setTotalCount((prev) => prev + 1)
      setContent('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi tạo comment')
    } finally {
      setIsCommentLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentAPI(commentId, boardId)

      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId))
      setTotalCount((prev) => prev - 1)

      toast.success('Comment đã được xóa')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi xóa comment')
    }
  }

  return (
    <Box
      sx={{
        pt: 2.5,
        pb: 3,
        flexDirection: 'column',
        gap: 2,
        display: 'flex',
        width: { xs: '100%', sm: '38%' },
        px: { xs: 2, sm: 2.5 },
        flexShrink: 0
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeMosaicIcon sx={{ color: textColor, fontSize: 20 }} />
          <Typography sx={{ color: textColor, fontWeight: 600, fontSize: '15px' }}>Hoạt động</Typography>
        </Box>
        {totalCount > 0 && (
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
            {comments.length}/{totalCount}
          </Typography>
        )}
      </Box>

      {/* Composer: avatar + input pill + Send */}
      <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', width: '100%' }}>
        <Avatar alt={user?.userName} src={user?.avatar || ''} sx={{ width: 32, height: 32, flexShrink: 0, mt: 0.25 }} />
        <TextField
          fullWidth
          placeholder="Viết bình luận..."
          disabled={isCommentLoading || isBoardClosed}
          variant="outlined"
          size="small"
          value={content}
          sx={{
            color: textColor,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9'),
              pr: 0.5,
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3a4a5e' : '#cbd5e1') },
              '&.Mui-focused fieldset': { borderColor: '#635FFF', borderWidth: '1px' }
            },
            '& .MuiInputBase-input': {
              cursor: isCommentLoading || isBoardClosed ? 'not-allowed' : 'text',
              py: '8px'
            }
          }}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreateComment()
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleCreateComment}
                  disabled={isCommentLoading || isBoardClosed || !content.trim()}
                  sx={{
                    color: content.trim() ? '#fff' : 'text.disabled',
                    bgcolor: content.trim() ? '#635FFF' : 'transparent',
                    width: 30,
                    height: 30,
                    transition: 'background 0.15s, color 0.15s',
                    '&:hover': {
                      bgcolor: content.trim() ? '#4f4ad6' : 'action.hover'
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'transparent',
                      color: 'text.disabled'
                    }
                  }}
                >
                  <SendIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          // maxHeight: '420px',
          pr: 0.5,
          width: '100%',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        {comments?.map((comment) => (
          <Box
            key={comment._id}
            sx={{
              display: 'flex',
              gap: 1.25,
              alignItems: 'flex-start',
              width: '100%',
              '&:hover .comment-delete-btn': { opacity: 1 }
            }}
          >
            <Avatar
              alt={comment.userInfo?.userName}
              src={comment.userInfo?.avatar || ''}
              sx={{ width: 32, height: 32, flexShrink: 0, mt: 0.25 }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9'),
                px: 1.5,
                py: 1,
                borderRadius: '12px',
                position: 'relative'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', minWidth: 0 }}>
                  <Typography sx={{ color: textColor, fontWeight: 600, fontSize: '13px' }} noWrap>
                    {comment.userInfo?.userName}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '11px', flexShrink: 0 }}>
                    {checkTime(comment.createdAt)}
                  </Typography>
                </Box>
                {user?.userId === comment.userInfo?._id && !isBoardClosed && (
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteComment(comment._id)}
                    className="comment-delete-btn"
                    sx={{
                      p: 0.5,
                      opacity: 0,
                      transition: 'opacity 0.15s',
                      flexShrink: 0
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                  </IconButton>
                )}
              </Box>
              <Typography
                sx={{
                  color: textColor,
                  fontSize: '13px',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                  mt: 0.25
                }}
              >
                {comment.content}
              </Typography>
            </Box>
          </Box>
        ))}

        {hasMore && (
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <Button
              variant="text"
              size="small"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              sx={{
                color: textColor,
                fontSize: '12px',
                textTransform: 'none'
              }}
            >
              {isLoadingMore ? 'Đang tải...' : 'Xem thêm'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CardComments
