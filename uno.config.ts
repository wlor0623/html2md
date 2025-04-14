// uno.config.ts
import { defineConfig, presetUno, presetTypography } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography()
  ],
  theme: {
    colors: {
      black: '#000000',
      white: '#ffffff',
      primary: '#171717',
      gray: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#8c8c8c',
        600: '#6c6c6c',
        700: '#525252',
        800: '#333333',
        900: '#171717',
      },
      red: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        500: '#ef4444',
        600: '#dc2626'
      },
      yellow: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        500: '#eab308',
        700: '#a16207'
      }
    }
  },
  safelist: [
    // Custom colors
    'bg-[#171717]', 'bg-[#fafafa]', 'bg-[#f5f5f5]', 'bg-[#e5e5e5]', 'bg-[#8c8c8c]', 'bg-[#6c6c6c]', 'bg-[#e0e0e0]',
    'border-[#f0f0f0]', 'border-[#e5e5e5]', 
    'text-[#171717]', 'text-[#8c8c8c]', 'hover:text-[#171717]',
    'focus:ring-[#171717]', 'focus:border-[#171717]',
    'border-t-2', 'border-b-2', 'border-[#171717]',
    
    // Standard colors
    'bg-white', 'bg-black', 'hover:bg-black',
    'text-white', 'text-red-500', 'text-red-600', 'hover:text-gray-200', 
    'hover:bg-[#f0f0f0]', 'hover:bg-[#e5e5e5]',
    
    // Error & Warning styling
    'bg-red-50', 'border-red-200', 'text-red-600',
    'bg-yellow-50', 'border-yellow-200', 'text-yellow-700',
    
    // Form elements
    'form-checkbox', 'h-4', 'w-4',
    
    // Rounded corners
    'rounded-lg', 'rounded-xl', 'rounded',
    
    // Transitions
    'transition', 'transition-colors',
    
    // Animations
    'animate-spin',
    
    // Flex
    'flex-col', 'flex-row', 'flex-wrap', 'items-center', 'justify-center', 'flex-grow', 'flex-shrink-0',
    
    // Width/Max-width
    'min-w-24', 'max-w-64', 'truncate',
    
    // Positioning
    'relative', 'absolute', 'right-2', 'top-2',
    
    // Spacing
    'gap-2', 'gap-3', '-ml-1', 'ml-2', 'mr-2', 'mt-3', 'mt-4', 'mb-2',
    
    // Typography
    'prose-neutral', 'font-medium', 'text-sm'
  ]
})