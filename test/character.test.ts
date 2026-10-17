import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaultAppearance,parseAppearance,appearanceKey,hairstyles,skinTones,hairColors,outfits,pets,eyeStyles,noseStyles,expressions,shirtStyles,genders,isStyleAllowed,eyewearStyles} from '../src/lib/character/catalog';
import {trackSvg,raceSvg,raceGeometry,portraitSvg,petSvg,characterLayers,faceFeatures} from '../src/lib/character/artwork';

test('stored appearance tolerates corrupt data and obsolete choices without losing valid choices',()=>{
  for(const raw of [null,'broken','null','[]','3'])assert.deepEqual(parseAppearance(raw),defaultAppearance);
  assert.deepEqual(parseAppearance('{"hair":"curls","outfit":"missing","pet":"cat","skin":"deep"}'),{...defaultAppearance,hair:'curls',pet:'cat',skin:'deep'});
});
test('account appearance keys isolate accounts and avoid unsupported storage characters',()=>{
  assert.notEqual(appearanceKey('a/b'),appearanceKey('a_b'));
  assert.notEqual(appearanceKey('demo-me'),appearanceKey('real-user'));
  assert.match(appearanceKey('user+test@example.com'),/^[a-zA-Z0-9._-]+$/);
});
test('all customization combinations produce grounded track layers without remote assets',()=>{
  for(const hair of hairstyles)for(const skin of skinTones)for(const hairColor of hairColors)for(const outfit of outfits)for(const pet of pets){
    const look={...defaultAppearance,hair:hair.id,gender:hair.gender,skin:skin.id,hairColor:hairColor.id,outfit:outfit.id,pet:pet.id};
    const xml=trackSvg(look);
    assert.ok(xml.includes('data-layer="character"'));
    assert.equal(xml.includes('data-layer="pet-'),pet.id!=='none');
    assert.ok(xml.includes(skin.color)&&xml.includes(outfit.color));
    assert.doesNotMatch(xml,/undefined|NaN|<image|<script|href=/);
  }
  assert.ok(portraitSvg(defaultAppearance).includes('data-layer="character"'));
  assert.ok(petSvg('dog').includes('pet-dog'));
});
test('walking preview changes character and companion poses',()=>{
  assert.notEqual(trackSvg(defaultAppearance,0),trackSvg(defaultAppearance,2));
  assert.notEqual(trackSvg(defaultAppearance,2),trackSvg(defaultAppearance,6));
});

test('each walk pose retains two complete arms, hands, and legs, and each pet has four legs',()=>{
  for(let frame=0;frame<8;frame++){
    const xml=trackSvg(defaultAppearance,frame);
    for(const name of ['far-leg','near-leg','far-arm','near-arm','far-arm-hand','near-arm-hand'])
      assert.equal(xml.split(`data-limb="${name}"`).length-1,1,`frame ${frame}: ${name}`);
    for(const pet of ['dog','cat','rabbit','fox','dragon'] as const){
      const petArt=trackSvg({...defaultAppearance,pet},frame);
      for(let leg=1;leg<=4;leg++)assert.equal(petArt.split(`data-limb="pet-leg-${leg}"`).length-1,1);
    }
  }
});

test('shorts cover both upper-leg layers in every pose instead of being erased by the near thigh',()=>{
  for(let frame=0;frame<8;frame++){
    const xml=trackSvg(defaultAppearance,frame),shorts=xml.indexOf('data-clothing="shorts"');
    assert.ok(shorts>xml.indexOf('data-limb="far-leg"'));
    assert.ok(shorts>xml.indexOf('data-limb="near-leg"'));
    assert.ok(xml.includes('data-clothing="near-arm-sleeve"'));
    assert.ok(xml.includes('data-clothing="far-arm-sleeve"'));
  }
});


test('legacy saved looks keep their old choices and receive defaults for new features',()=>{
  assert.deepEqual(parseAppearance('{"gender":"female","hair":"ponytail","skin":"deep","hairColor":"honey","outfit":"lilac","pet":"cat"}'),{...defaultAppearance,gender:'female',hair:'ponytail',skin:'deep',hairColor:'honey',outfit:'lilac',pet:'cat'});
  assert.equal(parseAppearance('{"eyes":"bad","shirt":"bad","gender":"bad"}').eyes,defaultAppearance.eyes);
});
test('every face, shirt, and gender option produces distinct artwork',()=>{
  for(const [key,catalog] of Object.entries({eyes:eyeStyles,eyewear:eyewearStyles,nose:noseStyles,expression:expressions,shirt:shirtStyles,gender:genders})){
    const results=catalog.map(option=>trackSvg({...defaultAppearance,[key]:option.id,...(key==='shirt'?{gender:option.id==='striped'?'female' as const:option.id==='raglan'?'male' as const:'male' as const}: {})}));
    assert.equal(new Set(results).size,catalog.length,key);
  }
});
test('allowed feature combinations retain facial choices and hands remain above sleeves',()=>{
  for(const eyes of eyeStyles)for(const nose of noseStyles)for(const expression of expressions)for(const shirt of shirtStyles)for(const gender of genders){
    if(!isStyleAllowed('shirt',shirt.id,gender.id))continue;
    const xml=trackSvg({...defaultAppearance,eyes:eyes.id,nose:nose.id,expression:expression.id,shirt:shirt.id,gender:gender.id});
    assert.doesNotMatch(xml,/undefined|NaN/);
    assert.ok(xml.includes(`data-face="${eyes.id}-${nose.id}-${expression.id}"`));
    assert.ok(xml.indexOf('data-limb="near-arm-hand"')>xml.indexOf('data-clothing="near-arm-sleeve"'));
    assert.ok(xml.indexOf('data-limb="far-arm-hand"')>xml.indexOf('data-clothing="far-arm-sleeve"'));
  }
});

