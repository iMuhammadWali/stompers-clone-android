import {writeFileSync,mkdirSync} from 'node:fs';
import {trackSvg} from '../src/lib/character/artwork';
import {defaultAppearance,type Appearance} from '../src/lib/character/catalog';
const looks:Appearance[]=[defaultAppearance,
  {...defaultAppearance,hair:'ponytail',skin:'deep',outfit:'lilac',pet:'cat'},
  {...defaultAppearance,hair:'curls',hairColor:'honey',skin:'sand',outfit:'tangerine',pet:'rabbit'},
  {...defaultAppearance,hair:'crop',hairColor:'chestnut',outfit:'clover',pet:'none'},
];
const sheet=`<svg xmlns="http://www.w3.org/2000/svg" width="780" height="840" viewBox="0 0 780 840">${looks.map((a,i)=>`<g transform="translate(${i%2*390} ${Math.floor(i/2)*420})">${trackSvg(a).replace(/<svg[^>]*>/,'').replace('</svg>','')}</g>`).join('')}</svg>`;
mkdirSync('assets/characters',{recursive:true});
writeFileSync('assets/characters/design-sheet.svg',sheet);
