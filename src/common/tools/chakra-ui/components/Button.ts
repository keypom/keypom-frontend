import { defineStyleConfig } from '@chakra-ui/react'

export const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: 'xl',
    fontWeight: 'medium',
  },
  variants: {
    "primary": {
      border: '2px solid transparent',
      color: 'white',
      bgColor: 'gray.800'
    },
    "secondary": {
      border: '2px solid',
      borderColor: 'gray.200',
      color: 'gray.800',
      bgColor: 'white'
    },
  },
  defaultProps: {
    variant: 'primary',
  },
})