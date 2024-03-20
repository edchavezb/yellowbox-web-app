import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react"

interface FormInputProps {
  type?: string
  label: string
  placeholder?: string
  helperText?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
}

const FormInput = ({ type = "text", label, placeholder, helperText, onChange, value }: FormInputProps) => {

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input type={type} value={value} onChange={onChange} placeholder={placeholder} borderColor={"brandgray.600"} />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
};

export default FormInput;