import React,{useState,useContext,createContext} from 'react';
import {View,Pressable,useWindowDimensions} from 'react-native';
import {Text,useTheme,ActivityIndicator} from 'react-native-paper';
import {router} from 'expo-router';
import Svg,{Path,SvgXml} from 'react-native-svg';
import {Page,styles,Notice} from '../components/ui';
import {AppButton} from '../components/AppButton';
import {TrackScene} from '../components/character/TrackScene';
import {useAppearance} from '../lib/character/appearance';
import {hairstyles,skinTones,hairColors,outfits,pets,eyeStyles,noseStyles,expressions,shirtStyles,genders,isStyleAllowed,parseAppearance,type Appearance} from '../lib/character/catalog';
import {petSvg} from '../lib/character/artwork';
import {choiceArtwork} from '../lib/character/previews';

const ChoiceColumns=createContext(4);

function Choice({label,selected,onPress,children,caption=false}:{label:string;selected:boolean;onPress:()=>void;children:React.ReactNode;caption?:boolean}) {
  const {colors}=useTheme(),columns=useContext(ChoiceColumns);
  return <Pressable accessibilityRole="radio" accessibilityLabel={label} accessibilityState={{selected,checked:selected}} onPress={onPress}
    style={{minHeight:caption?122:88,minWidth:64,flexGrow:1,flexShrink:1,flexBasis:columns===1?'100%':columns===3?'29%':columns===2?'44%':'21%',padding:caption?12:8,gap:8,alignItems:'center',overflow:'hidden',position:'relative',justifyContent:'center',backgroundColor:selected?colors.secondaryContainer:colors.surface,borderColor:selected?colors.onSurface:colors.outlineVariant,borderWidth:selected?2:1,borderRadius:16}}>
    {children}{caption&&<Text variant="titleMedium" style={{fontWeight:'700',textAlign:'center',alignSelf:'stretch',paddingHorizontal:12,flexShrink:1,color:colors.onSurface}}>{label}</Text>}{selected&&<View pointerEvents="none" style={{position:'absolute',right:4,bottom:4,width:19,height:19,borderRadius:10,backgroundColor:colors.onSurface,alignItems:'center',justifyContent:'center'}}><Svg width={13} height={13} viewBox="0 0 20 20" accessible={false}><Path d="M4 10 L8 14 L16 5" fill="none" stroke={colors.surface} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"/></Svg></View>}
  </Pressable>;
}
function ChoiceGroup({title,children}:{title:string;children:React.ReactNode}) {
  const count=React.Children.count(children),{width,fontScale}=useWindowDimensions();
  const preferred=count===5?3:Math.min(count,4);
  const columns=Math.max(1,Math.min(preferred,Math.floor((Math.min(width,600)-48+8)/(fontScale>1.3?140:72))));
  return <ChoiceColumns.Provider value={columns}><View style={{gap:12}}><Text variant="titleMedium" style={{fontWeight:'700'}}>{title}</Text><View accessibilityRole="radiogroup" accessibilityLabel={title} style={{flexDirection:'row',gap:8,flexWrap:'wrap'}}>{children}</View></View></ChoiceColumns.Provider>;
}
function Editor() {
  const {appearance,save}=useAppearance(),theme=useTheme(),{width,fontScale}=useWindowDimensions();
  const [section,setSection]=useState('look');
  const [draft,setDraft]=useState<Appearance>(appearance),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const [adjustment,setAdjustment]=useState('');
  const dirty=JSON.stringify(draft)!==JSON.stringify(appearance);
  function reset(){setDraft(appearance);setAdjustment('');setError('');}
  function choose<K extends keyof Appearance>(key:K,value:Appearance[K]) {
    const next=parseAppearance(JSON.stringify({...draft,[key]:value}));
    const adjusted=key==='gender'&&(next.hair!==draft.hair||next.shirt!==draft.shirt);
    setDraft(next);setAdjustment(adjusted?'Unavailable styles were replaced with shared options. Your other choices are unchanged.':'');
  }
  async function submit() {
    setBusy(true);setError('');
    try {await save(draft);router.replace('/(tabs)/track');}
    catch {setError('Your look could not be saved on this device. Please try again.');setBusy(false);}
  }
  return <>
    <View style={{gap:7}}><Text variant="headlineLarge" style={{fontWeight:'700',letterSpacing:-0.8}}>A look of your own.</Text><Text variant="bodyLarge" style={{color:theme.colors.onSurfaceVariant}}>Pick your style. Bring a little company.</Text></View>
    <View testID="character-preview" style={{borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:theme.colors.outlineVariant}}><TrackScene appearance={draft} compact/></View>
    <View accessibilityRole="radiogroup" accessibilityLabel="Character category" style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
      {[{id:'look',label:'Look'},{id:'face',label:'Face'},{id:'clothes',label:'Clothes'},{id:'pet',label:'Pet'}].map(item=><Pressable key={item.id} accessibilityRole="radio" accessibilityLabel={item.label} accessibilityState={{selected:section===item.id,checked:section===item.id}} onPress={()=>setSection(item.id)} android_ripple={{color:theme.colors.surfaceVariant}} style={{flexGrow:1,flexShrink:1,flexBasis:fontScale>1.3||width<360?'44%':'21%',minWidth:64,minHeight:48,paddingVertical:12,paddingHorizontal:8,borderRadius:12,borderWidth:section===item.id?2:1,borderColor:section===item.id?theme.colors.onSurface:theme.colors.outline,backgroundColor:section===item.id?theme.colors.secondaryContainer:theme.colors.surface,justifyContent:'center',alignItems:'center'}}><Text variant="labelLarge" style={{textAlign:'center',fontWeight:'700',flexShrink:1,color:theme.colors.onSurface}}>{item.label}</Text></Pressable>)}
    </View>
    {section==='look'&&<>
    <ChoiceGroup title="Gender">{genders.map(g=><Choice caption key={g.id} label={g.label} selected={draft.gender===g.id} onPress={()=>choose('gender',g.id)}><SvgXml xml={choiceArtwork.gender[g.id]} width="100%" height={68} accessible={false}/></Choice>)}</ChoiceGroup>

    <ChoiceGroup title="Hairstyle">{hairstyles.filter(h=>isStyleAllowed('hair',h.id,draft.gender)).map(h=><Choice key={h.id} label={h.label} selected={draft.hair===h.id} onPress={()=>choose('hair',h.id)}><SvgXml xml={choiceArtwork.hair[h.id]} width="100%" height={68} accessible={false}/></Choice>)}</ChoiceGroup>
    <ChoiceGroup title="Hair color">{hairColors.map(h=><Choice key={h.id} label={h.label} selected={draft.hairColor===h.id} onPress={()=>choose('hairColor',h.id)}><View style={{width:27,height:27,borderRadius:14,backgroundColor:h.color,borderWidth:1,borderColor:theme.colors.outline}}/></Choice>)}</ChoiceGroup>
    <ChoiceGroup title="Skin tone">{skinTones.map(s=><Choice key={s.id} label={s.label} selected={draft.skin===s.id} onPress={()=>choose('skin',s.id)}><View style={{width:27,height:27,borderRadius:14,backgroundColor:s.color,borderWidth:1,borderColor:theme.colors.outline}}/></Choice>)}</ChoiceGroup>
    </>}
    {section==='face'&&<>
    <ChoiceGroup title="Eyes">{eyeStyles.map(e=><Choice key={e.id} label={e.label} selected={draft.eyes===e.id} onPress={()=>choose('eyes',e.id)}><SvgXml xml={choiceArtwork.eyes[e.id]} width="100%" height={68} accessible={false}/></Choice>)}</ChoiceGroup>
    <ChoiceGroup title="Nose">{noseStyles.map(n=><Choice key={n.id} label={n.label} selected={draft.nose===n.id} onPress={()=>choose('nose',n.id)}><SvgXml xml={choiceArtwork.nose[n.id]} width="100%" height={68} accessible={false}/></Choice>)}</ChoiceGroup>
    <ChoiceGroup title="Expression">{expressions.map(e=><Choice key={e.id} label={e.label} selected={draft.expression===e.id} onPress={()=>choose('expression',e.id)}><SvgXml xml={choiceArtwork.expression[e.id]} width="100%" height={68} accessible={false}/></Choice>)}</ChoiceGroup>
    </>}
    {section==='clothes'&&<>
    <ChoiceGroup title="Shirt style">{shirtStyles.filter(s=>isStyleAllowed('shirt',s.id,draft.gender)).map(s=><Choice key={s.id} label={s.label} selected={draft.shirt===s.id} onPress={()=>choose('shirt',s.id)}><SvgXml xml={choiceArtwork.shirt[s.id]} width="100%" height={68} accessible={false}/></Choice>)}</ChoiceGroup>
    <ChoiceGroup title="Outfit">{outfits.map(o=><Choice key={o.id} label={o.label} selected={draft.outfit===o.id} onPress={()=>choose('outfit',o.id)}><View style={{width:30,height:32,borderRadius:8,backgroundColor:o.color,borderWidth:1.5,borderColor:theme.colors.onSurface}}/></Choice>)}</ChoiceGroup>
    </>}
    {section==='pet'&&<>
    <ChoiceGroup title="Walking buddy">{pets.map(p=><Choice key={p.id} label={p.id==='none'?p.label:`${p.label} · ${p.species}`} selected={draft.pet===p.id} onPress={()=>choose('pet',p.id)}>{p.id==='none'?<View style={{height:62,justifyContent:'center'}}><Text variant="headlineSmall">—</Text></View>:<SvgXml xml={petSvg(p.id)} width="100%" height={68} accessible={false}/>}</Choice>)}</ChoiceGroup>
    </>}
    <View style={{gap:8,borderTopWidth:1,borderColor:theme.colors.outlineVariant,paddingTop:16}}>
      <Text accessibilityLiveRegion="polite" variant="bodyMedium" style={{fontWeight:'600',color:theme.colors.onSurface}}>{dirty?'Unsaved changes':'Saved look'}</Text>
      <Text variant="bodySmall" style={{color:theme.colors.onSurfaceVariant}}>Your look is saved on this device.</Text>
      {dirty&&<AppButton onPress={reset} contentStyle={{minHeight:48}} style={{alignSelf:'flex-start'}}>Reset changes</AppButton>}
    </View>
    {!!adjustment&&<Text accessibilityLiveRegion="polite" variant="bodySmall" style={{color:theme.colors.onSurfaceVariant}}>{adjustment}</Text>}
    <Notice text={error}/>
    <AppButton mode="contained" disabled={busy||!dirty} loading={busy} onPress={()=>void submit()} contentStyle={styles.button}>Save look</AppButton>
  </>;
}
export default function CharacterScreen() {
  const {ready}=useAppearance();
  return <Page><View style={{alignItems:'flex-start'}}><AppButton onPress={()=>router.canGoBack()?router.back():router.replace('/(tabs)/track')}>Back</AppButton></View>{ready?<Editor/>:<ActivityIndicator accessibilityLabel="Loading your saved look"/>}</Page>;
}
