const Colors = {
    primary: '#FF5A5F',
    secondary: '#00A699',
    background: '#FFFFFF',
    surface: '#F7F7F7',
    text: '#222222',
    textMuted: '#717171',
    border: '#DDDDDD',
    icon: '#222222',
    error: '#C13515',
  } as const;
  export type ColorName = keyof typeof Colors;

  export default Colors;