import { Button } from "@chakra-ui/react"

interface SubmitButtonProps {
  text: string
  disabled?: boolean
  variant?: string
}

const SubmitButton = ({ text, disabled = false, variant = "brandPrimary" }: SubmitButtonProps) => {

  return (
    <Button size={"sm"} type={"submit"} isDisabled={disabled} variant={variant}>{text}</Button>
  )
};

export default SubmitButton;