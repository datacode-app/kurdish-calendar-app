export type ThemeType = 'elegant' | 'minimal' | 'classic';

/**
 * Applies or removes dark mode class to HTML and body elements
 */
export function toggleDarkMode(isDarkMode: boolean): void {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    const cardElement = document.querySelector('.card-modern-clock');
    
    if (isDarkMode) {
      html.classList.add('dark');
      html.style.backgroundColor = '#121212';
      if (cardElement) {
        (cardElement as HTMLElement).style.backgroundColor = '#1a1a1a';
        (cardElement as HTMLElement).style.color = '#e0e0e0';
      }
    } else {
      html.classList.remove('dark');
      html.style.backgroundColor = '';
      if (cardElement) {
        (cardElement as HTMLElement).style.backgroundColor = '';
        (cardElement as HTMLElement).style.color = '';
      }
    }
  }
}

/**
 * Get color scheme based on theme and dark mode
 */
export function getThemeColors(theme: ThemeType, darkMode: boolean): {
  dialColor: string;
  borderColor: string;
  numberColor: string;
  handColors: {
    hour: string;
    minute: string;
    second: string;
  };
  tickColors: {
    hour: string;
    minute: string;
  };
} {
  switch (theme) {
    case 'elegant':
      return darkMode 
        ? {
            dialColor: 'bg-gray-900',
            borderColor: 'border-indigo-400',
            numberColor: 'text-gray-200',
            handColors: {
              hour: 'bg-indigo-300',
              minute: 'bg-indigo-400',
              second: 'bg-pink-400'
            },
            tickColors: {
              hour: 'bg-indigo-300',
              minute: 'bg-gray-600'
            }
          }
        : {
            dialColor: 'bg-white',
            borderColor: 'border-indigo-500',
            numberColor: 'text-gray-800',
            handColors: {
              hour: 'bg-indigo-600',
              minute: 'bg-indigo-500',
              second: 'bg-pink-500'
            },
            tickColors: {
              hour: 'bg-indigo-500',
              minute: 'bg-gray-300'
            }
          };
    
    case 'minimal':
      return darkMode
        ? {
            dialColor: 'bg-gray-900',
            borderColor: 'border-gray-700',
            numberColor: 'text-gray-400',
            handColors: {
              hour: 'bg-gray-400',
              minute: 'bg-gray-300',
              second: 'bg-teal-400'
            },
            tickColors: {
              hour: 'bg-gray-500',
              minute: 'bg-gray-700'
            }
          }
        : {
            dialColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            numberColor: 'text-gray-600',
            handColors: {
              hour: 'bg-gray-700',
              minute: 'bg-gray-600',
              second: 'bg-teal-500'
            },
            tickColors: {
              hour: 'bg-gray-400',
              minute: 'bg-gray-200'
            }
          };
          
    case 'classic':
    default:
      return darkMode
        ? {
            dialColor: 'bg-amber-950',
            borderColor: 'border-amber-700',
            numberColor: 'text-amber-200',
            handColors: {
              hour: 'bg-amber-400',
              minute: 'bg-amber-300',
              second: 'bg-red-400'
            },
            tickColors: {
              hour: 'bg-amber-500',
              minute: 'bg-amber-800'
            }
          }
        : {
            dialColor: 'bg-amber-50',
            borderColor: 'border-amber-600',
            numberColor: 'text-amber-900',
            handColors: {
              hour: 'bg-amber-800',
              minute: 'bg-amber-700',
              second: 'bg-red-600'
            },
            tickColors: {
              hour: 'bg-amber-600',
              minute: 'bg-amber-200'
            }
          };
  }
} 