import React,{useState} from 'react';
import {View,Pressable} from 'react-native';
import {Text,useTheme,ActivityIndicator,SegmentedButtons} from 'react-native-paper';
import {router} from 'expo-router';
import {SvgXml} from 'react-native-svg';
import {Page,styles,Notice} from '../components/ui';
import {AppButton} from '../components/AppButton';
import {TrackScene} from '../components/character/TrackScene';
import {useAppearance} from '../lib/character/appearance';
import {hairstyles,skinTones,hairColors,outfits,pets,eyeStyles,noseStyles,expressions,shirtStyles,genders,isStyleAllowed,parseAppearance,type Appearance} from '../lib/character/catalog';
import {portraitSvg,petSvg,shirtSvg} from '../lib/character/artwork';

function Choice({label,selected,onPress,children}:{label:string;selected:boolean;onPress:()=>void;children:React.ReactNode}) {
  const {colors}=useTheme();
  return <Pressable accessibilityRole="radio" accessibilityLabel={label} accessibilityState={{selected}} onPress={onPress}
    style={{minHeight:64,minWidth:52,flexGrow:1,flexBasis:52,maxWidth:135,padding:8,gap:5,alignItems:'center',justifyContent:'center',backgroundColor:selected?colors.secondaryContainer:colors.surface,borderColor:selected?colors.onSurface:colors.outlineVariant,borderWidth:selected?2:1,borderRadius:16}}>
    {children}<Text variant="labelMedium" style={{color:colors.onSurface,textAlign:'center'}}>{label}{selected?' ✓':''}</Text>
  </Pressable>;
}
function ChoiceGroup({title,children}:{title:string;children:React.ReactNode}) {
  return <View style={{gap:12}}><Text variant="titleMedium" style={{fontWeight:'700'}}>{title}</Text><View accessibilityRole="radiogroup" accessibilityLabel={title} style={{flexDirection:'row',gap:8,flexWrap:'wrap'}}>{children}</View></View>;
}
function Editor() {
  const {appearance,save}=useAppearance(),theme=useTheme();
  const [section,setSection]=useState('look');
  const [draft,setDraft]=useState<Appearance>(appearance),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const [adjustment,setAdjustment]=useState('');
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
    <View testID="character-preview" style={{borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:theme.colors.outlineVariant}}><TrackScene appearance={draft}/></View>
    <SegmentedButtons value={section} onValueChange={setSection} buttons={[{value:'look',label:'Look'},{value:'face',label:'Face'},{value:'clothes',label:'Clothes'},{value:'pet',label:'Pet'}]}/>
    {section==='look'&&<>
    <ChoiceGroup title="Gender">{genders.map(g=><Choice key={g.id} label={g.label} selected={draft.gender===g.id} onPress={()=>choose('gender',g.id)}><SvgXml xml={portraitSvg({...draft,gender:g.id})} width={52} height={52} accessible={false}/></Choice>)}</ChoiceGroup>
    <Text variant="bodySmall" style={{color:theme.colors.onSurfaceVariant}}>Crop and Raglan are male-only. Ponytail and Striped are female-only. Other styles are shared.</Text>
    <ChoiceGroup title="Hairstyle">{hairstyles.filter(h=>isStyleAllowed('hair',h.id,draft.gender)).map(h=><Choice key={h.id} label={h.label} selected={draft.hair===h.id} onPress={()=>choose('hair',h.id)}><SvgXml xml={portraitSvg({...draft,hair:h.id})} width={52} height={52} accessible={false}/></Choice>)}</ChoiceGroup>
    <ChoiceGroup title="Hair color">{hairColors.map(h=><Choice key={h.id} label={h.label} selected={draft.hairColor===h.id} onPress={()=>choose('hairColor',h.id)}><View style={{width:27,height:27,borderRadius:14,backgroundColor:h.color,borderWidth:1,borderColor:theme.colors.outline}}/></Choice>)}</ChoiceGroup>
    <ChoiceGroup title="Skin tone">{skinTones.map(s=><Choice key={s.id} label={s.label} selected={draft.skin===s.id} onPress={()=>choose('skin',s.id)}><View style={{width:27,height:27,borderRadius:14,backgroundColor:s.color,borderWidth:1,borderColor:theme.colors.outline}}/></Choice>)}</ChoiceGroup>
    </>}
    {section==='face'&&<>
    <ChoiceGroup title="Eyes">{eyeStyles.map(e=><Choice key={e.id} label={e.label} selected={draft.eyes===e.id} onPress={()=>choose('eyes',e.id)}><SvgXml xml={portraitSvg({...draft,eyes:e.id})} width={56} height={56} accessible={false}/></Choice>)}</ChoiceGroup>
    <ChoiceGroup title="Nose">{noseStyles.map(n=><Choice key={n.id} label={n.label} selected={draft.nose===n.id} onPress={()=>choose('nose',n.id)}><SvgXml xml={portraitSvg({...draft,nose:n.id})} width={56} height={56} accessible={false}/></Choice>)}</ChoiceGroup>
    <ChoiceGroup title="Expression">{expressions.map(e=><Choice key={e.id} label={e.label} selected={draft.expression===e.id} onPress={()=>choose('expression',e.id)}><SvgXml xml={portraitSvg({...draft,expression:e.id})} width={52} height={52} accessible={false}/></Choice>)}</ChoiceGroup>
    </>}
    {section==='clothes'&&<>
    <ChoiceGroup title="Shirt style">{shirtStyles.filter(s=>isStyleAllowed('shirt',s.id,draft.gender)).map(s=><Choice key={s.id} label={s.label} selected={draft.shirt===s.id} onPress={()=>choose('shirt',s.id)}><SvgXml xml={shirtSvg({...draft,shirt:s.id})} width={50} height={50} accessible={false}/></Choice>)}</ChoiceGroup>
    <ChoiceGroup title="Outfit">{outfits.map(o=><Choice key={o.id} label={o.label} selected={draft.outfit===o.id} onPress={()=>choose('outfit',o.id)}><View style={{width:30,height:32,borderRadius:8,backgroundColor:o.color,borderWidth:1.5,borderColor:theme.colors.onSurface}}/></Choice>)}</ChoiceGroup>
    </>}
    {section==='pet'&&<>
    <ChoiceGroup title="Walking buddy">{pets.map(p=><Choice key={p.id} label={p.id==='none'?p.label:`${p.label} · ${p.species}`} selected={draft.pet===p.id} onPress={()=>choose('pet',p.id)}>{p.id==='none'?<View style={{height:62,justifyContent:'center'}}><Text variant="headlineSmall">—</Text></View>:<SvgXml xml={petSvg(p.id)} width={48} height={54} accessible={false}/>}</Choice>)}</ChoiceGroup>
    </>}
    <Text variant="bodySmall" style={{color:theme.colors.onSurfaceVariant}}>Your saved look stays on this device.</Text>
    {!!adjustment&&<Text accessibilityLiveRegion="polite" variant="bodySmall" style={{color:theme.colors.onSurfaceVariant}}>{adjustment}</Text>}
    <Notice text={error}/>
    <AppButton mode="contained" disabled={busy} loading={busy} onPress={()=>void submit()} contentStyle={styles.button}>Save look</AppButton>
  </>;
}
export default function CharacterScreen() {
  const {ready}=useAppearance();
  return <Page><View style={{alignItems:'flex-start'}}><AppButton onPress={()=>router.canGoBack()?router.back():router.replace('/(tabs)/track')}>Back</AppButton></View>{ready?<Editor/>:<ActivityIndicator accessibilityLabel="Loading your saved look"/>}</Page>;
}
