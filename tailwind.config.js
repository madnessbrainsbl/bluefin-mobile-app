const gluestackPlugin = require('@gluestack-ui/nativewind-utils/tailwind-plugin');
const {platformSelect} = require('nativewind/theme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : 'media',
  content: [
    './app/**/*.{html,js,jsx,ts,tsx}',
    './core-components/**/**/*.{html,js,jsx,ts,tsx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './hooks/**/*.{html,js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  // safelist: [
  //   {
  //     pattern:
  //       /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark)/,
  //   },
  // ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        primary: {
          main: '#A77027',
          light: '#CA9C6C',
          muted: '#63615D',
          pale: '#F4EBE2'
        },
        surface: {
          light: '#e5e7eb',
          dark: '#393B41',
          control: '#F3F3F7',
          message: '#ECF1F5',
          error: '#F4EAEA',
          selected: '#F6F8FA',
          checkbox: '#eab308',
        },       
        typography: {
          main: '#393B41',
          accent: '#000',
          light: '#7B848C',
          muted: '#bdbdbd',
          dark: '#8A8A8A',
          control: '#504E4E',
          error: '#D63E3E',
          form: '#93AED3',
        },
        outline: {
          main: '#CDCDCD',
          light: '#D6D6D6',
        },
        
        indicator: {
          primary: 'rgb(var(--color-indicator-primary)/<alpha-value>)',
          info: 'rgb(var(--color-indicator-info)/<alpha-value>)',
          error: 'rgb(var(--color-indicator-error)/<alpha-value>)',
        },
        custom: {
          gold: '#A77027',
          lightGold: '#CA9C6C',
          veryLightGold: '#F4EBE2',
          lightGray: "#D6D6D6",
          gray: '#393B41', //color1
          gray2: '#CDCDCD', //color14
          gray3: '#7B848C',
          grayControl: '#F3F3F7',
          darkGrey: '#8A8A8A',
          asphalt: '#504E4E', //color5,
          paleGold: '#63615D', //color19
          veryLightBlue: '#F6F8FA',
          lightBlue: '#93AED3',
          blueGrey: '#ECF1F5',
          anotherGray: '#BDBDBD',
          lightRed: '#F4EAEA',
          red: '#D63E3E'
        }
      },
      fontFamily: {
        "body": ["Inter"],
      },
      fontWeight: {
        extrablack: '950',
      },
      fontSize: {
        '2xs': '10px',
      },
      boxShadow: {
        'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
        'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
        'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
        'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
        'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
      },
    },
  },
  plugins: [gluestackPlugin],
};
