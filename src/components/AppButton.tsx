import React,{useId} from 'react';
import {View,StyleSheet} from 'react-native';
import {Button as PaperButton,useTheme} from 'react-native-paper';
import Svg,{Defs,LinearGradient,Stop,Rect,Ellipse} from 'react-native-svg';
import {buttonFinish} from '../lib/palette';

type Props = React.ComponentProps<typeof PaperButton> & {glossy?:boolean};

/** Shared button colors and finish; screens keep their existing actions and sizing. */
export function AppButton({mode='text',buttonColor,textColor,disabled,glossy=buttonFinish.enabled,style,testID='button',...props}:Props) {
  const {colors}=useTheme();
  const gradientId=`button-shine-${useId().replace(/[^a-zA-Z0-9-]/g,'')}`;
  const filled=mode==='contained';
  const tonal=mode==='contained-tonal';
  const shine=filled&&!disabled&&glossy;
  // Paper retains its native ripple, loading indicator and disabled styling.
  const background=disabled?undefined:filled?colors.primaryContainer:tonal?colors.secondaryContainer:undefined;
  const foreground=disabled?undefined:filled?colors.onPrimaryContainer:tonal?colors.onSecondaryContainer:colors.onSurface;
  const button=<PaperButton {...props} testID={testID} mode={mode} disabled={disabled}
    style={shine?[{borderRadius:buttonFinish.radius,borderColor:colors.onSurface,borderWidth:buttonFinish.edgeWidth,borderBottomWidth:buttonFinish.lowerEdgeWidth},style]:style}
    buttonColor={buttonColor??background} textColor={textColor??foreground}/>;
  if(!shine)return button;
  return <View style={styles.wrapper}>
    {button}
    <View pointerEvents="none" accessible={false} testID={`${testID}-gloss`}
      style={[StyleSheet.absoluteFill,{borderRadius:buttonFinish.radius,overflow:'hidden'}]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" accessible={false}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={buttonFinish.highlight} stopOpacity={buttonFinish.highlightOpacity}/>
            <Stop offset="0.46" stopColor={buttonFinish.highlight} stopOpacity="0"/>
            <Stop offset="0.72" stopColor={colors.onSurface} stopOpacity="0"/>
            <Stop offset="1" stopColor={colors.onSurface} stopOpacity={buttonFinish.shadeOpacity}/>
          </LinearGradient>
        </Defs>
        <Rect x="1" y="3" width="98" height="93" rx="16" fill={`url(#${gradientId})`}/>
        <Ellipse cx="5" cy="23" rx="1.15" ry="10" fill={buttonFinish.highlight} opacity="0.42"/>
      </Svg>
    </View>
  </View>;
}
const styles=StyleSheet.create({wrapper:{position:'relative'}});
