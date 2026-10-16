import React from 'react';
import {Button as PaperButton,useTheme} from 'react-native-paper';

type Props = React.ComponentProps<typeof PaperButton>;

/** Shared color policy. Layout and behavior stay with Paper and the calling screen. */
export function AppButton({mode='text',buttonColor,textColor,disabled,...props}:Props) {
  const {colors}=useTheme();
  const filled=mode==='contained';
  const tonal=mode==='contained-tonal';
  // Let Paper own disabled styling instead of applying active accent colors to it.
  const background=disabled?undefined:filled?colors.primaryContainer:tonal?colors.secondaryContainer:undefined;
  const foreground=disabled?undefined:filled?colors.onPrimaryContainer:tonal?colors.onSecondaryContainer:colors.onSurface;
  return <PaperButton {...props} mode={mode} disabled={disabled}
    buttonColor={buttonColor??background} textColor={textColor??foreground}/>;
}
