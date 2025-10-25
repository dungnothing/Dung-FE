import { TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

const RHFTextFieldMUI = ({ name, label, ...rest }) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          variant="outlined"
          error={!!error}
          helperText={error?.message}
          {...rest}
          sx={{
            '& .MuiOutlinedInput-root': {
              padding: '0',
              '&.Mui-focused fieldset': {
                borderColor: '#6C63FF'
              },
              '& input': {
                padding: '12px 14px'
              }
            }
          }}
        />
      )}
    />
  )
}

export default RHFTextFieldMUI
