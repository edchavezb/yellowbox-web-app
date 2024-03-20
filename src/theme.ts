// 1. import `extendTheme` function
import { ChakraTheme, DeepPartial, extendTheme, type ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const customTheme: DeepPartial<ChakraTheme> = {
  shadows: { outline: "none"},
  colors: {
    brand: {
      500: "#515661",
      600: "#343840",
      700: "#0050e6",
      800: "#0B45B3",
      900: "#343840",
    },
    ybgray: {
      500: "#515661",
    }
  }
}

// 3. extend the theme
const theme = extendTheme({ ...customTheme, config })

export default theme