import { clsx } from 'clsx'

let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8001'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://dung-be-w74s.onrender.com'
}

export const API_ROOT = apiRoot

export const textColor = (theme) => (theme.palette.mode === 'dark' ? '#B6C2CF' : '#172b4d')

export function cn(...inputs) {
  return clsx(inputs)
}
