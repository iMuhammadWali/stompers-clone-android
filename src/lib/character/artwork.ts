import {hairColors,skinTones,outfits,type Appearance,parseAppearance} from './catalog';
// Original layered SVG artwork. Coordinates share one rig; no downloaded game assets.
export const sceneColors={sky:'#F5F6F8',cloud:'#FFFFFF',farHill:'#ECE9DF',hill:'#DEE7CD',grass:'#8AA966',tree:'#557A50',trunk:'#876448',edge:'#F58A42',track:'#FFE0A0',trackShade:'#F7C979',lane:'#FFF5D5',stone:'#BAA187',ink:'#343239'};
const stroke='stroke="#343239" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"';
const path=(d:string,fill:string)=>`<path d="${d}" fill="${fill}" ${stroke}/>`;
const limb=(d:string,color:string)=>`<path d="${d}" fill="none" stroke="#343239" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`;
export function characterLayers(value:Appearance,frame=0):string {
  const a=parseAppearance(JSON.stringify(value));
  const skin=skinTones.find(x=>x.id===a.skin)!;
  const hair=hairColors.find(x=>x.id===a.hairColor)!;
  const outfit=outfits.find(x=>x.id===a.outfit)!;
  // Contact → down → passing → up → opposite contact. Frame zero is a readable stride.
  const angle=((frame%8+8)%8)/8*Math.PI*2;
  const swing=Math.cos(angle),passing=Math.sin(angle);
  const frontLift=Math.max(0,passing)*14,backLift=Math.max(0,-passing)*14;
  const backX=60-swing*25,backY=171-backLift;
  const frontX=60+swing*25,frontY=171-frontLift;
  const backLeg=`M51 123 Q${54-swing*12} ${148-backLift*1.3} ${backX} ${backY}`;
  const frontLeg=`M68 123 Q${65+swing*12} ${148-frontLift*1.3} ${frontX} ${frontY}`;
  const shoe=(x:number,y:number)=>`M${x-5} ${y-3} L${x+5} ${y-3} L${x+13} ${y+5} Q${x+15} ${y+10} ${x+6} ${y+10} L${x-10} ${y+10} Q${x-13} ${y+7} ${x-8} ${y+2} Z`;
  const backShoe=shoe(backX,backY),frontShoe=shoe(frontX,frontY);
  const farHand={x:78+swing*23,y:116-Math.max(swing,0)*19};
  const nearHand={x:43-swing*25,y:117-Math.max(-swing,0)*5};
  const arm=(shoulderX:number,elbowX:number,hand:{x:number;y:number},color:string,name:string)=>`<g data-limb="${name}">`+
    `<path d="M${shoulderX} 85 L${elbowX} 103 L${hand.x} ${hand.y-3}" fill="none" stroke="#343239" stroke-width="13" stroke-linecap="round"/>`+
    `<path d="M${shoulderX} 85 L${elbowX} 103 L${hand.x} ${hand.y-3}" fill="none" stroke="${color}" stroke-width="8.5" stroke-linecap="round"/>`+
    `<g data-limb="${name}-hand"><ellipse cx="${hand.x}" cy="${hand.y}" rx="5.8" ry="7" fill="${color}" ${stroke}/>`+
    `<path d="M${hand.x+3} ${hand.y-3} Q${hand.x+8} ${hand.y-4} ${hand.x+6} ${hand.y+1}" fill="${color}" stroke="#343239" stroke-width="1.5" stroke-linecap="round"/></g></g>`;
  const hairShapes={
    crop:'M34 45 Q24 19 43 13 Q65 1 84 20 L88 35 Q71 35 63 26 Q50 42 34 45 Z',
    waves:'M32 48 Q23 38 29 28 Q22 17 38 15 Q37 3 51 8 Q64 -1 73 12 Q87 6 90 23 Q99 32 87 41 L78 30 Q67 35 59 24 Q50 43 36 40 Z',
    curls:'M32 49 Q22 44 26 34 Q17 23 30 18 Q26 6 41 8 Q45 -4 57 5 Q69 -2 77 9 Q93 6 92 21 Q104 30 92 39 L83 41 Q76 29 66 31 Q55 42 46 33 L38 49 Z',
    ponytail:'M32 49 Q22 34 32 19 Q48 0 70 10 Q90 12 91 35 L80 39 Q66 28 62 23 Q51 41 37 43 Z',
  };
  return `<g data-layer="character" transform="translate(0 0)">`+
    (a.hair==='ponytail'?path('M32 25 Q8 14 9 38 Q2 61 20 66 Q13 42 33 42 Z',hair.color):'')+
    `<g data-limb="far-leg">${limb(backLeg,skin.shade)}<g transform="rotate(${Math.max(swing,0)*16} ${backX+12} ${backY+9})">${path(backShoe,'#E1E1DD')}</g></g>`+
    arm(78,83+swing*5,farHand,skin.shade,'far-arm')+
    path('M44 107 L74 107 L81 133 L65 138 L59 125 L53 138 L36 131 Z',outfit.shorts)+
    `<g data-limb="near-leg">${limb(frontLeg,skin.color)}<g transform="rotate(${-Math.max(swing,0)*7} ${frontX-10} ${frontY+9})">${path(frontShoe,'#F7F6F1')}</g></g>`+
    path('M50 61 L51 77 L69 78 L69 60 Z',skin.shade)+
    path('M49 70 Q58 77 71 70 L82 79 L82 96 L76 95 L77 115 Q60 122 40 113 L42 96 L35 93 L36 80 Z',outfit.color)+
    `<path d="M72 76 L75 111 Q61 116 43 110" fill="none" stroke="${outfit.shade}" stroke-width="5"/>`+
    '<path d="M48 73 Q58 82 72 74" fill="none" stroke="#343239" stroke-width="2.1"/>'+
    arm(43,42-swing*15,nearHand,skin.color,'near-arm')+
    path('M34 34 Q39 15 61 17 Q84 17 88 38 L89 48 L94 53 Q96 57 88 58 Q85 75 66 75 Q43 73 36 58 Q25 59 26 49 Q27 42 34 45 Z',skin.color)+
    `<path d="M36 50 Q31 46 31 53 M81 55 L85 57" fill="none" stroke="${skin.shade}" stroke-width="2.2"/>`+
    '<ellipse cx="71" cy="44" rx="5" ry="6" fill="#FFFFFF"/><ellipse cx="84" cy="44" rx="3.4" ry="5" fill="#FFFFFF"/>'+
    '<ellipse cx="73" cy="45" rx="2.2" ry="3.1" fill="#343239"/><ellipse cx="85" cy="45" rx="1.8" ry="2.8" fill="#343239"/>'+
    '<path d="M66 35 Q71 32 76 35 M81 35 L86 36 M77 63 Q82 65 85 61" fill="none" stroke="#343239" stroke-width="2" stroke-linecap="round"/>'+
    path(hairShapes[a.hair],hair.color)+
    `<path d="M37 22 Q49 12 62 15" fill="none" stroke="${hair.shine}" stroke-width="4" stroke-linecap="round"/>`+
    `<path d="M62 95 L67 89 L64 96 L69 96 L60 104 L62 98 L58 98 Z" fill="#FFFFFF" opacity="0.85"/>`+
    '</g>';
}
export function petLayers(pet:Appearance['pet'],frame=0):string {
  if(pet==='none')return '';
  const hop=Math.abs(Math.sin(frame/8*Math.PI*2))*2;
  const step=Math.cos(frame/8*Math.PI*2)*3;
  const legs=[{x:29,y:48,end:26-step,far:true},{x:53,y:49,end:57+step,far:true},
    {x:36,y:51,end:34+step,far:false},{x:62,y:50,end:66-step,far:false}].map((leg,i)=>
    `<g data-limb="pet-leg-${i+1}"><path d="M${leg.x} ${leg.y} L${leg.end} ${leg.far?66:69}" fill="none" stroke="${leg.far?'#64606A':'#343239'}" stroke-width="5.5" stroke-linecap="round"/>`+
    `<ellipse cx="${leg.end+1}" cy="${leg.far?66:69}" rx="3.5" ry="2.4" fill="${leg.far?'#64606A':'#343239'}"/></g>`).join('');
  if(pet==='dog')return `<g data-layer="pet-dog" transform="translate(0 ${-hop})">`+
    path('M24 43 Q9 42 10 28 Q16 28 19 36 L30 36','#E6AE68')+legs+
    `<ellipse cx="42" cy="46" rx="24" ry="18" fill="#E6AE68" ${stroke}/>`+
    path('M50 27 Q50 10 65 11 Q83 9 86 28 L91 34 Q92 41 81 42 Q75 53 61 47 Z','#E6AE68')+
    path('M52 15 Q41 12 43 32 Q49 43 56 33 L60 17 Z','#A86C44')+
    '<ellipse cx="78" cy="35" rx="12" ry="9" fill="#FBE4BA"/><circle cx="73" cy="25" r="3" fill="#343239"/><ellipse cx="87" cy="32" rx="4" ry="3" fill="#343239"/>'+
    '<path d="M74 40 Q79 44 83 40" fill="none" stroke="#343239" stroke-width="1.7"/>'+
    '<path d="M57 44 L78 44" stroke="#57B9B9" stroke-width="5"/><circle cx="70" cy="48" r="3" fill="#FFD05E"/></g>';
  if(pet==='cat')return `<g data-layer="pet-cat" transform="translate(0 ${-hop})">`+
    path('M24 47 Q4 48 9 28 Q12 20 17 25 Q12 39 28 37','#A8ABBF')+legs+
    `<ellipse cx="43" cy="46" rx="23" ry="18" fill="#A8ABBF" ${stroke}/>`+
    path('M50 29 L50 8 L63 18 L76 16 L88 8 L87 33 Q87 48 69 48 Q51 47 50 29 Z','#A8ABBF')+
    '<path d="M54 15 L55 26 L62 21 M82 15 L75 22 L83 25" fill="#DFA6A6"/>'+
    '<path d="M60 29 L64 30 M76 29 L80 28" stroke="#343239" stroke-width="3" stroke-linecap="round"/><path d="M68 35 L73 35 L70 38 Z" fill="#B96570"/>'+
    '<path d="M70 38 Q66 42 63 39 M70 38 Q74 42 78 39 M54 35 L44 33 M55 39 L45 41 M83 35 L94 33 M83 39 L94 41" fill="none" stroke="#343239" stroke-width="1.3"/>'+
    '<path d="M35 34 L38 41 M46 32 L47 40" stroke="#747991" stroke-width="4" stroke-linecap="round"/></g>';
  return `<g data-layer="pet-rabbit" transform="translate(0 ${-hop*2})">`+
    '<circle cx="23" cy="45" r="10" fill="#FFFFFF" stroke="#343239" stroke-width="2"/>'+legs+
    `<ellipse cx="45" cy="47" rx="24" ry="19" fill="#F5E7D4" ${stroke}/>`+
    `<ellipse cx="61" cy="16" rx="7" ry="20" transform="rotate(-12 61 16)" fill="#F5E7D4" ${stroke}/>`+
    `<ellipse cx="76" cy="14" rx="7" ry="21" transform="rotate(9 76 14)" fill="#F5E7D4" ${stroke}/>`+
    '<path d="M60 2 L62 24 M77 0 L75 24" stroke="#E6ADAE" stroke-width="5" stroke-linecap="round"/>'+
    `<ellipse cx="70" cy="36" rx="19" ry="17" fill="#F5E7D4" ${stroke}/>`+
    '<circle cx="72" cy="31" r="2.8" fill="#343239"/><path d="M82 37 L87 37 L84 40 Z" fill="#D58D96"/><path d="M82 43 Q78 45 76 41" fill="none" stroke="#343239" stroke-width="1.5"/></g>';
}
const bush=(x:number,y:number,scale:number)=>`<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-21 0 Q-34 -16 -18 -21 Q-22 -41 -5 -37 Q4 -58 16 -39 Q37 -43 32 -22 Q50 -11 29 1 Z" fill="${sceneColors.tree}"/><path d="M-2 -21 L3 5 M3 -10 L18 -20" stroke="${sceneColors.trunk}" stroke-width="4" stroke-linecap="round"/></g>`;
export function trackSvg(a:Appearance,frame=0):string {
  const c=sceneColors;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 420" width="390" height="420">`+
    `<rect width="390" height="420" fill="${c.sky}"/>`+
    `<circle cx="321" cy="66" r="27" fill="#FFE9AF"/><path d="M27 87 Q19 73 35 71 Q38 49 57 59 Q73 46 81 65 Q101 62 101 78 Q113 90 97 93 H30 Z" fill="${c.cloud}"/>`+
    `<path d="M0 250 Q66 182 144 241 Q221 166 294 234 Q351 205 390 229 V305 H0 Z" fill="${c.farHill}"/>`+
    `<path d="M0 273 Q68 216 130 266 Q224 214 285 264 Q350 237 390 256 V303 H0 Z" fill="${c.hill}"/>`+
    bush(51,292,0.8)+bush(347,286,1.1)+bush(125,293,0.4)+
    `<path d="M0 295 Q103 286 210 295 T390 291 V420 H0 Z" fill="${c.edge}"/>`+
    `<path d="M0 309 Q105 300 214 310 T390 307 V399 Q255 392 144 401 T0 400 Z" fill="${c.track}"/>`+
    `<path d="M0 379 Q140 367 258 380 T390 377 V399 Q229 391 143 401 T0 400 Z" fill="${c.trackShade}"/>`+
    `<path d="M-10 323 Q123 315 220 324 T402 320 M-10 387 Q110 380 221 389 T402 386" fill="none" stroke="${c.lane}" stroke-width="3" stroke-dasharray="17 12"/>`+
    '<g fill="#DDB47C" opacity="0.7"><ellipse cx="37" cy="352" rx="3" ry="1.5"/><ellipse cx="112" cy="370" rx="2" ry="1.2"/><ellipse cx="338" cy="346" rx="3" ry="1.5"/><ellipse cx="251" cy="391" rx="2" ry="1"/></g>'+
    `<path d="M8 298 L15 286 L29 289 L34 298 Z" fill="${c.stone}" stroke="#87765F" stroke-width="1.5"/>`+
    '<ellipse cx="192" cy="369" rx="42" ry="7" fill="#94643B" opacity="0.17"/>'+
    (a.pet!=='none'?'<ellipse cx="298" cy="365" rx="30" ry="5" fill="#94643B" opacity="0.14"/>':'')+
    `<g transform="translate(124 159) scale(1.12)">${characterLayers(a,frame)}</g>`+
    `<g transform="translate(258 306) scale(0.8)">${petLayers(a.pet,frame)}</g>`+
    '</svg>';
}
export function portraitSvg(a:Appearance):string {return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="17 0 89 85" width="100" height="100">${characterLayers(a)}</svg>`;}
export function petSvg(pet:Appearance['pet']):string {return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -10 100 90" width="100" height="90">${petLayers(pet)}</svg>`;}
