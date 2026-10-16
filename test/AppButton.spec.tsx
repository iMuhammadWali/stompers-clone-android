import React from 'react';
import {describe,it,expect} from '@jest/globals';
import {render,fireEvent} from '@testing-library/react-native';
import {PaperProvider,MD3LightTheme} from 'react-native-paper';
import {AppButton} from '../src/components/AppButton';
import {lightColors} from '../src/lib/palette';

function flattenStyle(style:unknown):Record<string,unknown> {
  return Object.assign({},...[style].flat(Infinity).filter(s=>s&&typeof s==='object'));
}
const theme={...MD3LightTheme,colors:{...MD3LightTheme.colors,...lightColors}};
describe('Shared button theme',()=>{
  it('updates every primary action when one theme value changes and preserves a local override',async()=>{
    const buttons=<><AppButton testID="send" mode="contained">Send request</AppButton><AppButton testID="save" mode="contained">Save changes</AppButton><AppButton testID="special" mode="contained" buttonColor="#FFE38A">Special action</AppButton></>;
    const view=await render(<PaperProvider theme={theme}>{buttons}</PaperProvider>);
    expect(flattenStyle(view.getByTestId('send-container').props.style)).toMatchObject({backgroundColor:lightColors.primaryContainer});
    expect(flattenStyle(view.getByTestId('save-container').props.style)).toMatchObject({backgroundColor:lightColors.primaryContainer});
    await view.rerender(<PaperProvider theme={{...theme,colors:{...theme.colors,primaryContainer:'#FFB84D'}}}>{buttons}</PaperProvider>);
    expect(flattenStyle(view.getByTestId('send-container').props.style)).toMatchObject({backgroundColor:'#FFB84D'});
    expect(flattenStyle(view.getByTestId('save-container').props.style)).toMatchObject({backgroundColor:'#FFB84D'});
    expect(flattenStyle(view.getByTestId('special-container').props.style)).toMatchObject({backgroundColor:'#FFE38A'});
  });
  it('keeps selections and quiet actions distinct and disabled actions inactive',async()=>{
    let presses=0;
    const view=await render(<PaperProvider theme={theme}><AppButton testID="selection" mode="contained-tonal">Selected</AppButton><AppButton testID="quiet">Manage</AppButton><AppButton testID="disabled" mode="contained" disabled onPress={()=>presses++}>Unavailable</AppButton></PaperProvider>);
    expect(flattenStyle(view.getByTestId('selection-container').props.style)).toMatchObject({backgroundColor:lightColors.secondaryContainer});
    expect(flattenStyle(view.getByTestId('quiet-text').props.style)).toMatchObject({color:lightColors.onSurface});
    expect(view.getByTestId('disabled').props.accessibilityState.disabled).toBe(true);
    await fireEvent.press(view.getByText('Unavailable'));
    expect(presses).toBe(0);
  });
});
