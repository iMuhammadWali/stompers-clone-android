import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
const {removeTemplateEntrypoints}=createRequire(import.meta.url)('../plugins/withAndroidEntrypoints.js');
test('prebuild neutralizes duplicate placeholder entry points while retaining canonical and unrelated sources',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'stride-entries-'));
 try{
  const canonical=path.join(root,'com/walkingclub/stride'),stale=path.join(root,'com/stride'),other=path.join(root,'com/other');
  await Promise.all([canonical,stale,other].map(p=>mkdir(p,{recursive:true})));
  for(const name of ['MainActivity.kt','MainApplication.kt']){
   await writeFile(path.join(canonical,name),'package com.walkingclub.stride\nclass Entry');
   await writeFile(path.join(stale,name),'package com.helloworld\nclass Placeholder');
   await writeFile(path.join(other,name),'package com.other\nclass Intentional');
  }
  await removeTemplateEntrypoints(root,'com.walkingclub.stride');
  for(const name of ['MainActivity.kt','MainApplication.kt']){
   const cleared=await readFile(path.join(stale,name),'utf8');assert.doesNotMatch(cleared,/class Placeholder|package com\.helloworld/);assert.match(cleared,/Canonical replacement/);
   assert.match(await readFile(path.join(canonical,name),'utf8'),/walkingclub/);
   assert.match(await readFile(path.join(other,name),'utf8'),/Intentional/);
  }
  await removeTemplateEntrypoints(root,'com.walkingclub.stride');
 }finally{await rm(root,{recursive:true,force:true});}
});
test('prebuild refuses cleanup without verified canonical replacements',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'stride-entries-'));
 try{
  const stale=path.join(root,'com/stride');await mkdir(stale,{recursive:true});
  const file=path.join(stale,'MainActivity.kt');await writeFile(file,'package com.helloworld\nclass Placeholder');
  await assert.rejects(removeTemplateEntrypoints(root,'com.walkingclub.stride'));
  assert.match(await readFile(file,'utf8'),/Placeholder/);
 }finally{await rm(root,{recursive:true,force:true});}
});
