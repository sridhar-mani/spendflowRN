

const colorPalette = {
    light: {
      dark: false,
      roundness: 4,
    //   version: 3,
    //   isV3: true,
      colors: {
        primary: '#D93025', // Gmail red
        onPrimary: '#FFFFFF',
        primaryContainer: '#FCE8E6',
        onPrimaryContainer: '#410002',

        secondary: '#5F6368', // Gmail grey
        onSecondary: '#FFFFFF',
        secondaryContainer: '#E8EAED',
        onSecondaryContainer: '#202124',
  
        tertiary: '#34A853', // Google green
        onTertiary: '#FFFFFF',
        tertiaryContainer: '#DFF6E0',
        onTertiaryContainer: '#003314',

  
        background: '#FFFFFF',
        onBackground: '#202124',
  
        surface: '#FFFFFF',
        onSurface: '#202124',
        surfaceVariant: '#F1F3F4',
        onSurfaceVariant: '#5F6368',
  
        outline: '#DADCE0',
        outlineVariant: '#E8EAED',
  
        error: '#D93025',
        onError: '#FFFFFF',
        errorContainer: '#FCE8E6',
        onErrorContainer: '#410002',
  
        surfaceDisabled: 'rgba(32, 33, 36, 0.12)',
        onSurfaceDisabled: 'rgba(32, 33, 36, 0.38)',
  
        inverseSurface: '#202124',
        inverseOnSurface: '#FFFFFF',
        inversePrimary: '#EA4335',
  
        shadow: '#000000',
        scrim: '#000000',
        backdrop: 'rgba(32, 33, 36, 0.4)',
  
        elevation: {
          level0: 'transparent',
          level1: '#F8F9FA',
          level2: '#F1F3F4',
          level3: '#E8EAED',
          level4: '#DADCE0',
          level5: '#BDC1C6',
        },
      },
      animation: {
        scale: 1.0,
      },
    },

    dark: {
      dark: true,
      roundness: 4,
      version: 3,
      isV3: true,
      colors: {
        primary: '#EA4335',
        onPrimary: '#FFFFFF',
        primaryContainer: '#5A0000',
        onPrimaryContainer: '#FFDAD4',

        secondary: '#BDC1C6',
        onSecondary: '#202124',
        secondaryContainer: '#3C4043',
        onSecondaryContainer: '#E8EAED',

        tertiary: '#34A853',
        onTertiary: '#003314',
        tertiaryContainer: '#004D1A',
        onTertiaryContainer: '#DFF6E0',

        background: '#202124',
        onBackground: '#E8EAED',
  
        surface: '#202124',
        onSurface: '#E8EAED',
        surfaceVariant: '#3C4043',
        onSurfaceVariant: '#BDC1C6',
  
        outline: '#5F6368',
        outlineVariant: '#3C4043',
  
        error: '#F28B82',
        onError: '#202124',
        errorContainer: '#8C1D18',
        onErrorContainer: '#FCE8E6',
  
        surfaceDisabled: 'rgba(232, 234, 237, 0.12)',
        onSurfaceDisabled: 'rgba(232, 234, 237, 0.38)',
  
        inverseSurface: '#E8EAED',
        inverseOnSurface: '#202124',
        inversePrimary: '#D93025',
  
        shadow: '#000000',
        scrim: '#000000',
        backdrop: 'rgba(232, 234, 237, 0.4)',
  
        elevation: {
          level0: 'transparent',
          level1: '#2A2C2F',
          level2: '#303134',
          level3: '#3C4043',
          level4: '#5F6368',
          level5: '#9AA0A6',
        },
      },
      animation: {
        scale: 1.0,
      },
    }
  };
  

export {colorPalette}