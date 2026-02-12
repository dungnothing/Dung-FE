import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const theme = useTheme()
  if (!mode) {
    return null
  }
  return (
    <FormControl size="small" sx={{ minWidth: 'fit-content' }}>
      <InputLabel
        id="label-select-dark-light-mode"
        sx={{
          color: theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d',
          '&.Mui-focused': { color: theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d' }
        }}
      >
        Mode
      </InputLabel>
      <Select
        value={mode}
        label="Mode"
        onChange={(e) => setMode(e.target.value)}
        sx={{
          color: theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d',
          '.MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d' },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d'
          },
          '.MuiSvgIcon-root': { color: theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d' }
        }}
      >
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', width: '100%' }}>
            <LightModeIcon fontSize="small" />
            <Typography sx={{ display: { xs: 'none', md: 'flex' } }}>Light</Typography>
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', width: '100%' }}>
            <DarkModeIcon fontSize="small" /> <Typography sx={{ display: { xs: 'none', md: 'flex' } }}>Dark</Typography>
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', width: '100%' }}>
            <SettingsBrightnessIcon fontSize="small" />
            <Typography sx={{ display: { xs: 'none', md: 'flex' } }}>System</Typography>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default ModeSelect
