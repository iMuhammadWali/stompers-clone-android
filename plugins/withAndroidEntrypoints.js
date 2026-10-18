const {withDangerousMod}=require('@expo/config-plugins');
const fs=require('node:fs/promises');
const path=require('node:path');

// Some Expo 58 template/prebuild combinations retain com.helloworld entry points
// alongside the correctly renamed app. Neutralize only that exact generated placeholder,
// and only after verifying that a canonical replacement exists for both classes.
async function removeTemplateEntrypoints(javaRoot,packageName) {
  const canonical=path.join(javaRoot,...packageName.split('.'));
  const names=['MainActivity.kt','MainApplication.kt'];
  for(const name of names){
    const text=await fs.readFile(path.join(canonical,name),'utf8');
    if(text.match(/^\s*package\s+([\w.]+)\s*;?\s*$/m)?.[1]!==packageName)throw new Error(`Invalid canonical Android entry point: ${name}`);
  }
  async function visit(directory){
    for(const entry of await fs.readdir(directory,{withFileTypes:true})){
      const file=path.join(directory,entry.name);
      if(entry.isDirectory())await visit(file);
      else if(names.includes(entry.name)&&path.dirname(file)!==canonical){
        const text=await fs.readFile(file,'utf8');
        if(/^package com\.helloworld\s*(?:\r?\n|;)/.test(text))await fs.writeFile(file,`// Stale Expo template entry point. Canonical replacement: ${packageName}.${entry.name.replace('.kt','')}\n`);
      }
    }
  }
  await visit(javaRoot);
}
module.exports=config=>withDangerousMod(config,['android',async c=>{
  await removeTemplateEntrypoints(path.join(c.modRequest.platformProjectRoot,'app/src/main/java'),c.android.package);
  return c;
}]);
module.exports.removeTemplateEntrypoints=removeTemplateEntrypoints;
