// Change these values to retheme the whole application. Screens contain no color literals.
export const brandColors = {
  action: '#FFAD1F',
  actionText: '#292A31',
  selection: '#FFD0A3',
  selectionText: '#38302A',
  ink: '#292A31',
};
export const lightColors = {
  "primary": brandColors.ink,
  "onPrimary": "#FFFFFF",
  "primaryContainer": brandColors.action,
  "onPrimaryContainer": brandColors.actionText,
  "secondary": "#875000",
  "onSecondary": "#FFFFFF",
  "secondaryContainer": brandColors.selection,
  "onSecondaryContainer": brandColors.selectionText,
  "tertiary": "#805600",
  "onTertiary": "#FFFFFF",
  "tertiaryContainer": "#FFE38A",
  "onTertiaryContainer": "#40320A",
  "background": "#F5F6F8",
  "onBackground": brandColors.ink,
  "surface": "#FFFFFF",
  "onSurface": brandColors.ink,
  "surfaceVariant": "#E7E9F0",
  "onSurfaceVariant": "#656775",
  "surfaceDisabled": "#E1E3E8",
  "onSurfaceDisabled": "#6A6C75",
  "outline": "#797C86",
  "outlineVariant": "#DCDFE5",
  "error": "#AC2430",
  "onError": "#FFFFFF",
  "errorContainer": "#FFE0E1",
  "onErrorContainer": "#6C1420",
  "inverseSurface": "#2D2E35",
  "inverseOnSurface": "#FFFFFF",
  "inversePrimary": "#6DECE4",
  "elevation": {
    "level0": "transparent",
    "level1": "#FFFFFF",
    "level2": "#FAFBFC",
    "level3": "#F7F8FA",
    "level4": "#F4F6F8",
    "level5": "#F0F3F5"
  }
};
export const avatarColors = {
  "light": [
    [
      "#BDF5EF",
      "#173C3C"
    ],
    [
      "#FFD0A3",
      "#542E16"
    ],
    [
      "#E7E9F0",
      "#383943"
    ],
    [
      "#FFE38A",
      "#40320A"
    ]
  ]
};

// One shared switch and finish settings for every enabled primary and tonal button.
export const buttonFinish = {
  enabled: true,
  highlight: '#FFFFFF',
  highlightOpacity: 0.64,
  shadeOpacity: 0.13,
  edgeWidth: 1.5,
  lowerEdgeWidth: 3,
  radius: 18,
};
