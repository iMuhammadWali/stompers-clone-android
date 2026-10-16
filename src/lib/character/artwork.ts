import {hairColors,skinTones,outfits,type Appearance,parseAppearance} from './catalog';
// Original layered SVG artwork. Coordinates share one rig; no downloaded game assets.
export const sceneColors={sky:'#F5F6F8',cloud:'#FFFFFF',farHill:'#ECE9DF',hill:'#DEE7CD',grass:'#8AA966',tree:'#557A50',trunk:'#876448',edge:'#F58A42',track:'#FFE0A0',trackShade:'#F7C979',lane:'#FFF5D5',stone:'#BAA187',ink:'#343239'};
const stroke='stroke="#343239" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"';
const path=(d:string,fill:string)=>`<path d="${d}" fill="${fill}" ${stroke}/>`;
const limb=(d:string,color:string)=>`<path d="${d}" fill="none" stroke="#343239" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`;
/** Facial choices are independent of gender, skin, hair, and clothes. */
export function faceFeatures(a:Appearance):string {
  const surprised=a.expression==='surprised';
  const normalEyes='<ellipse cx="71" cy="44" rx="5" ry="6" fill="#FFFFFF"/><ellipse cx="84" cy="44" rx="3.4" ry="5" fill="#FFFFFF"/><ellipse cx="73" cy="45" rx="2.2" ry="3.1" fill="#343239"/><ellipse cx="85" cy="45" rx="1.8" ry="2.8" fill="#343239"/>';
  const eyes={
    round:normalEyes,
    almond:'<path d="M65 44 Q71 35 77 43 Q72 51 65 44 M80 43 Q84 36 88 43 Q84 49 80 43" fill="#FFFFFF" stroke="#343239" stroke-width="1"/><ellipse cx="73" cy="43" rx="2" ry="3" fill="#343239"/><ellipse cx="85" cy="43" rx="1.5" ry="2.6" fill="#343239"/>',
    relaxed:'<path d="M66 42 Q72 39 77 42 L77 46 Q71 50 66 46 Z M81 42 Q85 39 88 42 L88 46 Q84 48 81 45 Z" fill="#FFFFFF"/><path d="M66 42 L77 42 M81 42 L88 42" stroke="#343239" stroke-width="1.7"/><ellipse cx="73" cy="44" rx="2" ry="2.5" fill="#343239"/><ellipse cx="85" cy="44" rx="1.5" ry="2.3" fill="#343239"/>',
    sparkle:normalEyes+'<circle cx="72.2" cy="43.2" r="1.2" fill="#FFFFFF"/><circle cx="84.4" cy="43.2" r="0.9" fill="#FFFFFF"/><circle cx="74" cy="46.5" r="0.6" fill="#FFFFFF"/>',
  };
  const brows={smile:'M66 35 Q71 32 76 35 M81 35 L86 36',grin:'M65 35 Q71 30 77 34 M80 34 Q84 31 88 34',calm:'M66 35 L76 35 M81 35 L87 35',determined:'M66 34 L77 38 M81 38 L88 34',surprised:'M65 32 Q71 27 77 31 M81 31 Q85 27 89 31'};
  const mouths={
    smile:'<path d="M76 62 Q81 67 86 61" fill="none" stroke="#343239" stroke-width="2" stroke-linecap="round"/>',
    grin:'<path d="M73 59 Q80 62 88 58 Q88 69 81 69 Q75 68 73 59 Z" fill="#63363E" stroke="#343239" stroke-width="1.5"/><path d="M75 60 Q81 63 86 60 L85 63 Q80 65 76 63 Z" fill="#FFFFFF"/>',
    calm:'<path d="M77 63 L85 63" stroke="#343239" stroke-width="1.7" stroke-linecap="round"/>',
    determined:'<path d="M76 64 Q81 61 86 63" fill="none" stroke="#343239" stroke-width="2" stroke-linecap="round"/>',
    surprised:'<ellipse cx="81" cy="64" rx="3.2" ry="4.5" fill="#63363E" stroke="#343239" stroke-width="1.4"/>',
  };
  const noseShade=skinTones.find(s=>s.id===a.skin)!.shade;
  // Facial marks sit inside a smooth cheek; no projecting zig-zag in the outline.
  const noseMarks={
    dot:'<path d="M80 52 L82 53 L80 54 L79 53 Z" fill="#343239" opacity="0.7"/>',
    curve:`<ellipse cx="81" cy="53.5" rx="2.7" ry="2" fill="${noseShade}" opacity="0.55"/><path d="M79.5 54.2 Q81 55.2 82.7 54" fill="none" stroke="#343239" stroke-width="0.8" opacity="0.4" stroke-linecap="round"/>`,
    wedge:'<path d="M80 49.5 Q78.5 52 79.5 54 Q80.5 55 82.5 54" fill="none" stroke="#343239" stroke-width="1.1" opacity="0.55" stroke-linecap="round"/>',
  };
  const glasses=a.eyewear==='sunglasses'?`<g data-eyewear="sunglasses"><path d="M49 38 L66 41" stroke="#343239" stroke-width="2.4" stroke-linecap="round"/><path d="M65 39 Q70 37 77 39 L77 46 Q72 51 67 47 Z M81 39 Q85 37 89 39 L89 45 Q86 49 82 46 Z" fill="#39465A" stroke="#343239" stroke-width="1.6" stroke-linejoin="round"/><path d="M77 41 Q79 39 81 41" fill="none" stroke="#343239" stroke-width="1.8"/><path d="M68 40 L72 39 M83 40 L85 39" stroke="#A9DFE7" stroke-width="1.2" stroke-linecap="round"/></g>`:'';
  return `<g data-face="${a.eyes}-${a.nose}-${a.expression}"><g transform="${surprised?'translate(-5 -4) scale(1.07)':'translate(0 0)'}">${a.eyewear==='sunglasses'?'':eyes[a.eyes]}</g><path d="${brows[a.expression]}" fill="none" stroke="#343239" stroke-width="1.8" stroke-linecap="round"/>${noseMarks[a.nose]}${mouths[a.expression]}${glasses}</g>`;
}
export function characterLayers(value:Appearance,frame=0):string {
  const a=parseAppearance(JSON.stringify(value));
  const skin=skinTones.find(x=>x.id===a.skin)!;
  const hair=hairColors.find(x=>x.id===a.hairColor)!;
  const outfit=outfits.find(x=>x.id===a.outfit)!;
  // Contact → down → passing → up → opposite contact. Frame zero is a readable stride.
  const angle=((frame%8+8)%8)/8*Math.PI*2;
  const swing=Math.cos(angle),passing=Math.sin(angle);
  const frontLift=Math.max(0,passing)*14,backLift=Math.max(0,-passing)*14;
  const backX=60-swing*19,backY=171-backLift;
  const frontX=60+swing*19,frontY=171-frontLift;
  const backLeg=`M51 123 Q${54-swing*8} ${148-backLift*1.3} ${backX} ${backY}`;
  const frontLeg=`M68 123 Q${65+swing*8} ${148-frontLift*1.3} ${frontX} ${frontY}`;
  const shoe=(x:number,y:number)=>`M${x-5} ${y-3} L${x+5} ${y-3} L${x+13} ${y+5} Q${x+15} ${y+10} ${x+6} ${y+10} L${x-10} ${y+10} Q${x-13} ${y+7} ${x-8} ${y+2} Z`;
  const backShoe=shoe(backX,backY),frontShoe=shoe(frontX,frontY);
  const farHand={x:78+swing*23,y:116-Math.max(swing,0)*19};
  const nearHand={x:43-swing*21,y:120-Math.max(-swing,0)*12};
  const arm=(shoulderX:number,elbowX:number,hand:{x:number;y:number},color:string,name:string)=>{
    // Cuff and wrist share the forearm direction; no vertical hook above the hand.
    const dx=hand.x-elbowX,dy=hand.y-103,length=Math.hypot(dx,dy);
    const ux=dx/length,uy=dy/length;
    const wrist={x:hand.x-ux*4,y:hand.y-uy*4};
    const cuff={x:hand.x-ux*9,y:hand.y-uy*9};
    const sleeve=a.shirt==='hoodie'?`M${shoulderX} 85 L${elbowX} 103 L${cuff.x} ${cuff.y}`:`M${shoulderX} 85 L${shoulderX+(elbowX-shoulderX)*0.4} 92`;
    const handAngle=Math.atan2(dy,dx)*180/Math.PI-90;
    return `<g data-limb="${name}">`+
      `<path d="M${shoulderX} 85 L${elbowX} 103 L${wrist.x} ${wrist.y}" fill="none" stroke="#343239" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`+
      `<path d="M${shoulderX} 85 L${elbowX} 103 L${wrist.x} ${wrist.y}" fill="none" stroke="${color}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/>`+
      `<g data-clothing="${name}-sleeve"><path d="${sleeve}" fill="none" stroke="#343239" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="${sleeve}" fill="none" stroke="${a.shirt==='raglan'?outfit.shade:outfit.color}" stroke-width="12.5" stroke-linecap="round" stroke-linejoin="round"/></g>`+
      `<g data-limb="${name}-hand" transform="translate(${hand.x} ${hand.y}) rotate(${handAngle})"><ellipse cx="0" cy="0" rx="5.5" ry="6.5" fill="${color}" ${stroke}/>`+
      `<path d="M3 -3 Q6 -4 5 0" fill="none" stroke="#343239" stroke-width="1.3" stroke-linecap="round"/></g></g>`;
  };
  const cheek='L88 45 Q91 54 86 63';
  const jaw=a.gender==='male'?'Q84 73 70 75 L54 71 Q41 66 36 58':'Q85 70 69 74 Q45 75 36 58';
  const shirtBody=a.gender==='female'?'M49 70 Q58 77 71 70 L82 79 L82 96 L76 95 Q71 104 77 115 Q60 122 40 113 Q46 104 42 96 L35 93 L36 80 Z':'M49 70 Q58 77 71 70 L84 79 L84 96 L77 95 L78 115 Q60 122 39 113 L41 96 L34 93 L35 80 Z';
  const shirtClip=`shirt-${a.gender}-${a.shirt}-${a.outfit}`;
  const shirtDetail=a.shirt==='striped'?'<path d="M30 87 Q59 93 90 87 L90 92 Q59 98 30 92 Z M30 99 Q59 105 90 99 L90 104 Q59 110 30 104 Z" fill="#FFF8E8"/>':a.shirt==='hoodie'?`<path d="M54 80 L53 94 M67 80 L69 93" fill="none" stroke="#FFF8E8" stroke-width="1.5" stroke-linecap="round"/><path d="M52 103 Q61 99 70 103 L71 110 Q61 113 50 109 Z" fill="${outfit.shade}" opacity="0.55"/><path d="M52 103 L51 107 M69 103 L70 107" stroke="${outfit.shade}" stroke-width="1.2"/>`:a.shirt==='raglan'?`<path d="M49 75 Q47 86 42 94 M71 75 Q75 85 78 94" stroke="${outfit.shade}" stroke-width="1.2" fill="none"/>`:'';
  const garmentDetails=`<defs><clipPath id="${shirtClip}"><path d="${shirtBody}"/></clipPath></defs><g data-shirt-detail="${a.shirt}" clip-path="url(#${shirtClip})">${shirtDetail}<path d="M72 76 Q72 98 77 118 L85 118 V76 Z" fill="${outfit.shade}" opacity="0.25"/><path d="M42 111 Q59 118 77 113" stroke="${outfit.shade}" stroke-width="1.2" fill="none"/></g><path d="${shirtBody}" fill="none" ${stroke}/>`;
  const hairShapes={
    crop:'M34 45 Q24 19 43 13 Q65 1 84 20 L88 35 Q71 35 63 26 Q50 42 34 45 Z',
    waves:'M32 48 Q23 38 29 28 Q22 17 38 15 Q37 3 51 8 Q64 -1 73 12 Q87 6 90 23 Q99 32 87 41 L78 30 Q67 35 59 24 Q50 43 36 40 Z',
    curls:'M32 49 Q22 44 26 34 Q17 23 30 18 Q26 6 41 8 Q45 -4 57 5 Q69 -2 77 9 Q93 6 92 21 Q104 30 92 39 L83 41 Q76 29 66 31 Q55 42 46 33 L38 49 Z',
    quiff:'M32 47 Q25 34 31 24 Q20 15 37 10 Q52 -5 67 5 Q76 -3 86 9 Q96 23 87 36 Q76 33 66 24 Q49 40 35 41 Z',
    sidepart:'M32 47 L28 30 Q28 12 49 10 Q72 4 88 23 L89 36 L80 33 L64 23 Q49 35 35 37 Z',
    spikes:'M32 47 L27 30 L23 19 L35 21 L36 7 L49 15 L57 1 L66 13 L80 5 L82 20 L93 20 L88 38 L77 34 L64 26 L42 39 L35 39 Z',
    bob:'M31 48 Q21 34 32 19 Q47 5 66 10 Q87 11 91 32 L88 47 L79 36 L66 24 Q48 43 35 43 Z',
    bun:'M31 48 Q23 35 31 22 Q45 7 65 12 Q85 14 89 34 L80 39 Q63 34 58 23 Q46 38 35 43 Z',
    braids:'M31 48 Q23 34 33 19 Q49 5 67 11 Q86 13 90 34 L82 39 Q70 29 62 23 Q49 39 35 43 Z',
    longwaves:'M31 49 Q20 33 32 18 Q49 2 69 12 Q89 13 92 35 L82 43 Q67 33 61 22 Q50 41 35 44 Z',
    ringlets:'M31 49 Q22 45 26 35 Q18 27 28 21 Q24 10 37 11 Q41 0 53 7 Q64 0 74 11 Q89 7 92 21 Q101 30 90 39 L83 43 Q75 31 67 32 Q53 42 45 32 L36 48 Z',
    ponytail:'M32 49 Q22 34 32 19 Q48 0 70 10 Q90 12 91 35 L80 39 Q66 28 62 23 Q51 41 37 43 Z',
  };
  const backHair={
    ponytail:path('M32 25 Q8 14 9 38 Q2 61 20 66 Q13 42 33 42 Z',hair.color),
    bob:path('M34 23 Q21 34 25 57 L23 74 Q35 81 48 74 L80 74 L91 67 L87 33 Z',hair.color),
    bun:path('M34 30 Q18 27 20 15 Q21 3 33 4 Q46 4 46 18 Z',hair.color),
    braids:path('M31 35 Q20 41 25 52 Q18 59 24 67 Q19 76 27 84 L34 81 Q29 73 34 66 Q29 59 35 52 L39 35 Z',hair.color)+path('M83 34 Q97 41 91 52 Q99 59 93 67 Q99 77 91 84 L84 80 Q89 72 83 66 Q89 59 83 52 L77 35 Z',hair.color)+'<path d="M25 78 L33 78 M85 78 L93 78" stroke="#FFD05E" stroke-width="3" stroke-linecap="round"/>',
    longwaves:path('M36 18 Q18 31 26 49 Q18 59 25 68 Q18 80 30 87 Q39 90 47 79 L76 78 Q91 87 97 75 Q90 64 94 51 Q95 28 78 18 Z',hair.color),
    ringlets:path('M35 18 Q20 20 23 34 Q14 42 23 51 Q16 61 24 68 Q17 80 31 82 Q40 88 47 76 L78 75 Q91 82 96 70 Q101 61 92 54 Q102 45 92 37 Q97 23 81 19 Z',hair.color),
  } as Partial<Record<Appearance['hair'],string>>;
  const shinePaths:Partial<Record<Appearance['hair'],string>>={quiff:'M37 17 Q52 5 68 12',sidepart:'M36 23 Q48 13 62 15',spikes:'M38 25 L48 21 L56 15',bun:'M29 12 Q35 9 39 15',braids:'M38 23 Q48 15 60 17',longwaves:'M35 24 Q47 13 59 15'};
  return `<g data-layer="character" data-gender="${a.gender}" data-shirt="${a.shirt}" transform="translate(0 0)">`+
    (backHair[a.hair]??'')+
    `<g data-limb="far-leg">${limb(backLeg,skin.shade)}<g transform="rotate(${Math.max(swing,0)*16} ${backX+12} ${backY+9})">${path(backShoe,'#E1E1DD')}</g></g>`+
    arm(78,83+swing*5,farHand,skin.shade,'far-arm')+
    `<g data-limb="near-leg">${limb(frontLeg,skin.color)}<g transform="rotate(${-Math.max(swing,0)*7} ${frontX-10} ${frontY+9})">${path(frontShoe,'#F7F6F1')}</g></g>`+
    `<g data-clothing="shorts">${path('M44 107 L74 107 L81 133 L65 138 L59 125 L53 138 L36 131 Z',outfit.shorts)}</g>`+
    path('M50 61 L51 77 L69 78 L69 60 Z',skin.shade)+
    (a.shirt==='hoodie'?path('M43 78 Q32 60 49 61 L71 61 Q90 63 82 81 L72 83 Z',outfit.shade):'')+
    path(shirtBody,outfit.color)+
    garmentDetails+
    '<path d="M48 73 Q58 82 72 74" fill="none" stroke="#343239" stroke-width="2.1"/>'+
    arm(43,42-swing*15,nearHand,skin.color,'near-arm')+
    path(`M34 34 Q39 15 61 17 Q84 17 88 38 ${cheek} ${jaw} Q25 59 26 49 Q27 42 34 45 Z`,skin.color)+
    `<path d="M36 50 Q31 46 31 53" fill="none" stroke="${skin.shade}" stroke-width="2.2"/>`+
    faceFeatures(a)+
    path(hairShapes[a.hair],hair.color)+
    `<path d="${shinePaths[a.hair]??'M37 22 Q49 12 62 15'}" fill="none" stroke="${hair.shine}" stroke-width="4" stroke-linecap="round"/>`+

    '</g>';
}
export function petLayers(pet:Appearance['pet'],frame=0):string {
  if(pet==='none')return '';
  const hop=Math.abs(Math.sin(frame/8*Math.PI*2))*2;
  const step=Math.cos(frame/8*Math.PI*2)*3;
  const legs=[{x:29,y:48,end:26-step,far:true},{x:53,y:49,end:52+step,far:true},
    {x:36,y:51,end:34+step,far:false},{x:62,y:50,end:70-step,far:false}].map((leg,i)=>
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
  if(pet==='rabbit')return `<g data-layer="pet-rabbit" transform="translate(0 ${-hop*2})">`+
    '<circle cx="23" cy="45" r="10" fill="#FFFFFF" stroke="#343239" stroke-width="2"/>'+legs+
    `<ellipse cx="45" cy="47" rx="24" ry="19" fill="#F5E7D4" ${stroke}/>`+
    `<ellipse cx="61" cy="16" rx="7" ry="20" transform="rotate(-12 61 16)" fill="#F5E7D4" ${stroke}/>`+
    `<ellipse cx="76" cy="14" rx="7" ry="21" transform="rotate(9 76 14)" fill="#F5E7D4" ${stroke}/>`+
    '<path d="M60 2 L62 24 M77 0 L75 24" stroke="#E6ADAE" stroke-width="5" stroke-linecap="round"/>'+
    `<ellipse cx="70" cy="36" rx="19" ry="17" fill="#F5E7D4" ${stroke}/>`+
    '<circle cx="72" cy="31" r="2.8" fill="#343239"/><path d="M82 37 L87 37 L84 40 Z" fill="#D58D96"/><path d="M82 43 Q78 45 76 41" fill="none" stroke="#343239" stroke-width="1.5"/></g>';
  if(pet==='fox')return `<g data-layer="pet-fox" transform="translate(0 ${-hop})">`+
    path('M28 49 Q-2 43 10 13 Q31 20 35 43 Z','#D8793E')+
    '<path d="M10 15 Q10 31 21 34 L27 26 Q19 18 10 15 Z" fill="#FFF1D6"/>'+legs+
    `<ellipse cx="45" cy="47" rx="23" ry="17" fill="#E99A57" ${stroke}/>`+
    path('M52 30 L49 9 L64 19 L76 18 L88 9 L86 31 L94 37 Q83 51 67 48 Q54 45 52 30 Z','#E99A57')+
    '<path d="M53 28 Q62 32 68 42 Q77 31 89 30 L92 37 Q80 49 68 46 Q58 44 53 28 Z" fill="#FFF1D6"/>'+
    '<path d="M54 16 L56 25 L62 22 M83 16 L77 23 L84 25" fill="#8B4A3E"/><circle cx="65" cy="28" r="2.5" fill="#343239"/><circle cx="80" cy="28" r="2.2" fill="#343239"/><path d="M84 36 L91 36 L88 40 Z" fill="#343239"/><path d="M86 43 Q81 46 78 42" fill="none" stroke="#343239" stroke-width="1.4"/></g>';
  if(pet==='dragon')return `<g data-layer="pet-dragon" transform="translate(0 ${-hop})">`+
    path('M30 47 Q6 58 10 34 Q13 29 18 35 Q13 44 33 37 Z','#7CAA71')+
    path('M36 40 L23 13 L40 19 L47 10 L59 38 Z','#B9DCA4')+
    '<path d="M36 37 L40 19 M45 36 L47 13" stroke="#7CAA71" stroke-width="1.6"/>'+legs+
    `<ellipse cx="46" cy="47" rx="23" ry="17" fill="#A8CC82" ${stroke}/>`+
    path('M55 31 Q50 14 64 11 Q80 8 84 25 L94 28 Q101 36 88 42 Q78 51 65 45 Z','#A8CC82')+
    path('M59 13 L59 1 L68 12 M75 11 L81 1 L82 20','#FFE0A0')+
    '<ellipse cx="78" cy="37" rx="10" ry="7" fill="#DDEAB8"/><circle cx="73" cy="23" r="3" fill="#343239"/><circle cx="91" cy="31" r="1.5" fill="#557A50"/><path d="M78 41 Q84 45 88 40" fill="none" stroke="#343239" stroke-width="1.5"/><path d="M32 33 L38 28 L44 33" fill="#F1BF64"/></g>';
  return `<g data-layer="pet-spaceship" transform="translate(0 ${-4-hop})">`+
    path('M36 48 Q50 64 65 48 Z','#88BFC2')+
    path('M28 37 Q26 8 50 6 Q75 8 74 37 Z','#CFF2E5')+
    '<ellipse cx="51" cy="23" rx="10" ry="11" fill="#9BCB78"/><path d="M41 36 Q50 28 61 36" fill="#9BCB78"/><ellipse cx="47" cy="22" rx="2.1" ry="3.8" transform="rotate(-20 47 22)" fill="#343239"/><ellipse cx="55" cy="22" rx="2.1" ry="3.8" transform="rotate(20 55 22)" fill="#343239"/><path d="M48 29 Q51 31 54 29" fill="none" stroke="#557A50" stroke-width="1.3"/><path d="M34 25 Q34 17 41 13" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>'+
    `<ellipse cx="50" cy="42" rx="37" ry="11" fill="#B8CAD6" ${stroke}/>`+
    '<path d="M19 41 Q50 48 81 41" fill="none" stroke="#E5EDF1" stroke-width="2.3" stroke-linecap="round"/><ellipse cx="29" cy="46" rx="3" ry="2" fill="#FFD05E"/><ellipse cx="50" cy="49" rx="3" ry="2" fill="#FFD05E"/><ellipse cx="71" cy="46" rx="3" ry="2" fill="#FFD05E"/></g>';

}
const bush=(x:number,y:number,scale:number)=>`<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-21 0 Q-34 -16 -18 -21 Q-22 -41 -5 -37 Q4 -58 16 -39 Q37 -43 32 -22 Q50 -11 29 1 Z" fill="${sceneColors.tree}"/><path d="M-2 -21 L3 5 M3 -10 L18 -20" stroke="${sceneColors.trunk}" stroke-width="4" stroke-linecap="round"/></g>`;
export function trackSvg(a:Appearance,frame=0,steps?:number|null):string {
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
    (typeof steps==='number'&&Number.isSafeInteger(steps)&&steps>=0?`<g data-race-steps="${steps}"><rect x="145" y="129" width="99" height="27" rx="10" fill="#FFFFFF" stroke="#343239" stroke-width="2"/><path d="M188 156 L194 162 L199 156" fill="#FFFFFF" stroke="#343239" stroke-width="2"/><text x="194" y="147" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="12" fill="#343239">${steps.toLocaleString()} steps</text></g>`:'')+
    `<g transform="translate(124 166) scale(1.12)">${characterLayers(a,frame)}</g>`+
    `<g transform="translate(258 310) scale(0.8)">${petLayers(a.pet,frame)}</g>`+
    '</svg>';
}
export function portraitSvg(a:Appearance):string {return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -12 110 104" width="100" height="100">${characterLayers(a)}</svg>`;}
export function petSvg(pet:Appearance['pet']):string {return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -10 100 90" width="100" height="90">${petLayers(pet)}</svg>`;}

export function shirtSvg(a:Appearance):string {return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="24 67 70 65" width="100" height="90">${characterLayers(a)}</svg>`;}

export function featureSvg(value:Appearance,feature:'eyes'|'nose'|'expression'):string {
  const a=parseAppearance(JSON.stringify(value));
  const viewBox=feature==='eyes'?'61 28 32 25':feature==='nose'?'63 36 32 31':'51 26 46 50';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100" height="100">${characterLayers(a)}</svg>`;
}

/** Stable representative portraits make gender options distinguishable before selection. */
export function genderSvg(a:Appearance):string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -4 106 82" width="106" height="82">${characterLayers({...a,hair:a.gender==='female'?'ponytail':'crop',shirt:'tee',expression:'smile'})}</svg>`;
}
