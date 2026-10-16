import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lightColors,darkColors,avatarColors} from '../src/lib/palette';

function luminance(hex:string) {
  const values=hex.slice(1).match(/../g)!.map(c=>parseInt(c,16)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
  return values[0]*0.2126+values[1]*0.7152+values[2]*0.0722;
}
function contrast(a:string,b:string) {const x=luminance(a),y=luminance(b);return(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
for(const [name,colors] of [['light',lightColors],['dark',darkColors]] as const) {
  test(`${name} theme foreground/background pairs meet text contrast`,()=>{
    for(const [foreground,background] of [
      ['onPrimary','primary'],['onPrimaryContainer','primaryContainer'],['onSecondary','secondary'],
      ['onSecondaryContainer','secondaryContainer'],['onTertiary','tertiary'],['onTertiaryContainer','tertiaryContainer'],
      ['onBackground','background'],['onSurface','surface'],['onSurface','background'],
      ['onSurfaceVariant','surfaceVariant'],['onSurfaceVariant','background'],
      ['onError','error'],['onErrorContainer','errorContainer'],['inverseOnSurface','inverseSurface'],
      ['primary','background'],['primary','surface'],
    ] as const) assert.ok(contrast(colors[foreground],colors[background])>=4.5,`${name}: ${foreground} on ${background}`);
  });
  test(`${name} input outlines and icon colors meet non-text contrast`,()=>{
    assert.ok(contrast(colors.outline,colors.surface)>=3);
    assert.ok(contrast(colors.outline,colors.background)>=3);
    assert.ok(contrast(colors.onSurface,colors.background)>=3);
  });
  test(`${name} multicolor avatar labels remain readable`,()=>{
    for(const [background,foreground] of avatarColors[name])assert.ok(contrast(foreground,background)>=4.5);
  });
}
