import { Box, Button, Typography, Link } from '@mui/material'
import nen from '~/assets/image-background/nen1.jpg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { signInAPI, getGoogleAuthUrlAPI } from '~/apis/auth'
import google from '~/assets/google.svg'
import ForgotPassword from './ForgotPassword'
import Loading from '~/helpers/components/Loading'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm } from 'react-hook-form'
import * as v from 'valibot'
import RHFInput from '~/helpers/hook-form/RHFInput'
import { FormProvider } from 'react-hook-form'

const loginSchema = v.object({
  email: v.pipe(v.string('Email là bắt buộc'), v.nonEmpty('Email là bắt buộc'), v.email('Email không hợp lệ')),
  password: v.pipe(v.string('Mật khẩu là bắt buộc'), v.nonEmpty('Mật khẩu là bắt buộc'))
})

function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
    resolver: valibotResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'all'
  })

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await signInAPI({ email: data.email, password: data.password })

      document.cookie = `accessToken=${response.accessToken}; path=/; max-age=${60 * 60}`
      document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`

      navigate('/dashboard')
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.message) {
        toast.error(error.message)
      } else {
        toast.error('Lỗi khi đăng nhập')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      const response = await getGoogleAuthUrlAPI()
      window.location.href = response.url
    } catch (error) {
      toast.error('Lỗi khi đăng nhập với Google')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', height: '100vh' }}>
        <Loading />
      </Box>
    )
  }

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Box
            sx={{
              background: 'linear-gradient(180deg, #F9F9F9 0%, #FDF3C3 100%)',
              display: 'flex',
              width: '100%',
              maxWidth: '100%',
              height: '100vh',
              justifyContent: 'center',
              alignItems: 'center',
              overflowX: 'hidden',
              margin: 0,
              padding: 0
            }}
            component="main"
          >
            {/** Bên trái  */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '600px',
                height: '100%',
                gap: 2,
                display: 'flex',
                flexDirection: 'column',
                py: 1,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                px: { xs: 2, md: 4 }
              }}
            >
              {/* Tiêu đề */}
              <Box sx={{ px: 5, py: 1, height: '64px' }}>
                <Button
                  sx={{
                    cursor: 'pointer',
                    width: 'fit-content',
                    border: '1px solid #989898',
                    borderRadius: '999px',
                    color: '#1E1E1E',
                    fontFamily: 'inter'
                  }}
                  onClick={() => navigate('/')}
                >
                  Wednesday
                </Button>
              </Box>
              {/* Form đăng ký */}
              <Box
                sx={{
                  py: 1,
                  pt: 3,
                  width: '100%',
                  maxWidth: '600px',
                  gap: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: { xs: 0, sm: 2, md: 4 }
                }}
              >
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'inter',
                    color: '#1E1E1E',
                    fontWeight: '400',
                    py: 1,
                    px: 3
                  }}
                  variant="h4"
                >
                  Đăng nhập
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '424px',
                    margin: '0 auto',
                    height: 'auto',
                    minHeight: '420px',
                    gap: 1.4,
                    display: 'flex',
                    flexDirection: 'column',
                    '& > *': {
                      width: '100% !important',
                      maxWidth: '100% !important'
                    }
                  }}
                >
                  <RHFInput name="email" title="Email" />
                  <RHFInput name="password" title="Mật khẩu" eyeIcon />

                  {/**Button */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        width: '100%',
                        height: '56px',
                        color: '#1E1E1E',
                        borderRadius: '999px',
                        fontSize: '1rem',
                        fontFamily: 'inter',
                        bgcolor: '#FFD85F',
                        fontWeight: '500',
                        px: 2,
                        py: 1
                      }}
                      type="submit"
                    >
                      Đăng nhập
                    </Button>
                    <Box sx={{ pb: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleGoogleLogin}
                        startIcon={<img src={google} alt="" />}
                        sx={{
                          color: '#333446',
                          borderRadius: 8,
                          fontWeight: 'medium',
                          fontSize: '1rem',
                          height: 58,
                          borderColor: '#B6B09F',
                          width: '100% !important',
                          alignItems: 'center',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        Google
                      </Button>
                    </Box>
                    <Link
                      component="button"
                      type="button"
                      onClick={() => setOpen(true)}
                      variant="body2"
                      sx={{
                        alignSelf: 'center',
                        cursor: 'pointer',
                        fontFamily: 'inter',
                        fontSize: '1rem',
                        color: '#1E1E1E',
                        textDecoration: 'none',
                        borderBottom: '1px solid #1E1E1E',
                        lineHeight: '1.5',
                        '&:hover': {
                          borderBottom: '1px solid #1E1E1E'
                        }
                      }}
                    >
                      Quên mật khẩu?
                    </Link>
                    <Typography variant="body2" sx={{ textAlign: 'center', fontFamily: 'inter', fontSize: '1rem' }}>
                      Chưa có tài khoản?{' '}
                      <Link
                        onClick={() => navigate('/sign-up')}
                        variant="body2"
                        sx={{
                          alignSelf: 'center',
                          cursor: 'pointer',
                          fontFamily: 'inter',
                          fontSize: '1rem',
                          color: '#1E1E1E',
                          textDecoration: 'none',
                          borderBottom: '1px solid #1E1E1E',
                          lineHeight: '1.5',
                          '&:hover': {
                            borderBottom: '1px solid #1E1E1E'
                          }
                        }}
                      >
                        Đăng ký
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* Bên phải */}
            <Box
              sx={{
                width: { xs: '0', md: '466px', lg: '766px' },
                minHeight: '590px',
                overflow: 'hidden',
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '20px',
                pr: 4
              }}
            >
              <img
                src={nen}
                alt=""
                style={{
                  width: 'auto',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  borderRadius: '20px'
                }}
              />
            </Box>
          </Box>
        </form>
      </FormProvider>
      <ForgotPassword open={open} handleClose={() => setOpen(false)} />
    </>
  )
}

export default SignIn
