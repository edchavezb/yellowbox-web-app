import { Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { useRef, useState } from "react"

interface SearchInputProps {
  onChange?: (value: string) => void
  placeholder?: string
  defaultValue?: string
}

const SearchInput = ({onChange, placeholder, defaultValue}: SearchInputProps) => {
  const [value, setValue] = useState(defaultValue || "");
  const inputRef = useRef<HTMLInputElement | null>(null)

  const endElement = value ? (
    <img src="/icons/close.svg" alt="clear" width={12} height={12} style={{cursor: 'pointer'}} 
      onClick={() => {
        setValue("")    
        if (inputRef.current) {
          inputRef.current.value = ""
          inputRef.current.focus()
        }
        if (onChange) onChange("")
      }}
    />
  ) : (
    <img src="/icons/search-white.svg" alt="search" width={16} height={16} />
  )

  return (
    <InputGroup>
      <Input
        ref={inputRef}
        placeholder={placeholder || "Search"}
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value)
          if (onChange) onChange(e.currentTarget.value)
        }}
      />
      <InputRightElement>
        {endElement}
      </InputRightElement>
    </InputGroup>
  )
}

export default SearchInput;