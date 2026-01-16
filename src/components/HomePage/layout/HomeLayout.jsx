import { Box, Divider } from '@mui/material'
import Header from '../sections/Header/Header'
import Footer from '../sections/Footer/Footer'
import { useState, useRef } from 'react'
import { Outlet } from 'react-router-dom'

function HomeLayout() {
  const [isChoice, setIsChoice] = useState(false)
  const onTopRef = useRef(null)

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        maxWidth: '100vw',
        color: 'black',
        backgroundColor: 'white'
      }}
    >
      <Header setIsChoice={setIsChoice} onTopRef={onTopRef} />
      <Outlet context={isChoice} />
      <Divider sx={{ mt: 10, mr: 4, ml: 4 }} />
      <Footer isChoice={isChoice} />
    </Box>
  )
}

export default HomeLayout
