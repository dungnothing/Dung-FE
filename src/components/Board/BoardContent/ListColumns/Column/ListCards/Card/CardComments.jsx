import { Box, TextField, Typography, Avatar, Button, IconButton, InputAdornment, Popper, Paper, MenuList, MenuItem, ClickAwayListener } from '@mui/material'
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { textColor } from '~/utils/constants'
import { toast } from 'react-toastify'
import { createCommentAPI, getCommentsAPI, deleteCommentAPI } from '~/apis/cards'
import { findUserInBoardAPI } from '~/apis/boards'
import { handleError } from '~/utils/messageHelper'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { checkTime } from '~/utils/formatters'
import { useCommentSocketHandlers } from '~/sockets/comment'
import { useParams } from 'react-router-dom'
import useDebounce from '~/helpers/hooks/useDebonce'

// Tim tu "@..." dang go ngay truoc vi tri con tro, tra ve {start, term} hoac null
const findActiveMentionQuery = (text, caretPos) => {
  const upToCaret = text.slice(0, caretPos)
  const atIndex = upToCaret.lastIndexOf('@')
  if (atIndex === -1) return null
  const term = upToCaret.slice(atIndex + 1)
  // Neu co khoang trang/xuong dong sau @ thi khong con dang go mention nua
  if (/\s/.test(term)) return null
  return { start: atIndex, term }
}

function CardComments({ card, isBoardClosed, onCommentCountChange }) {
  const user = useSelector((state) => state.comon.user)
  const [isCommentLoading, setIsCommentLoading] = useState(false)
  const [content, setContent] = useState('')
  const [mentionedUsers, setMentionedUsers] = useState([]) // [{ _id, userName }]
  const [mentionQuery, setMentionQuery] = useState(null) // { start, term } | null
  const [mentionResults, setMentionResults] = useState([])
  const debouncedMentionTerm = useDebounce(mentionQuery?.term ?? '', 300)
  const inputRef = useRef(null)
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
        handleError(error, 'Lỗi tải comments')
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

  // Tim goi y thanh vien board khi dang go @...
  useEffect(() => {
    if (!mentionQuery) {
      setMentionResults([])
      return
    }
    let ignore = false
    findUserInBoardAPI(boardId, debouncedMentionTerm)
      .then((response) => {
        if (!ignore) setMentionResults(response || [])
      })
      .catch(() => {
        if (!ignore) setMentionResults([])
      })
    return () => {
      ignore = true
    }
  }, [debouncedMentionTerm, mentionQuery, boardId])

  const handleContentChange = (e) => {
    const value = e.target.value
    const caretPos = e.target.selectionStart
    setContent(value)

    // Cac userName da mention nhung khong con xuat hien nguyen trong text nua thi bo khoi danh sach gui
    setMentionedUsers((prev) => prev.filter((m) => value.includes(`@${m.userName}`)))

    setMentionQuery(findActiveMentionQuery(value, caretPos))
  }

  const handleSelectMention = (mentionUser) => {
    if (!mentionQuery) return
    const before = content.slice(0, mentionQuery.start)
    const after = content.slice(mentionQuery.start + 1 + mentionQuery.term.length)
    const inserted = `@${mentionUser.userName} `
    const nextContent = `${before}${inserted}${after}`

    setContent(nextContent)
    setMentionedUsers((prev) => (prev.some((m) => m._id === mentionUser._id) ? prev : [...prev, mentionUser]))
    setMentionQuery(null)
    setMentionResults([])

    // Dua focus + con tro ve ngay sau phan vua chen
    requestAnimationFrame(() => {
      const el = inputRef.current?.querySelector('input') || inputRef.current
      if (el) {
        const pos = before.length + inserted.length
        el.focus()
        el.setSelectionRange?.(pos, pos)
      }
    })
  }

  const handleLoadMore = async () => {
    try {
      setIsLoadingMore(true)
      const nextPage = currentPage + 1
      const result = await getCommentsAPI(card._id, nextPage, limit)

      setComments((prev) => [...prev, ...(result.comments || [])])
      setTotalCount(result.totalCount || 0)
      setCurrentPage(result.currentPage || nextPage)
      setHasMore(result.hasMore || false)
    } catch (error) {
      handleError(error, 'Lỗi tải thêm comments')
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleCreateComment = async () => {
    try {
      setIsCommentLoading(true)
      // Chi gui mention nao con xuat hien nguyen trong noi dung (tranh gui mention da bi xoa/sua text)
      const mentions = mentionedUsers
        .filter((m) => content.includes(`@${m.userName}`))
        .map((m) => m._id)
      const formData = {
        cardId: card._id,
        boardId: boardId,
        content: content,
        mentions
      }
      const newComment = await createCommentAPI(formData)
      setComments((prevComments) => [newComment, ...prevComments])
      setTotalCount((prev) => prev + 1)
      setContent('')
      setMentionedUsers([])
      setMentionQuery(null)
    } catch (error) {
      handleError(error, 'Lỗi tạo comment')
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
      handleError(error, 'Lỗi xóa comment')
    }
  }

  // Tach content thanh cac doan text/mention de highlight dung ten trong mentionsInfo (tranh bôi nham "@" ngau nhien)
  const renderCommentContent = (text, mentionsInfo) => {
    if (!mentionsInfo || mentionsInfo.length === 0) return text
    const names = [...new Set(mentionsInfo.map((m) => m.userName))].sort((a, b) => b.length - a.length)
    const pattern = new RegExp(`(@(?:${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?=[\\s.,!?;:)]|$))`, 'g')
    return text.split(pattern).map((part, index) => {
      const isMention = part.startsWith('@') && names.includes(part.slice(1))
      return isMention ? (
        <Typography key={index} component="span" sx={{ color: '#635FFF', fontWeight: 600, fontSize: 'inherit' }}>
          {part}
        </Typography>
      ) : (
        part
      )
    })
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
      <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', width: '100%', position: 'relative' }}>
        <Avatar alt={user?.userName} src={user?.avatar || ''} sx={{ width: 32, height: 32, flexShrink: 0, mt: 0.25 }} />
        <TextField
          ref={inputRef}
          fullWidth
          placeholder="Viết bình luận... (gõ @ để nhắc ai đó)"
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
          onChange={handleContentChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !(mentionQuery && mentionResults.length > 0)) {
              handleCreateComment()
            } else if (e.key === 'Escape') {
              setMentionQuery(null)
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

        <Popper
          open={Boolean(mentionQuery) && mentionResults.length > 0}
          anchorEl={inputRef.current}
          placement="top-start"
          style={{ zIndex: 1300, width: inputRef.current?.offsetWidth }}
        >
          <ClickAwayListener onClickAway={() => setMentionQuery(null)}>
            <Paper elevation={3} sx={{ maxHeight: 240, overflowY: 'auto', mb: 0.5 }}>
              <MenuList>
                {mentionResults.map((mentionUser) => (
                  <MenuItem
                    key={mentionUser._id}
                    onClick={() => handleSelectMention(mentionUser)}
                    sx={{ display: 'flex', gap: 1.25, alignItems: 'center', py: 1 }}
                  >
                    <Avatar
                      alt={mentionUser.userName}
                      src={mentionUser.avatar || ''}
                      sx={{ width: 28, height: 28 }}
                    />
                    <Typography variant="body2" sx={{ color: textColor }}>
                      {mentionUser.userName}
                    </Typography>
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </ClickAwayListener>
        </Popper>
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
                {renderCommentContent(comment.content, comment.mentionsInfo)}
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
