/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dissolveinstart: {
          '0%': {
            opacity: '0',
            transform: 'scale(2) translateX(-50%) translateY(-50%)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateX(0) translateY(0)',
          }
        },
        dissolveinend: {
          '0%': {
            opacity: '0',
            transform: 'translateX(100%) translateY(-100%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0) translateY(0)',
          },
        },
        scaledown: {
          '0%': {
            transform: 'scale(1.4)',
          },
          '100%': {
            transform: 'scale(1)',
          }
        },
        herocontentup: {
          '0%': {
            opacity: '0',
            transform: 'translateY(50%)'
          },
          '100%': {
            opacity: '1',
            transform: '-translate-y-1/2',
          }
        },
        fadeup: {
          '0%': {
            opacity: '0',
            transform: 'translateY(50%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadedown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-50%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadefromstart: {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          }
        },
        fadefromend: {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0%)',
            opacity: '1',
          },
        },
      },
      animation: {
        dissolveinstart: 'dissolveinstart 2000ms ease-in-out 1000ms forwards',
        dissolveinend: 'dissolveinend 1500ms ease-in-out 1500ms forwards',
        herocontentup: 'herocontentup 1500ms ease-in-out 500ms forwards',
        fadeup: 'fadeup 2000ms ease-in-out forwards',
        fadedown: 'fadedown 2000ms ease-in-out forwards',
        scaledown: 'scaledown 2000ms ease-in-out forwards',
        fadefromstart: 'fadefromstart 1500ms ease-in-out forwards',
        fadefromstartwithdelay: 'fadefromstart 1500ms ease-in-out 1000ms forwards',
        fadefromstartwithdelay1000: 'fadefromstart 1500ms ease-in-out 1000ms forwards',
        fadefromstartwithdelay2000: 'fadefromstart 1500ms ease-in-out 2000ms forwards',
        fadefromend: 'fadefromend 1500ms ease-in-out forwards',
        fadefromendwithdelay: 'fadefromend 1500ms ease-in-out 1000ms forwards',
        fadefromendwithdelay1000: 'fadefromend 1500ms ease-in-out 1000ms forwards',
        fadefromendwithdelay2000: 'fadefromend 1500ms ease-in-out 2000ms forwards',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
    
};
