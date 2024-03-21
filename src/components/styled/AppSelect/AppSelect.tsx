import { Select } from "@chakra-ui/react"

interface AppButtonProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  disabled?: boolean
  variant?: string
  children: React.ReactElement
}

const AppSelect = ({ value, onChange, disabled = false, children }: AppButtonProps) => {

  return (
    <Select value={value} onChange={onChange} isDisabled={disabled} variant={"filled"} size={"sm"} width={"fit-content"} maxWidth={"300px"}>
        {children}
    </Select>
  )
};

export default AppSelect;