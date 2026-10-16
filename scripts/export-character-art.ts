import {writeFileSync,mkdirSync} from 'node:fs';
import {trackSvg,characterLayers,portraitSvg,shirtSvg,featureSvg} from '../src/lib/character/artwork';
import {defaultAppearance,eyeStyles,noseStyles,expressions,shirtStyles,genders,parseAppearance,type Appearance} from '../src/lib/character/catalog';
const looks:Appearance[]=[defaultAppearance,
  {...defaultAppearance,hair:'ponytail',skin:'deep',outfit:'lilac',pet:'cat',gender:'female',eyes:'almond',nose:'curve',expression:'grin',shirt:'striped'},
  {...defaultAppearance,hair:'curls',hairColor:'honey',skin:'sand',outfit:'tangerine',pet:'rabbit',gender:'male',eyes:'relaxed',nose:'wedge',expression:'calm',shirt:'hoodie'},
  {...defaultAppearance,hair:'crop',hairColor:'chestnut',outfit:'clover',pet:'none',gender:'male',eyes:'sparkle',nose:'curve',expression:'determined',shirt:'raglan'},
];
const sheet=`<svg xmlns="http://www.w3.org/2000/svg" width="780" height="840" viewBox="0 0 780 840">${looks.map((a,i)=>`<g transform="translate(${i%2*390} ${Math.floor(i/2)*420})">${trackSvg(parseAppearance(JSON.stringify(a))).replace(/<svg[^>]*>/,'').replace('</svg>','')}</g>`).join('')}</svg>`;
mkdirSync('assets/characters',{recursive:true});
writeFileSync('assets/characters/design-sheet.svg',sheet);

const poses=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="440" viewBox="0 0 640 440"><rect width="640" height="440" fill="#F5F6F8"/>${Array.from({length:8},(_,i)=>`<g transform="translate(${i%4*160+15} ${Math.floor(i/4)*220+10})"><path d="M0 182 H130" stroke="#C6C9D1"/>${characterLayers(defaultAppearance,i)}<text x="60" y="204" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#343239">${['Contact','Down','Passing','Up','Contact','Down','Passing','Up'][i]}</text></g>`).join('')}</svg>`;
writeFileSync('assets/characters/pose-sheet.svg',poses);

const featureRows=[
  eyeStyles.map(e=>({label:e.label,art:featureSvg({...defaultAppearance,eyes:e.id,expression:'calm'},'eyes')})),
  noseStyles.map(n=>({label:n.label,art:featureSvg({...defaultAppearance,nose:n.id,expression:'calm'},'nose')})),
  expressions.map(e=>({label:e.label,art:featureSvg({...defaultAppearance,expression:e.id},'expression')})),
  shirtStyles.map(s=>({label:s.label,art:shirtSvg({...defaultAppearance,shirt:s.id,gender:s.id==='striped'?'female':s.id==='raglan'?'male':'nonbinary'})})),
  genders.map(g=>({label:g.label,art:portraitSvg({...defaultAppearance,gender:g.id})})),
];
const features=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="650" viewBox="0 0 600 650"><rect width="600" height="650" fill="#F5F6F8"/>${featureRows.map((row,y)=>row.map((f,x)=>`<g transform="translate(${x*120+10} ${y*130+5})">${f.art}<text x="50" y="116" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#343239">${f.label}</text></g>`).join('')).join('')}</svg>`;
writeFileSync('assets/characters/features-sheet.svg',features);
