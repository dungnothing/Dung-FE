import { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
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
import CreateBoard from '~/components/Dashboard/CreateBoard'
import Notification from './Menus/Notification'
import { Trello } from 'lucide-react'

function AppBar({ searchValue, setSearchValue, showSearch }) {
  const [open, setOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: { xs: 'none', md: 2 },
        overflowX: 'auto',
        overflowY: 'hidden',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1D2125' : 'rgba(255, 255, 255, 0.1)'),
        '&::-webkit-scrollbar-track': { m: 1 },
        borderBottom: '1px solid #ccc'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          component="a"
          href="/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: textColor,
            minWidth: 'fit-content'
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
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: textColor }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ display: { xs: isSearchFocused || searchValue ? 'flex' : 'none', md: 'flex' } }}
                >
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
              width: isSearchFocused ? 'auto' : { xs: '80px', sm: '180px' },
              '& label': { color: textColor },
              '& label.Mui-focused': { color: textColor },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: textColor },
                '&:hover fieldset': { borderColor: textColor },
                '&.Mui-focused fieldset': { borderColor: textColor },
                paddingLeft: { xs: isSearchFocused ? 1 : 0.5, md: 1 },
                paddingRight: { xs: isSearchFocused ? 1 : 0.5, md: 1 },
                '& .MuiInputAdornment-root': {
                  marginRight: { xs: isSearchFocused ? 1 : 0, md: 1 }
                }
              }
            }}
          />
        )}
        <Box sx={{ display: { xs: isSearchFocused ? 'none' : 'flex', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <ModeSelect />
          <Notification />
        </Box>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
