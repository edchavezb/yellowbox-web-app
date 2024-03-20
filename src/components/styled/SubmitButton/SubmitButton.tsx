import { Button } from "@chakra-ui/react"

interface SubmitButtonProps {
  text: string
  disabled?: boolean
}

const SubmitButton = ({ text, disabled = false }: SubmitButtonProps) => {

  return (
    <Button size={"sm"} type={"submit"} isDisabled={disabled} variant={"brandPrimary"}>{text}</Button>
  )
};

export default SubmitButton;