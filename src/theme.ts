// 1. import `extendTheme` function
import { ChakraTheme, DeepPartial, defineStyle, defineStyleConfig, extendTheme, theme as defaultTheme, type ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const brandPrimary = defineStyle({
  background: '#2C313D',
  color: 'white',
  _active: {
    background: 'gray.600',
  },
  _hover: {
    background: 'gray.600',
  },
  _dark: {
    background: '#2C313D',
    color: 'white',
    _active: {
      background: 'gray.500',
    },
    _hover: {
      background: 'gray.500',
    }
  }
})

export const buttonTheme = defineStyleConfig({
  variants: { brandPrimary },
})

const customTheme: DeepPartial<ChakraTheme> = {
  colors: {
    brandgray: {
      400: "#808080",  //Pure gray
      500: "#515661",
      600: "#34363A",
      700: "#2C313D",
      800: "#1a1a1a",
      900: "#0f0f0f"
    },
    brandyellow: {
      500: "#FFD119",
      600: "#FFB30F"
    },
    brandblue: {
      500: "#1961E6",
      600: "#1E90FF",  //Dodgerblue
    }
  },
  components: {
    Alert: {
      variants: {
        solid: (props) => { 
          const { colorScheme } = props
          if (colorScheme !== "blue") {
            // use original definition for all color schemes except "blue"
            return defaultTheme.components.Alert.variants?.solid(props)!
          }
          return {
            container: {
              bg: 'brandgray.500',
              color: '#ffffff' // or literal color, e.g. "#0984ff"
            }
          }
        }
      }
    },
    Button: buttonTheme,
    Input: {
      defaultProps: {
        errorBorderColor: '#FFB30F'
      },
      baseStyle: {
        field: {
          _autofill: {
            border: "1px solid #515661",
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