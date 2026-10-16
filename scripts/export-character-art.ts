import {writeFileSync,mkdirSync} from 'node:fs';
import {trackSvg,characterLayers} from '../src/lib/character/artwork';
import {defaultAppearance,type Appearance} from '../src/lib/character/catalog';
const looks:Appearance[]=[defaultAppearance,
  {...defaultAppearance,hair:'ponytail',skin:'deep',outfit:'lilac',pet:'cat'},
  {...defaultAppearance,hair:'curls',hairColor:'honey',skin:'sand',outfit:'tangerine',pet:'rabbit'},
  {...defaultAppearance,hair:'crop',hairColor:'chestnut',outfit:'clover',pet:'none'},
];
const sheet=`<svg xmlns="http://www.w3.org/2000/svg" width="780" height="840" viewBox="0 0 780 840">${looks.map((a,i)=>`<g transform="translate(${i%2*390} ${Math.floor(i/2)*420})">${trackSvg(a).replace(/<svg[^>]*>/,'').replace('</svg>','')}</g>`).join('')}</svg>`;
mkdirSync('assets/characters',{recursive:true});
writeFileSync('assets/characters/design-sheet.svg',sheet);

const poses=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="440" viewBox="0 0 640 440"><rect width="640" height="440" fill="#F5F6F8"/>${Array.from({length:8},(_,i)=>`<g transform="translate(${i%4*160+15} ${Math.floor(i/4)*220+10})"><path d="M0 182 H130" stroke="#C6C9D1"/>${characterLayers(defaultAppearance,i)}<text x="60" y="204" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#343239">${['Contact','Down','Passing','Up','Contact','Down','Passing','Up'][i]}</text></g>`).join('')}</svg>`;
writeFileSync('assets/characters/pose-sheet.svg',poses);
