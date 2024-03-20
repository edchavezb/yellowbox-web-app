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
    brandgray: {
      400: "#808080",
      600: "#515661",
      800: "#1a1a1a",
      900: "#0f0f0f"
    },
    brandyellow: {
      500: "#FFD119",
      600: "#FFB30F"
    }
  },
  components: {
    Input: {
      defaultProps: {
        errorBorderColor: '#FFB30F'
      },
      baseStyle: {
        field: {
          _autofill: {
            border: "1px solid transparent",
            textFillColor: "#c6c6c6",
            boxShadow: "0 0 0px 1000px #232323 inset",
            transition: "background-color 5000s ease-in-out 0s",
          }
        }
      }
    },
    FormError: {
      baseStyle: (props) => ({
        text: {
          color: '#FFB30F'
        }
      })
    }
  }
}

// 3. extend the theme
const theme = extendTheme({ ...customTheme, config })

export default theme