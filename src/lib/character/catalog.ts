export const hairstyles = [
  {id:'crop',label:'Crop',gender:'male'}, {id:'waves',label:'Waves',gender:'male'},
  {id:'curls',label:'Curls',gender:'male'}, {id:'quiff',label:'Quiff',gender:'male'},
  {id:'sidepart',label:'Side part',gender:'male'}, {id:'spikes',label:'Spikes',gender:'male'},
  {id:'ponytail',label:'Ponytail',gender:'female'}, {id:'bob',label:'Bob',gender:'female'},
  {id:'bun',label:'Bun',gender:'female'}, {id:'braids',label:'Braids',gender:'female'},
  {id:'longwaves',label:'Long waves',gender:'female'}, {id:'ringlets',label:'Ringlets',gender:'female'},
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
  {id:'fox',label:'Ember',species:'Fox',color:'#E99A57'},
  {id:'dragon',label:'Sprout',species:'Dragon',color:'#A8CC82'},
  {id:'spaceship',label:'Orbit',species:'Alien spaceship',color:'#B8CAD6'},
  {id:'none',label:'Just me',species:'No pet',color:'#E7E9F0'},
] as const;
export const eyeStyles = [
  {id:'round',label:'Round'}, {id:'almond',label:'Almond'},
  {id:'relaxed',label:'Relaxed'}, {id:'sparkle',label:'Sparkle'},
] as const;
export const eyewearStyles = [{id:'none',label:'No glasses'},{id:'sunglasses',label:'Sunglasses'}] as const;
export const noseStyles = [
  {id:'dot',label:'Minimal nose'}, {id:'curve',label:'Button nose'}, {id:'wedge',label:'Soft bridge'},
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
  {id:'male',label:'Male'}, {id:'female',label:'Female'},
] as const;
export type Appearance = {
  hair:typeof hairstyles[number]['id'];skin:typeof skinTones[number]['id'];
  hairColor:typeof hairColors[number]['id'];outfit:typeof outfits[number]['id'];
  pet:typeof pets[number]['id'];eyes:typeof eyeStyles[number]['id'];nose:typeof noseStyles[number]['id'];
  expression:typeof expressions[number]['id'];eyewear:typeof eyewearStyles[number]['id'];shirt:typeof shirtStyles[number]['id'];gender:typeof genders[number]['id'];
};
export const defaultAppearance:Appearance={hair:'waves',skin:'sand',hairColor:'espresso',outfit:'lagoon',pet:'dog',eyes:'round',nose:'curve',expression:'smile',eyewear:'none',shirt:'tee',gender:'male'};
/** Gender-specific inventory lives here, so UI and stored looks use identical rules. */
export const styleAvailability:{hair:Partial<Record<Appearance['hair'],readonly Appearance['gender'][]>>;shirt:Partial<Record<Appearance['shirt'],readonly Appearance['gender'][]>>}={
  hair:Object.fromEntries(hairstyles.map(h=>[h.id,[h.gender]])),
  shirt:{raglan:['male'],striped:['female']},
};
export function isStyleAllowed(kind:'hair'|'shirt',id:string,gender:Appearance['gender']):boolean {
  const rules:Record<string,readonly Appearance['gender'][]|undefined>=styleAvailability[kind];
  return !rules[id]||rules[id]!.includes(gender);
}
export function normalizeStyles(value:Appearance):Appearance {
  const fallbackHair=value.gender==='female'?(value.hair==='waves'?'longwaves':value.hair==='curls'?'ringlets':'ponytail'):'waves';
  return {...value,hair:isStyleAllowed('hair',value.hair,value.gender)?value.hair:fallbackHair,shirt:isStyleAllowed('shirt',value.shirt,value.gender)?value.shirt:'tee'};
}
/** Storage is untrusted; unknown/missing options fall back independently. */
export function parseAppearance(raw:string|null):Appearance {
  let input:Record<string,unknown>={};
  try {const data=JSON.parse(raw??'{}');if(data&&typeof data==='object'&&!Array.isArray(data))input=data;}catch{}
  const legacyNoses:Record<string,string>={button:'dot',straight:'wedge',rounded:'curve'};
  if(typeof input.nose==='string')input.nose=legacyNoses[input.nose]??input.nose;
  // Preserve existing gender-specific inventory when migrating the retired third option.
  if(input.gender==='nonbinary')input.gender=hairstyles.some(h=>h.id===input.hair&&h.gender==='female')||input.shirt==='striped'?'female':'male';
  const result={...defaultAppearance};
  const catalogs={hair:hairstyles,skin:skinTones,hairColor:hairColors,outfit:outfits,pet:pets,eyes:eyeStyles,eyewear:eyewearStyles,nose:noseStyles,expression:expressions,shirt:shirtStyles,gender:genders};
  for(const key of Object.keys(catalogs) as (keyof Appearance)[]) {
    if(catalogs[key].some(item=>item.id===input[key]))Object.assign(result,{[key]:input[key]});
  }
  return normalizeStyles(result);
}
export function appearanceKey(account:string) {return 'stride.appearance.v1.'+Array.from(account).map(c=>c.codePointAt(0)!.toString(16)).join('-');}
