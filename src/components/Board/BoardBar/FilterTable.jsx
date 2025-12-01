import { Box, Menu, TextField, IconButton, Typography } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import ClearIcon from '@mui/icons-material/Clear'
import CircularProgress from '@mui/material/CircularProgress'

function FilterTable({ anchorFilter, setAnchorFilter, setFilters, filters, filterLoading }) {
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target
    const newValue = checked ? name.toUpperCase() : ''
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: newValue
    }))
  }
  return (
    <Menu
      anchorEl={anchorFilter}
      disableRestoreFocus
      disableAutoFocusItem
      open={Boolean(anchorFilter)}
      onClose={() => setAnchorFilter(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <Box sx={{ width: '280px', px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <div className="flex items-center">
            {filterLoading && <CircularProgress size={14} />}
            <Typography variant="subtitle1" align="center" sx={{ width: '100%' }}>
              Thanh lọc
            </Typography>
          </div>

          <IconButton
            disableRipple
            onClick={() => {
              setAnchorFilter(null)
            }}
            sx={{
              position: 'absolute',
              right: -8,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <ClearIcon />
          </IconButton>
        </Box>
        <Box className="flex flex-col gap-1">
          <Typography variant="subtitle1">Từ khóa</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Nhập từ khóa..."
            value={filters?.term || ''}
            onChange={(e) => setFilters({ ...filters, term: e.target.value })}
          />
        </Box>
        <Typography variant="subtitle1">Ngày hết hạn</Typography>
        <Box sx={{ ml: 1 }}>
          <FormControlLabel
            control={
              <Checkbox name="overdue" size="small" checked={filters.overdue !== ''} onChange={handleCheckboxChange} />
            }
            label="Quá hạn"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="dueTomorrow"
                size="small"
                checked={filters.dueTomorrow !== ''}
                onChange={handleCheckboxChange}
              />
            }
            label="Sẽ hết hạn vào ngày mai"
          />
          <FormControlLabel
            control={
              <Checkbox name="noDue" size="small" checked={filters.noDue !== ''} onChange={handleCheckboxChange} />
            }
            label="Không có ngày hết hạn"
          />
        </Box>
      </Box>
    </Menu>
  )
}

export default FilterTable
