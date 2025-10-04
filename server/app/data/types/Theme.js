export const Theme = `
type Theme {
  type: ThemeType
  customColors: CustomThemeColors
}

enum ThemeType {
  LIGHT
  DARK
  HIGH_CONTRAST
  CUSTOM
}

type CustomThemeColors {
  primary: String
  secondary: String
  background: String
  text: String
}`;
