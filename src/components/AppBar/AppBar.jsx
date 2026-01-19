import { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import Typography from '@mui/material/Typography'
import Recent from './Menus/Recent'
import Template from './Menus/Template'
import Starred from './Menus/Starred'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Profiles from './Menus/Profiles'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import CreateBoard from '~/helpers/components/CreateBoard'
import Notification from './Menus/Notification'
import { Trello } from 'lucide-react'

function AppBar({ searchValue, setSearchValue, showSearch }) {
  const [open, setOpen] = useState(false)

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1D2125' : 'rgba(255, 255, 255, 0.1)'),
        '&::-webkit-scrollbar-track': { m: 1 },
        borderBottom: '1px solid #ccc'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AppsIcon sx={{ color: textColor }} />
        <Button
          component="a"
          href="/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: textColor
          }}
        >
          <Trello size={24} />
          <Typography
            sx={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: { xs: 'none', md: 'flex' }
            }}
          >
            Wednesday
          </Typography>
        </Button>
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 1,
            flexWrap: 'nowrap',
            alignItems: 'center',
            minWidth: 0
          }}
        >
          <Recent />
          <Starred />
          <Template />
          <Button
            variant="outlined"
            endIcon={<AddCircleIcon />}
            sx={{
              color: textColor,
              borderColor: textColor,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              minWidth: 'auto',
              height: '36px',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}
            onClick={() => setOpen(true)}
          >
            Tạo mới
          </Button>
          <CreateBoard open={open} onClose={() => setOpen(false)} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showSearch && (
          <TextField
            id="search 1"
            label="Search..."
            name="search 1"
            type="text"
            size="small"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
            }}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: textColor }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <CloseIcon
                    fontSize="small"
                    sx={{ color: searchValue ? textColor : 'transparent', cursor: searchValue ? 'pointer' : 'null' }}
                    onClick={() => {
                      setSearchValue('')
                    }}
                  />
                </InputAdornment>
              )
            }}
            sx={{
              minWidth: '120px',
              maxWidth: '180px',
              '& label': { color: textColor },
              '& input': { color: textColor },
              '& label.Mui-focused': { color: textColor },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: textColor },
                '&:hover fieldset': { borderColor: textColor },
                '&.Mui-focused fieldset': { borderColor: textColor }
              }
            }}
          />
        )}
        <ModeSelect />
        <Notification />
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
