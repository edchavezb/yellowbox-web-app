import { Button } from "@chakra-ui/react"

interface AppButtonProps {
  text: string
  onClick: () => void
  disabled?: boolean
}

const AppButton = ({ text, onClick, disabled = false }: AppButtonProps) => {

  return (
    <Button size={"sm"} onClick={onClick} isDisabled={disabled} variant={"brandPrimary"}>{text}</Button>
  )
};

export default AppButton;