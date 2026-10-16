import {defaultAppearance,hairstyles,eyeStyles,noseStyles,expressions,shirtStyles,genders} from './catalog';
import {portraitSvg,featureSvg,shirtSvg,genderSvg} from './artwork';

// Fixed catalog samples, generated once. Draft changes affect only the main track.
export const choiceArtwork={
  hair:Object.fromEntries(hairstyles.map(h=>[h.id,portraitSvg({...defaultAppearance,hair:h.id,gender:h.id==='ponytail'?'female':'male'})])),
  eyes:Object.fromEntries(eyeStyles.map(e=>[e.id,featureSvg({...defaultAppearance,eyes:e.id,expression:'calm'},'eyes')])),
  nose:Object.fromEntries(noseStyles.map(n=>[n.id,featureSvg({...defaultAppearance,nose:n.id,expression:'calm'},'nose')])),
  expression:Object.fromEntries(expressions.map(e=>[e.id,featureSvg({...defaultAppearance,expression:e.id},'expression')])),
  shirt:Object.fromEntries(shirtStyles.map(s=>[s.id,shirtSvg({...defaultAppearance,shirt:s.id,gender:s.id==='striped'?'female':'male'})])),
  gender:Object.fromEntries(genders.map(g=>[g.id,genderSvg({...defaultAppearance,gender:g.id})])),
};
