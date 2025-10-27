import { Controller, useFormContext } from 'react-hook-form'
import BasicInput from '../ui/BasicInput'

function RHFInput({ name, title, placeholder, eyeIcon = false, size }) {
  const { control, formState } = useFormContext()
  const error = formState.errors

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="w-full flex flex-col gap-1">
          <BasicInput
            {...field}
            title={title}
            placeholder={placeholder}
            eyeIcon={eyeIcon}
            error={error?.[name]}
            size={size}
          />
          {error?.[name] && <p className="!text-red-500 text-sm pl-4">{error[name]?.message}</p>}
        </div>
      )}
    />
  )
}

export default RHFInput
