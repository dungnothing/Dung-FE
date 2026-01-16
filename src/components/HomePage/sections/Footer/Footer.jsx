import { Box, Typography, Link, IconButton } from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import { TwiterIcon } from '~/icon/Icon'
import GooglePlay from '~/assets/image-app/chplay.png'
import AppStore from '~/assets/image-app/appstore.png'

export default function Footer({ isChoice }) {
  return (
    <Box sx={{ bgcolor: '#fff', px: { xs: 4, md: 10, lg: 25 }, py: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          rowGap: 3,
          '& > *': {
            transition: 'all 0.2s ease',
            filter: isChoice ? 'blur(4px) brightness(0.8)' : 'none',
            opacity: isChoice ? 0.8 : 1,
            pointerEvents: isChoice ? 'none' : 'auto'
          }
        }}
      >
        {/* LEFT SECTION */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: { xs: '100%', md: '75%' } }}>
          {/*Social */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              bgcolor: 'white',
              color: 'black',
              backgroundColor: 'white'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{ bgcolor: 'white', color: 'black' }}
                size="small"
                onClick={() => window.open('https://www.linkedin.com/', '_blank')}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                sx={{ bgcolor: 'white', color: 'black' }}
                size="small"
                onClick={() => window.open('https://www.facebook.com/', '_blank')}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{ bgcolor: 'white', color: 'black' }}
                size="small"
                onClick={() => window.open('https://www.youtube.com/', '_blank')}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                sx={{ bgcolor: 'white', color: 'black' }}
                size="small"
                onClick={() => window.open('https://www.instagram.com/', '_blank')}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{ bgcolor: 'white', color: 'black' }}
                size="small"
                onClick={() => window.open('https://twitter.com/', '_blank')}
              >
                <TwiterIcon width={24} height={24} />
              </IconButton>
            </Box>
          </Box>

          {/* Policy Links */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', fontSize: 14, width: '100%' }}>
            <Link underline="hover" sx={{ color: '#000', cursor: 'pointer' }}>
              Security
            </Link>
            <span>|</span>
            <Link underline="hover" sx={{ color: '#000', cursor: 'pointer' }}>
              Terms and privacy
            </Link>
            <span>|</span>
            <Link underline="hover" sx={{ color: '#000', cursor: 'pointer' }}>
              Privacy policy
            </Link>
            <span>|</span>
            <Link underline="hover" sx={{ color: '#000', cursor: 'pointer' }}>
              Your privacy choices
            </Link>
            <span>|</span>
            <Link underline="hover" sx={{ color: '#000', cursor: 'pointer' }}>
              Status
            </Link>
          </Box>

          {/* Copyright */}
          <Typography sx={{ fontSize: 12, color: '#666' }}>
            All Rights Reserved © <span className="text-[#11224E]">WND</span>
          </Typography>
        </Box>

        {/* RIGHT SECTION */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2, py: 4 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <img
              className="cursor-pointer max-h-[42px] max-w-[134px]"
              src={GooglePlay}
              alt="Google Play"
              onClick={() => window.open('https://play.google.com/store', '_blank')}
            />
            <img
              className="cursor-pointer max-h-[42px] max-w-[134px]"
              src={AppStore}
              alt="App Store"
              onClick={() => window.open('https://apps.apple.com/', '_blank')}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
