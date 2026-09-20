import test from 'node:test';
import assert from 'node:assert/strict';
import {newBuild,ID} from '../scripts/rules.js';
const storage=new Map();
globalThis.localStorage={setItem:(k,v)=>storage.set(k,v),getItem:k=>storage.get(k),removeItem:k=>storage.delete(k)};
globalThis.foundry={applications:{api:{ApplicationV2:class {render(){return this;}close(){return this;}}}}};
globalThis.game={world:{id:'world'},user:{id:'user',isGM:true},packs:[]};
globalThis.ui={notifications:{warn(){},info(){}}};
const {CharacterCreator}=await import('../scripts/app.js');
test('draft preserves selected options and strips existing IDs when imported as new',()=>{
 const app=new CharacterCreator(),b=newBuild();b.entries=[{instance:'a',itemId:'old',definition:{id:'native:x',name:'Trait',type:'trait',item:{name:'Trait',type:'trait',system:{}}},sources:['legacy']}];
 app.loadDraft({format:ID,actorUuid:'Actor.old',build:b});assert.equal(app.build.entries[0].itemId,undefined);assert.equal(app.catalogue.some(d=>d.id==='native:x'),true);
});
test('Item import accepts native options and rejects Journal references',()=>{
 const app=new CharacterCreator();assert.equal(app.importItems([{name:'Rules',pages:[]}]),0);assert.equal(app.importItems([{_id:'p',name:'Power',type:'power',system:{powerSets:['basic'],description:'<p>Effect</p>'}}]),1);assert.equal(app.catalogue.at(-1).reviewed,false);assert.equal(app.catalogue.at(-1).description,'Effect');
});
test('package commands add grants and never mutate a live Actor',async()=>{
 const app=new CharacterCreator();await app.command('next',{dataset:{}});assert.equal(app.step,1);assert.equal(app.actor,null);assert(storage.has(app.draftKey));
});
test('rejects imports with another creator format',()=>{assert.throws(()=>new CharacterCreator().loadDraft({format:'wrong',build:newBuild()}),/not a creator draft/);});
test('renamed module accepts exported drafts from earlier prototype',()=>{
 const app=new CharacterCreator();app.loadDraft({format:'mvrpg-character-creator',build:newBuild()});assert.equal(app.build.schema,1);
});
