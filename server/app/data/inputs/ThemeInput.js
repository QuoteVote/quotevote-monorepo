export const ThemeInput = `
input ThemeInput {
  type: ThemeType
  customColors: CustomThemeColorsInput
}

input CustomThemeColorsInput {
  primary: String
  secondary: String
  background: String
  text: String
}`;
