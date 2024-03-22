import { Button } from "@chakra-ui/react"

interface AppButtonProps {
  text: string
  onClick: () => void
  disabled?: boolean
  variant?: string 
}

const AppButton = ({ text, onClick, disabled = false, variant = "brandPrimary" }: AppButtonProps) => {

  return (
    <Button size={"sm"} onClick={onClick} isDisabled={disabled} variant={variant}>{text}</Button>
  )
};

export default AppButton;