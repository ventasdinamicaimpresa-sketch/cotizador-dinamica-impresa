/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html", "./src/**/*.{html,js}", "enmicado1.html", "tarjetas pvc.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary': '#4CAF50', // Verde vibrante
        'secondary': '#E8F5E9', // Verde claro suave
        'accent': '#FFC107', // Amarillo para detalles
        'info': '#2196F3', // Azul para información
        'warning': '#FF9800', // Naranja para advertencias
        'danger': '#F44336', // Rojo para errores
        'dark-bg': '#1A202C', // Fondo oscuro más profundo
        'dark-card': '#2D3748', // Tarjeta oscura
        'dark-text': '#E2E8F0', // Texto claro en modo oscuro
        'dark-input': '#4A5568', // Inputs oscuros
      },
      boxShadow: {
        'custom-light': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'custom-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  safelist: [
    'w-4', 'h-4', 'w-5', 'h-5', 'w-6', 'h-6', 'w-8', 'h-8', 'w-10', 'h-10', 'w-12', 'h-12', 'w-16', 'h-16', 'w-20', 'h-20', 'w-24', 'h-24', 'w-32', 'h-32', 'w-40', 'h-40', 'w-48', 'h-48', 'w-56', 'h-56', 'w-64', 'h-64', 'w-px', 'h-px', 'w-auto', 'h-auto', 'w-full', 'h-full', 'w-screen', 'h-screen', 'w-min', 'h-min', 'w-max', 'h-max', 'w-fit', 'h-fit',
    'text-red-500', 'text-green-500', 'text-blue-500', 'text-yellow-500', 'text-purple-500', 'text-indigo-500', 'text-gray-500', 'text-white', 'text-black',
    'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-indigo-500', 'bg-gray-500', 'bg-white', 'bg-black',
    'hidden', 'block', 'flex', 'grid'
  ],
  plugins: [],
}