test('eligibility rules apply to saved looks as well as the editor',()=>{
  assert.equal(parseAppearance('{"gender":"female","hair":"crop","shirt":"raglan"}').hair,'ponytail');
  assert.equal(parseAppearance('{"gender":"female","hair":"crop","shirt":"raglan"}').shirt,'tee');
  assert.equal(parseAppearance('{"gender":"male","hair":"ponytail","shirt":"striped"}').hair,'waves');
  assert.equal(parseAppearance('{"gender":"male","hair":"ponytail","shirt":"striped"}').shirt,'tee');
  assert.equal(parseAppearance('{"gender":"female","hair":"ponytail","shirt":"striped"}').shirt,'striped');
  assert.equal(parseAppearance('{"gender":"male","hair":"crop","shirt":"raglan"}').hair,'crop');
  assert.equal(parseAppearance('{"nose":"button"}').nose,'dot');
  assert.equal(parseAppearance('{"nose":"straight"}').nose,'wedge');
  assert.equal(parseAppearance('{"nose":"rounded"}').nose,'curve');
});

test('retired third gender migrates safely while preserving the saved look',()=>{
  assert.deepEqual(genders.map(g=>g.id),['male','female']);
  const base={gender:'nonbinary',hair:'curls',shirt:'hoodie',skin:'deep',pet:'rabbit'};
  assert.deepEqual(parseAppearance(JSON.stringify(base)),{...defaultAppearance,...base,gender:'male'});
  assert.equal(parseAppearance(JSON.stringify({...base,hair:'ponytail'})).gender,'female');
});

test('each gender has six unique eligible hairstyles and saved female waves/curls migrate correctly',()=>{
  const male=hairstyles.filter(h=>isStyleAllowed('hair',h.id,'male'));
  const female=hairstyles.filter(h=>isStyleAllowed('hair',h.id,'female'));
  assert.equal(male.length,6);assert.equal(female.length,6);
  assert.equal(male.some(m=>female.some(f=>f.id===m.id)),false);
  const samples=hairstyles.map(h=>characterLayers({...defaultAppearance,hair:h.id,gender:h.gender}));
  assert.equal(new Set(samples).size,12);
  assert.equal(parseAppearance('{"gender":"female","hair":"waves","skin":"deep"}').hair,'longwaves');
  assert.equal(parseAppearance('{"gender":"female","hair":"curls"}').hair,'ringlets');
  assert.equal(parseAppearance('{"gender":"female","hair":"waves","skin":"deep"}').skin,'deep');
  assert.equal(defaultAppearance.skin,'sand');
});
test('sunglasses are removable without changing selected eyes or expression and old looks receive no glasses',()=>{
  assert.equal(parseAppearance('{"eyes":"almond","expression":"grin"}').eyewear,'none');
  const look={...defaultAppearance,eyes:'almond' as const,expression:'grin' as const,eyewear:'sunglasses' as const};
  const saved=parseAppearance(JSON.stringify(look));assert.deepEqual(saved,look);
  assert.match(faceFeatures(saved),/data-eyewear="sunglasses"/);
  assert.doesNotMatch(faceFeatures({...saved,eyewear:'none'}),/data-eyewear="sunglasses"/);
});
test('new companions remain distinct, persist through validation, and spaceship hovers without animal legs',()=>{
  for(const pet of ['fox','dragon','spaceship'] as const){
    assert.equal(parseAppearance(JSON.stringify({...defaultAppearance,pet})).pet,pet);
    assert.match(petSvg(pet),new RegExp('data-layer="pet-'+pet+'"'));
    assert.doesNotMatch(petSvg(pet),/NaN|undefined/);
  }
  assert.doesNotMatch(petSvg('spaceship'),/data-limb="pet-leg/);
  assert.notEqual(trackSvg({...defaultAppearance,pet:'spaceship'},0),trackSvg({...defaultAppearance,pet:'spaceship'},2));
});

test('race stage keeps the whole rig above the floor in short and tall viewports',()=>{
  for(const size of [{width:360,height:210},{width:393,height:420},{width:600,height:210}]){
    const xml=raceSvg({...defaultAppearance,pet:'spaceship'},0,6142,size);
    assert.doesNotMatch(xml,/NaN|undefined|Infinity/);
    assert.match(xml,/data-layer="pet-spaceship"/);
    const h=Number(xml.match(/viewBox="0 0 390 ([\d.]+)"/)![1]);
    // The stage's rig transform is the one immediately before characterLayers.
    const transforms=[...xml.matchAll(/transform="translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)"/g)];
    const [, ,top,scale]=transforms[transforms.length-2];
    assert.ok(Number(top)>=0);
    assert.ok(Number(top)+185*Number(scale)<h);
    const geometry=raceGeometry(size);
    const footClearance=(geometry.height-geometry.y-185*geometry.scale)*size.width/390;
    assert.ok(footClearance>=106,'feet must remain above the fixed name label and rail');
  }
});
