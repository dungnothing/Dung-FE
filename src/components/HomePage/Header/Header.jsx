import W from '~/assets/W.svg'
import { useNavigate } from 'react-router-dom'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState, useRef, useEffect } from 'react'
import { Button, Box } from '@mui/material'
import MenuChoice from './MenuChoice'
import { ButtonStyle } from '~/styles/ButtonStyle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

function Header({ setIsChoice, onTopRef }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [introOpen, setIntroOpen] = useState(false)
  const [featureOpen, setFeatureOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const buttonRef = useRef(null)
  const buttonWrapperRef = useRef(null)
  const [activeMenu, setActiveMenu] = useState(null)
  const [isScroll, setIsScroll] = useState(false)

  const handleMenuOpen = (menuType) => {
    const isSameMenu = activeMenu === menuType
    setActiveMenu(isSameMenu ? null : menuType)
    setOpen(!isSameMenu)
    setIntroOpen(!isSameMenu && menuType === 'intro')
    setFeatureOpen(!isSameMenu && menuType === 'feature')
    setContactOpen(!isSameMenu && menuType === 'contact')
    setIsChoice(!isSameMenu)
  }

  const handleClose = () => {
    setOpen(false)
    setActiveMenu(null)
    setIsChoice(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const final = scrollPosition > 0 || open
      setIsScroll(final)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [open])

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header Bar */}
      <Box
        component="header"
        ref={onTopRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          px: { xs: 2, md: 8, lg: 10, xl: 12 },
          maxHeight: '105px',
          width: '100%',
          backgroundColor: '#fff',
          position: 'fixed',
          zIndex: 100
        }}
      >
        {/* Bên trái */}
        <Box ref={buttonWrapperRef} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button disableRipple onClick={() => navigate('/')} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
            <img src={W} alt="" className="w-[40px] h-[40px]" />
            <div className="text-[18px] font-bold text-[#6161ff]">Wednesday</div>
          </Button>

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Box ref={buttonRef}>
              <Button ref={buttonRef} onClick={() => handleMenuOpen('intro')} sx={ButtonStyle}>
                Sản phẩm
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: '16px',
                    transform: activeMenu === 'intro' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                />
              </Button>
            </Box>

            <Button disableRipple sx={ButtonStyle} onClick={() => handleMenuOpen('feature')}>
              Tính năng
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: '16px',
                  transform: activeMenu === 'feature' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s'
                }}
              />
            </Button>

            <Button disableRipple sx={ButtonStyle} onClick={() => handleMenuOpen('contact')}>
              Tài nguyên
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: '16px',
                  transform: activeMenu === 'contact' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s'
                }}
              />
            </Button>
          </Box>
        </Box>

        {/* Bên phải */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            sx={{
              color: '#333446',
              width: { lg: '123px', xs: '110px' },
              height: { lg: '40px', xs: '34px' },
              fontSize: { lg: '14px', xs: '12px' },
              borderRadius: '999px',
              p: 0,
              '&:hover': {
                color: '#5034FF',
                backgroundColor: '#F0F3FF'
              }
            }}
            onClick={() => navigate('/sign-in')}
          >
            Đăng nhập
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: 10, lg: 12 } }} />}
            sx={{
              width: { lg: '123px', xs: '110px' },
              height: { lg: '40px', xs: '34px' },
              fontSize: { lg: '14px', xs: '12px' },
              borderRadius: '999px',
              backgroundColor: '#6161FF',
              p: 0,
              color: 'white'
            }}
            onClick={() => navigate('/sign-up')}
          >
            Đăng ký
          </Button>
        </Box>
      </Box>

      {/* Thanh dưới header */}
      <Box
        sx={{
          position: 'fixed',
          top: '68px',
          left: 0,
          width: '100%',
          height: '1px', // Chiều cao của thanh
          backgroundColor: isScroll ? '#f3f4f6' : 'transparent',
          boxShadow: isScroll ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
          transition: 'background-color 200ms ease, box-shadow 200ms ease',
          zIndex: 50
        }}
      />

      {/* Menu Popper */}
      <MenuChoice
        open={open}
        onClose={handleClose}
        anchorEl={buttonRef.current}
        introOpen={introOpen}
        featureOpen={featureOpen}
        contactOpen={contactOpen}
        triggerRef={buttonWrapperRef}
      />
    </Box>
  )
}

export default Header
