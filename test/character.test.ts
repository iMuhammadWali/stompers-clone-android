import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaultAppearance,parseAppearance,appearanceKey,hairstyles,skinTones,hairColors,outfits,pets,eyeStyles,noseStyles,expressions,shirtStyles,genders,isStyleAllowed} from '../src/lib/character/catalog';
import {trackSvg,portraitSvg,petSvg} from '../src/lib/character/artwork';

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
    const look={...defaultAppearance,hair:hair.id,skin:skin.id,hairColor:hairColor.id,outfit:outfit.id,pet:pet.id};
    const xml=trackSvg(look);
    assert.ok(xml.includes('data-layer="character"'));
    assert.equal(xml.includes('data-layer="pet-'),pet.id!=='none');
    assert.ok(xml.includes(skin.color)&&xml.includes(outfit.color));
    assert.doesNotMatch(xml,/undefined|NaN|<image|<script|href=/);
  }
  assert.ok(portraitSvg(defaultAppearance).includes('viewBox="17 0 89 85"'));
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
    for(const pet of ['dog','cat','rabbit'] as const){
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
  for(const [key,catalog] of Object.entries({eyes:eyeStyles,nose:noseStyles,expression:expressions,shirt:shirtStyles,gender:genders})){
    const results=catalog.map(option=>trackSvg({...defaultAppearance,[key]:option.id,...(key==='shirt'?{gender:option.id==='striped'?'female' as const:option.id==='raglan'?'male' as const:'nonbinary' as const}: {})}));
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
  assert.equal(parseAppearance('{"gender":"female","hair":"crop","shirt":"raglan"}').hair,'waves');
  assert.equal(parseAppearance('{"gender":"female","hair":"crop","shirt":"raglan"}').shirt,'tee');
  assert.equal(parseAppearance('{"gender":"male","hair":"ponytail","shirt":"striped"}').hair,'waves');
  assert.equal(parseAppearance('{"gender":"male","hair":"ponytail","shirt":"striped"}').shirt,'tee');
  assert.equal(parseAppearance('{"gender":"female","hair":"ponytail","shirt":"striped"}').shirt,'striped');
  assert.equal(parseAppearance('{"gender":"male","hair":"crop","shirt":"raglan"}').hair,'crop');
  assert.equal(parseAppearance('{"nose":"button"}').nose,'dot');
  assert.equal(parseAppearance('{"nose":"straight"}').nose,'wedge');
  assert.equal(parseAppearance('{"nose":"rounded"}').nose,'curve');
});
