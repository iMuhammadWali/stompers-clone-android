export const hairstyles = [
  {id:'crop',label:'Crop'}, {id:'waves',label:'Waves'},
  {id:'curls',label:'Curls'}, {id:'ponytail',label:'Ponytail'},
] as const;
export const skinTones = [
  {id:'porcelain',label:'Porcelain',color:'#F8D6BA',shade:'#DFAB8B'},
  {id:'sand',label:'Sand',color:'#E9B385',shade:'#CE8B60'},
  {id:'warm',label:'Warm',color:'#C88454',shade:'#AA603C'},
  {id:'umber',label:'Umber',color:'#99613F',shade:'#7C472E'},
  {id:'deep',label:'Deep',color:'#69412F',shade:'#4D2D24'},
] as const;
export const hairColors = [
  {id:'espresso',label:'Espresso',color:'#342D32',shine:'#55434A'},
  {id:'chestnut',label:'Chestnut',color:'#80503A',shine:'#A9774D'},
  {id:'honey',label:'Honey',color:'#D6A34D',shine:'#F6CE7A'},
] as const;
export const outfits = [
  {id:'tangerine',label:'Tangerine',color:'#FF9D43',shade:'#D56B32',shorts:'#3D4159'},
  {id:'lagoon',label:'Lagoon',color:'#56C9CE',shade:'#279BA6',shorts:'#35465C'},
  {id:'lilac',label:'Lilac',color:'#B6A1E9',shade:'#8971BF',shorts:'#42405B'},
  {id:'clover',label:'Clover',color:'#AED27E',shade:'#78A654',shorts:'#3D4C40'},
] as const;
export const pets = [
  {id:'dog',label:'Biscuit',species:'Dog',color:'#E6AE68'},
  {id:'cat',label:'Mochi',species:'Cat',color:'#A8ABBF'},
  {id:'rabbit',label:'Clover',species:'Rabbit',color:'#F5E7D4'},
  {id:'none',label:'Just me',species:'No pet',color:'#E7E9F0'},
] as const;
export const eyeStyles = [
  {id:'round',label:'Round'}, {id:'almond',label:'Almond'},
  {id:'relaxed',label:'Relaxed'}, {id:'sparkle',label:'Sparkle'},
] as const;
export const noseStyles = [
  {id:'button',label:'Button'}, {id:'straight',label:'Straight'}, {id:'rounded',label:'Rounded'},
] as const;
export const expressions = [
  {id:'smile',label:'Smile'}, {id:'grin',label:'Grin'}, {id:'calm',label:'Calm'},
  {id:'determined',label:'Determined'}, {id:'surprised',label:'Surprised'},
] as const;
export const shirtStyles = [
  {id:'tee',label:'Classic tee'}, {id:'striped',label:'Striped'},
  {id:'raglan',label:'Raglan'}, {id:'hoodie',label:'Hoodie'},
] as const;
export const genders = [
  {id:'male',label:'Male'}, {id:'female',label:'Female'}, {id:'nonbinary',label:'Nonbinary'},
] as const;
export type Appearance = {
  hair:typeof hairstyles[number]['id'];skin:typeof skinTones[number]['id'];
  hairColor:typeof hairColors[number]['id'];outfit:typeof outfits[number]['id'];
  pet:typeof pets[number]['id'];eyes:typeof eyeStyles[number]['id'];nose:typeof noseStyles[number]['id'];
  expression:typeof expressions[number]['id'];shirt:typeof shirtStyles[number]['id'];gender:typeof genders[number]['id'];
};
export const defaultAppearance:Appearance={hair:'waves',skin:'warm',hairColor:'espresso',outfit:'lagoon',pet:'dog',eyes:'round',nose:'button',expression:'smile',shirt:'tee',gender:'nonbinary'};
/** Storage is untrusted; unknown/missing options fall back independently. */
export function parseAppearance(raw:string|null):Appearance {
  let input:Record<string,unknown>={};
  try {const data=JSON.parse(raw??'{}');if(data&&typeof data==='object'&&!Array.isArray(data))input=data;}catch{}
  const result={...defaultAppearance};
  const catalogs={hair:hairstyles,skin:skinTones,hairColor:hairColors,outfit:outfits,pet:pets,eyes:eyeStyles,nose:noseStyles,expression:expressions,shirt:shirtStyles,gender:genders};
  for(const key of Object.keys(catalogs) as (keyof Appearance)[]) {
    if(catalogs[key].some(item=>item.id===input[key]))Object.assign(result,{[key]:input[key]});
  }
  return result;
}
export function appearanceKey(account:string) {return 'stride.appearance.v1.'+Array.from(account).map(c=>c.codePointAt(0)!.toString(16)).join('-');}
