// Tailwind CSS v4 configuration
import { type Config } from 'tailwindcss'

const generateNumbers = (start: number, end: number, space = 10) => {
  const numbers: Record<string, string> = {}
  for (let i = start; i <= end; i += space) {
    numbers[Math.round(i)] = `${Math.round(i)}px`
  }
  return numbers
}

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './packages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
      '10xl': '10rem',
      55: '55rem',
    },
    opacity: {
      80: '.8',
      0: '0',
      100: '1',
    },
    letterSpacing: {
      ...generateNumbers(0, 10, 0.1),
    },
    extend: {
      fontFamily: {
        nunito: ['"Nunito"', 'sans-serif'],
        roboto: ['"Roboto Mono"', 'sans-serif'],
      },
      screens: {
        xs: '320px',
        sm: '576px',
        md: '960px',
        lg: '1440px',
        xl: '1920px',
      },
      colors: {
        // Existing colors
        primary: {
          100: '#E6F6FE',
          200: '#C0EAFC',
          300: '#9ADDFB',
          400: '#4FC3F7',
          500: '#03A9F4',
          600: '#0398DC',
          700: '#026592',
          800: '#014C6E',
          900: '#013349',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        blue: {
          bgMenu: '#f6f9ff',
        },
        // REUI semantic colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      lineHeight: {
        hero: '4.5rem',
        '50px': '50px',
      },
      height: {
        88: '22rem',
        '50vh': '50vh',
        '95-px': '95px',
        '70-px': '70px',
        '350-px': '350px',
        '500-px': '500px',
        '600-px': '600px',
        ...generateNumbers(100, 1000),
      },
      zIndex: {
        1: 1,
        60: 60,
        2: 2,
        3: 3,
      },
      inset: {
        '-100': '-100%',
        '-225-px': '-225px',
        '-160-px': '-160px',
        '-150-px': '-150px',
        '-94-px': '-94px',
        '-50-px': '-50px',
        '-29-px': '-29px',
        '-20-px': '-20px',
        '25-px': '25px',
        '40-px': '40px',
        '95-px': '95px',
        '145-px': '145px',
        '195-px': '195px',
        '210-px': '210px',
        '260-px': '260px',
      },
      maxWidth: {
        '8xl': '1408px',
        90: '90%',
        1600: '1600px',
        '100-px': '100px',
        '120-px': '120px',
        '150-px': '150px',
        '180-px': '180px',
        '200-px': '200px',
        '210-px': '210px',
        '580-px': '580px',
      },
      minWidth: {
        '140-px': '140px',
        48: '12rem',
      },
      minHeight: {
        inherit: 'inherit',
        'screen-75': '75vh',
        ...generateNumbers(100, 1000),
      },
      maxHeight: {
        '860-px': '860px',
        ...generateNumbers(100, 1000),
      },
      borderRadius: {
        sm: '0.25rem',
        half: '50%',
        full: '100%',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        DEFAULT: 'calc(var(--radius) - 4px)',
        ...generateNumbers(0, 100),
      },
      animation: {
        shine404_3s: 'shine404 3s ease-in-out infinite',
        smallnbig404_3s: 'smallnbig404 3s ease-in-out infinite',
        upndown404_3s: 'updown404 3s ease-in-out infinite',
        scaleUpDown: 'scaleUpDown 1.5s ease-in-out infinite',
        // Drawer/Dialog animations
        in: 'in 0.2s ease-out',
        out: 'out 0.2s ease-in forwards',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
        'slide-out-to-right': 'slide-out-to-right 0.2s ease-in',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-out-to-left': 'slide-out-to-left 0.2s ease-in',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-out-to-top': 'slide-out-to-top 0.2s ease-in',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-out-to-bottom': 'slide-out-to-bottom 0.2s ease-in',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-in',
      },
      keyframes: {
        // Drawer/Dialog keyframes
        in: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        out: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-from-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-to-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-to-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-out-to-top': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-out-to-bottom': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        updown404: {
          '0%': { transform: 'translateY(5px)' },
          '50%': { transform: 'translateY(15px)' },
          '100%': { transform: 'translateY(5px)' },
        },
        smallnbig404: {
          '0%': { width: '90px' },
          '50%': { width: '100px' },
          '100%': { width: '90px' },
        },
        shine404: {
          '0%': { opacity: '.2' },
          '25%': { opacity: '.1' },
          '50%': { opacity: '.2' },
          '100%': { opacity: '.2' },
        },
        scaleUpDown: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(0.95)' },
        },
      },
      width: {
        ...generateNumbers(100, 1000),
      },
      translate: {
        half: '50%',
      },
      transitionProperty: {
        'bg-0.5s-ease': 'background-color 0.5s ease',
        'trasform-0.5s-ease': 'transform 0.5s ease',
      },
      backgroundSize: {
        full: '100%',
      },
      flex: {
        2: '2 2 0%',
      },
      top: {
        unset: 'unset',
      },
      bottom: {
        unset: 'unset',
      },
      transform: {
        unset: 'unset',
      },
      rotate: {
        'y-180': '180deg',
        'y-90': '90deg',
        'y-45': '45deg',
        'y-30': '30deg',
        'y-15': '15deg',
        'y-0': '0deg',
        'y--15': '-15deg',
        'y--30': '-30deg',
        'y--45': '-45deg',
        'y--90': '-90deg',
        'y--180': '-180deg',
      },
    },
  },
} satisfies Config
