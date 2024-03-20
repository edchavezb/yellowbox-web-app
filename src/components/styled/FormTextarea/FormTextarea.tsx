import { FormControl, FormHelperText, FormLabel, Textarea } from "@chakra-ui/react"

interface FormInputProps {
  label: string
  placeholder?: string
  helperText?: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  value: string
  rows?: number
}

const FormTextarea = ({ label, placeholder, helperText, onChange, value, rows = 3 }: FormInputProps) => {

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Textarea value={value} onChange={onChange} placeholder={placeholder} borderColor={"brandgray.600"} rows={rows}/>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
};

export default FormTextarea;