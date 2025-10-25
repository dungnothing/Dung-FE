import { ClickAwayListener, Paper, Divider, Button, Box } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { ButtonStyle } from '~/styles/ButtonStyle'
import { useRef } from 'react'
import Product from './Menu/Product'
import Solution from './Menu/Solution'
import Resource from './Menu/Resource'
import { useNavigate } from 'react-router-dom'

function MenuChoice({ open, onClose, introOpen, featureOpen, contactOpen, triggerRef }) {
  const menuRef = useRef(null)
  const navigate = useNavigate()

  const handleClickOutside = (event) => {
    if (triggerRef?.current?.contains(event.target) || menuRef?.current?.contains(event.target)) {
      return
    }
    onClose()
  }

  if (!open) return null

  return (
    <ClickAwayListener onClickAway={handleClickOutside}>
      <Paper
        ref={menuRef}
        sx={{
          position: 'fixed',
          top: '69px',
          right: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '413px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          color: 'black',
          backgroundColor: 'white',
          zIndex: 1200
        }}
      >
        {/* Form trên */}
        {introOpen && <Product onClose={onClose} />}
        {featureOpen && <Solution onClose={onClose} />}
        {contactOpen && <Resource onClose={onClose} />}

        {/* Form dưới */}
        <Box className="h-full bg-[#F0F3FF] flex items-center">
          <Box className="flex gap-1 justify-end m-3 w-full">
            <Button disableRipple sx={ButtonStyle} onClick={() => navigate('/sign-in')}>
              Bắt đầu trải nghiệm
              <ArrowForwardIcon sx={{ fontSize: '16px' }} />
            </Button>
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#DADCE0' }} />
            <Button disableRipple sx={ButtonStyle}>
              Cần tư vấn
              <ArrowForwardIcon sx={{ fontSize: '16px' }} />
            </Button>
          </Box>
        </Box>
      </Paper>
    </ClickAwayListener>
  )
}

export default MenuChoice
