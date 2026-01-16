import { Box, Typography, Link, IconButton } from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import XIcon from '@mui/icons-material/X'
import RedditIcon from '@mui/icons-material/Reddit'
import GooglePlay from '~/assets/image-app/chplay.png'
import AppStore from '~/assets/image-app/appstore.png'
import BrandLogo from '~/assets/brand-icon.svg'

const footerData = {
  columns: [
    {
      title: 'Features',
      links: [
        { label: 'Docs', href: '#' },
        { label: 'Integrations', href: '#' },
        { label: 'Automations', href: '#' },
        { label: 'AI', href: '#' },
        { label: 'Dashboards', href: '#' },
        { label: 'Kanban', href: '#' },
        { label: 'Gantt', href: '#' }
      ]
    },
    {
      title: 'Use cases',
      links: [
        { label: 'Marketing', href: '#' },
        { label: 'Project management', href: '#' },
        { label: 'Sales', href: '#' },
        { label: 'Developers', href: '#' },
        { label: 'HR', href: '#' },
        { label: 'IT', href: '#' },
        { label: 'Operations', href: '#' },
        { label: 'Construction', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About us', href: '#' },
        { label: "Careers - We're hiring!", href: '#' },
        { label: 'Insights for leaders', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Customer stories', href: '#' },
        { label: 'Become a partner', href: '#' },
        { label: 'Sustainability & ESG', href: '#' },
        { label: 'Affiliates', href: '#' },
        { label: 'Emergency Response', href: '#' },
        { label: 'Investor relations', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Blog', href: '#' },
        { label: "What's new", href: '#' },
        { label: 'monday academy', href: '#' },
        { label: 'Global events', href: '#' },
        { label: 'monday spaces', href: '#' },
        { label: 'Startup for startup', href: '#' },
        { label: 'App development', href: '#' },
        { label: 'Find a partner', href: '#' },
        { label: 'Hire an expert', href: '#' },
        { label: 'Compare', href: '#' }
      ]
    }
  ]
}

export default function Footer({ isChoice }) {
  return (
    <Box sx={{ bgcolor: '#f6f7fb', px: { xs: 3, md: 6, lg: 10 }, py: { xs: 4, md: 6 } }}>
      {/* Logo Section */}
      <Box sx={{ mb: 4 }}>
        <img src={BrandLogo} alt="" />
      </Box>

      {/* Main Footer Content - Grid Layout */}
      <Box className="flex justify-center items-center">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: { xs: 3, md: 4 },
            mb: 5,
            '& > *': {
              transition: 'all 0.2s ease',
              filter: isChoice ? 'blur(4px) brightness(0.8)' : 'none',
              opacity: isChoice ? 0.8 : 1,
              pointerEvents: isChoice ? 'none' : 'auto'
            },
            maxWidth: '1280px',
            width: '100%'
          }}
        >
          {footerData.columns.map((column, index) => (
            <Box key={index}>
              {column.title && (
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#323338',
                    mb: 2,
                    lineHeight: 1.4
                  }}
                >
                  {column.title}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {column.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    underline="none"
                    sx={{
                      fontSize: 13,
                      color: '#676879',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      lineHeight: 1.5,
                      '&:hover': {
                        color: '#323338'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>

              {/* Extra Section (for monday products column) */}
              {column.extraSection && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#323338',
                      mb: 2,
                      lineHeight: 1.4
                    }}
                  >
                    {column.extraSection.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {column.extraSection.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.href}
                        underline="none"
                        sx={{
                          fontSize: 13,
                          color: '#676879',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          cursor: 'pointer',
                          transition: 'color 0.2s',
                          lineHeight: 1.5,
                          '&:hover': {
                            color: '#323338'
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 3,
          pt: 4,
          borderTop: '1px solid #d0d4e4',
          '& > *': {
            transition: 'all 0.2s ease',
            filter: isChoice ? 'blur(4px) brightness(0.8)' : 'none',
            opacity: isChoice ? 0.8 : 1,
            pointerEvents: isChoice ? 'none' : 'auto'
          }
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1, minWidth: '280px' }}>
          {/* Language & Social Icons Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {/* Social Icons */}
            <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  color: '#676879',
                  width: 32,
                  height: 32,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#e6e9ef',
                    color: '#323338'
                  }
                }}
                onClick={() => window.open('https://www.reddit.com/', '_blank')}
              >
                <RedditIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  color: '#676879',
                  width: 32,
                  height: 32,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#e6e9ef',
                    color: '#323338'
                  }
                }}
                onClick={() => window.open('https://www.linkedin.com/', '_blank')}
              >
                <LinkedInIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  color: '#676879',
                  width: 32,
                  height: 32,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#e6e9ef',
                    color: '#323338'
                  }
                }}
                onClick={() => window.open('https://www.facebook.com/', '_blank')}
              >
                <FacebookIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  color: '#676879',
                  width: 32,
                  height: 32,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#e6e9ef',
                    color: '#323338'
                  }
                }}
                onClick={() => window.open('https://www.youtube.com/', '_blank')}
              >
                <YouTubeIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  color: '#676879',
                  width: 32,
                  height: 32,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#e6e9ef',
                    color: '#323338'
                  }
                }}
                onClick={() => window.open('https://twitter.com/', '_blank')}
              >
                <XIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  color: '#676879',
                  width: 32,
                  height: 32,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#e6e9ef',
                    color: '#323338'
                  }
                }}
                onClick={() => window.open('https://www.instagram.com/', '_blank')}
              >
                <InstagramIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  color: '#676879',
                  width: 32,
                  height: 32,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#e6e9ef',
                    color: '#323338'
                  }
                }}
                onClick={() => window.open('https://www.tiktok.com/', '_blank')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </IconButton>
            </Box>
          </Box>

          {/* Legal Links */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', fontSize: 13 }}>
            <Link
              underline="hover"
              sx={{
                color: '#676879',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#323338' }
              }}
            >
              Legal
            </Link>
            <span style={{ color: '#d0d4e4' }}>|</span>
            <Link
              underline="hover"
              sx={{
                color: '#676879',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#323338' }
              }}
            >
              Terms of Service
            </Link>
            <span style={{ color: '#d0d4e4' }}>|</span>
            <Link
              underline="hover"
              sx={{
                color: '#676879',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#323338' }
              }}
            >
              Privacy policy
            </Link>
            <span style={{ color: '#d0d4e4' }}>|</span>
            <Link
              underline="hover"
              sx={{
                color: '#676879',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#323338' }
              }}
            >
              Your privacy choices
            </Link>
          </Box>

          {/* Copyright */}
          <Typography sx={{ fontSize: 12, color: '#676879', mt: 1 }}>All Rights Reserved © monday.com</Typography>

          {/* Accessibility Statement */}
          <Link
            underline="hover"
            sx={{
              fontSize: 12,
              color: '#676879',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              transition: 'color 0.2s',
              '&:hover': { color: '#323338' }
            }}
          >
            <span>♿</span>
            <span>Accessibility statement</span>
          </Link>
        </Box>

        {/* Right Section - App Download Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <img
            className="cursor-pointer h-[40px] w-auto transition-transform hover:scale-105"
            src={GooglePlay}
            alt="Google Play"
            onClick={() => window.open('https://play.google.com/store', '_blank')}
          />
          <img
            className="cursor-pointer h-[40px] w-auto transition-transform hover:scale-105"
            src={AppStore}
            alt="App Store"
            onClick={() => window.open('https://apps.apple.com/', '_blank')}
          />
        </Box>
      </Box>
    </Box>
  )
}
