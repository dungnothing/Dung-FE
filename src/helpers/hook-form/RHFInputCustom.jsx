import { useFormContext, Controller } from 'react-hook-form'
import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'
import { cn } from '~/utils/constants'
import { useColorScheme } from '@mui/material/styles'

const RHFInputCustom = ({ name, label, type = 'text', disabled, maxWidth }) => {
  const { control } = useFormContext()
  const [showPassword, setShowPassword] = useState(false)
  const { mode } = useColorScheme()
  const isDark = mode === 'dark'
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : 'text'

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={`relative w-full max-w-[${maxWidth}px]`}>
          {/* Input */}
          <input
            {...field}
            id={name}
            type={inputType}
            placeholder=" "
            disabled={disabled}
            className={`peer w-full border h-11 px-3 rounded-[8px] text-[14px] focus:border-[#6C63FF] focus:outline-none
              ${isDark ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black'}
              ${
                field?.value?.length > 0
                  ? isDark
                    ? 'border-[#666]'
                    : 'border-[#111827]'
                  : isDark
                  ? 'border-[#444] hover:border-[#666]'
                  : 'border-[#e5e7eb] hover:border-[#111827]'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
          />

          {/* Label */}
          <label
            htmlFor={name}
            className={`
              absolute left-3 transition-all duration-200
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-[14px]
              peer-focus:top-[-11px] peer-focus:text-[#6C63FF] peer-focus:text-[12px] peer-focus:px-1
              ${isDark ? 'peer-focus:bg-[#1e1e1e]' : 'peer-focus:bg-white'}
              ${isDark ? 'peer-placeholder-shown:text-gray-400' : 'peer-placeholder-shown:text-gray-400'}
              ${
                field?.value?.length > 0
                  ? `top-[-11px] text-[12px] px-1 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} ` +
                    `${disabled ? 'cursor-not-allowed text-gray-400' : isDark ? 'text-gray-300' : 'text-[#111827]'}`
                  : `top-3 text-[14px] ${isDark ? 'text-gray-400' : 'text-gray-400'}`
              }
            `}
          >
            {label}
          </label>

          {type === 'password' && (
            <div
              className={cn(
                'absolute right-2 transform -translate-y-1/2 cursor-pointer p-2 rounded-full top-5.5',
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              )}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </div>
          )}

          {error && (
            <div className="mt-1 pl-2">
              <div className="text-xs text-red-500">{error.message}</div>
            </div>
          )}
        </div>
      )}
    />
  )
}

export default RHFInputCustom
