const {withDangerousMod}=require('@expo/config-plugins');
const fs=require('node:fs/promises');
const path=require('node:path');
module.exports=function withFontLicense(config){
  return withDangerousMod(config,['android',async c=>{
    const destination=path.join(c.modRequest.platformProjectRoot,'app/src/main/assets');
    await fs.mkdir(destination,{recursive:true});
    await fs.copyFile(path.join(c.modRequest.projectRoot,'assets/fonts/OFL.txt'),path.join(destination,'LilitaOne-OFL.txt'));
    return c;
  }]);
};
