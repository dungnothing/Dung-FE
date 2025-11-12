import { Eye, EyeClosed } from 'lucide-react'
import { useState, forwardRef } from 'react'
import { cn } from '~/utils/constants'

const BasicInput = forwardRef(({ value, onChange, placeholder, title, eyeIcon = false, error, size }, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = eyeIcon ? (showPassword ? 'text' : 'password') : 'text'

  const heightClass =
    {
      sm: 'h-10',
      md: 'h-12',
      lg: 'h-14'
    }[size] || 'h-12'

  const eyeIconClass =
    {
      sm: 'top-[52px]',
      md: 'top-[56px]',
      lg: 'top-[60px]'
    }[size] || 'top-[56px]'

  return (
    <div className="relative w-full flex flex-col gap-2">
      <p className="pl-4 text-[16px] text-[#989898]">{title}</p>
      <input
        ref={ref}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="all"
        className={cn(
          'w-full px-6 rounded-full bg-[#fdfcf7] shadow-sm focus:outline-none focus:ring-0',
          error && 'border border-red-300',
          heightClass
        )}
      />
      {eyeIcon && (
        <div
          className={cn(
            'absolute right-2 transform -translate-y-1/2 cursor-pointer hover:bg-gray-100 p-2 rounded-full',
            eyeIconClass
          )}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeClosed /> : <Eye />}
        </div>
      )}
    </div>
  )
})

export default BasicInput
