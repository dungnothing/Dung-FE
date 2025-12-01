/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Typography, Card, Avatar, Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllAccessibleBoardsAPI, addStarBoardAPI, removeStarBoardAPI, addRecentBoardAPI } from '~/apis/boards'
import { toast } from 'react-toastify'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import { textColor } from '~/utils/constants'
import { useSelector, useDispatch } from 'react-redux'
import { setStarBoards } from '~/redux/features/comon'
import CreateBoard from '~/helpers/components/CreateBoard'
import CircularProgress from '@mui/material/CircularProgress'

function MainBoard({ searchValue }) {
  const [boards, setBoards] = useState([])
  const [loadBoards, setLoadBoards] = useState(false)
  const [searchedBoards, setSearchedBoards] = useState([])
  const starBoards = useSelector((state) => state.comon.starBoards)
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleClick = async (boardId) => {
    try {
      await addRecentBoardAPI(boardId)
      navigate(`/boards/${boardId}`)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải bảng')
    }
  }

  const loadBoardsList = async () => {
    try {
      setLoadBoards(true)
      const boardsData = await getAllAccessibleBoardsAPI()
      const starredBoardIds = new Set(starBoards.map((star) => star._id))
      const sortedBoards = [...boardsData].sort((a, b) => {
        const aIsStarred = starredBoardIds.has(a._id)
        const bIsStarred = starredBoardIds.has(b._id)

        if (aIsStarred === bIsStarred) {
          return 0
        }
        return bIsStarred ? 1 : -1
      })

      setBoards(sortedBoards)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải bảng')
      setBoards([])
    } finally {
      setLoadBoards(false)
    }
  }

  useEffect(() => {
    loadBoardsList()
  }, [])

  const handleStarBoard = async (boardId) => {
    try {
      const aIsStarred = starBoards?.some((board) => board._id === boardId)
      if (aIsStarred) {
        const remove = await removeStarBoardAPI(boardId)
        dispatch(setStarBoards(starBoards.filter((star) => star._id !== remove._id)))
      } else {
        const add = await addStarBoardAPI(boardId)
        dispatch(setStarBoards([...starBoards, { _id: boardId, title: add.title }]))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)
    }
  }

  useEffect(() => {
    const searchBoards = () => {
      const filteredBoards = boards.filter((board) => board.title.toLowerCase().includes(searchValue.toLowerCase()))
      setSearchedBoards(filteredBoards)
    }
    searchBoards()
  }, [searchValue])

  if (loadBoards) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          height: '100%',
          width: '100%'
        }}
      >
        <CircularProgress />
        <Typography>Đang tải đợi xíu :3</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ color: textColor }}>
        KHÔNG GIAN LÀM VIỆC CỦA BẠN
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: '#3f51b5' }}>D</Avatar>
        <Typography variant="h6" sx={{ color: textColor }}>
          Không gian làm việc
        </Typography>
      </Box>

      {/* Board List */}
      <Grid container spacing={2}>
        {(searchValue ? searchedBoards : boards).map((board) => (
          <Grid key={board._id} sx={{ width: '225px' }}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '10px',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
              }}
            >
              <Box sx={{ position: 'absolute', mt: '8px', ml: '8px' }}>
                <Button
                  onClick={() => handleStarBoard(board._id)}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    minWidth: 'unset',
                    '&:hover': { bgcolor: '#234C6A' }
                  }}
                >
                  {starBoards?.some((item) => item._id === board._id) ? (
                    <StarIcon sx={{ color: 'gold' }} />
                  ) : (
                    <StarOutlineIcon />
                  )}
                </Button>
              </Box>
              <div
                onClick={() => handleClick(board._id)}
                style={{
                  height: 110,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundImage: `url(${board?.boardBackground})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center 80%'
                }}
              />
              <Typography variant="subtitle1  " sx={{ color: textColor, p: 1 }}>
                {board.title}
              </Typography>
            </Card>
          </Grid>
        ))}
        {/* Create new board card */}
        <Grid sx={{ width: '225px' }}>
          <Card
            sx={{
              borderRadius: '10px',
              height: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: (theme) => (theme.palette.mode === 'dark' ? '#282D33' : '#E9EBEE'),
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333C43' : '#DCDFE4')
              }
            }}
            onClick={() => setOpen(true)}
          >
            <Typography
              variant="h6"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: textColor
              }}
            >
              Tạo bảng mới
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <CreateBoard open={open} onClose={() => setOpen(false)} />
    </Box>
  )
}

export default MainBoard
