import test from 'node:test';
import assert from 'node:assert/strict';
import {ID,newBuild,clone,addEntry,ABILITIES} from '../scripts/rules.js';
import {STARTER} from '../scripts/catalogue.js';
import {fromActor,planChanges,commit,fingerprint} from '../scripts/adapter.js';
let n=0,created=[],failDelete=false;
function expand(flat){const out={};for(const [path,v]of Object.entries(flat)){let o=out;const parts=path.split('.');for(const k of parts.slice(0,-1))o=o[k]??={};o[parts.at(-1)]=clone(v);}return out;}
function merge(a,b){const out=clone(a);for(const [k,v] of Object.entries(b))out[k]=v&&typeof v==='object'&&!Array.isArray(v)?merge(out[k]??{},v):clone(v);return out;}
function fixture(){return {_id:'hero',name:'Example Hero',type:'super',img:'portrait.webp',folder:'original-folder',ownership:{default:0,player:3},flags:{other:{untouched:true}},prototypeToken:{width:2,height:2},effects:[{_id:'effect',name:'Custom bonus',changes:[]}],system:{rank:1,abilities:Object.fromEntries(ABILITIES.map(k=>[k,{value:k==='resilience'?2:k==='vigilance'?3:0,defenseBonus:1}])),identity:{codeName:'Example',realName:'Test',origin:'Custom',occupation:'Custom',notes:'Keep biography'},lifepool:{health:{value:33,max:60},focus:{value:44,max:90}},speed:{run:5,climb:3,swim:3,jump:3,flight:7},initiative:{value:3,edge:true},karma:0},items:[{_id:'custom',name:'Legacy Trait',type:'trait',system:{description:'Keep me'},effects:[]},{_id:'gear',name:'Equipment',type:'simpleItem',system:{description:'Keep gear'},effects:[]}]};}
class FakeActor {
 constructor(data){this.data=clone(data);this.id=data._id;this.uuid=`Actor.${this.id}`;this.isOwner=true;this.isToken=false;}
 get name(){return this.data.name;}get system(){return this.data.system;}toObject(){return clone(this.data);}
 async update(patch){this.data=merge(this.data,expand(patch));return this;}
 async setFlag(scope,key,value){this.data.flags[scope]??={};this.data.flags[scope][key]=clone(value);return this;}
 async createEmbeddedDocuments(type,items){return items.map(item=>{const i={...clone(item),_id:`i${++n}`};this.data.items.push(i);return {id:i._id};});}
 async deleteEmbeddedDocuments(type,ids){if(failDelete)throw new Error('Injected deletion failure');this.data.items=this.data.items.filter(i=>!ids.includes(i._id));}
}
function setup(){created=[];failDelete=false;globalThis.game={user:{id:'gm',isGM:true,can:()=>true},folders:[]};globalThis.foundry={utils:{expandObject:expand,mergeObject:merge,randomID:()=>`r${++n}`}};globalThis.Folder={create:async()=>({id:'recovery'})};globalThis.Actor={create:async(data)=>{const a=new FakeActor({...fixture(),...clone(data),_id:`a${++n}`});created.push(a);return a;}};}
function ready(actor){const b=fromActor(actor);b.acknowledge=true;return b;}
test('legacy no-change plan preserves unrelated fields, items and current resources',()=>{
 const a=new FakeActor(fixture()),b=fromActor(a),p=planChanges(b,a);
 assert.deepEqual(p.remove,[]);assert.deepEqual(p.add,[]);assert.equal(p.update['system.lifepool.health.value'],undefined);assert.equal(p.update['system.karma'],undefined);assert.equal(p.update['system.identity.notes'],undefined);assert.equal(p.update['system.speed.flight'],undefined);
});
test('new Actor writes native fields, stable Item IDs and build flags',async()=>{
 setup();const b=newBuild();b.abilities.resilience=2;b.abilities.vigilance=3;b.acknowledge=true;addEntry(b,STARTER.find(d=>d.name==='Inspiration'));
 const r=await commit(b,null,null);const d=r.actor.toObject();assert.equal(d.system.lifepool.health.value,60);assert.equal(d.system.lifepool.focus.max,90);assert.equal(d.items.length,1);assert.equal(d.flags[ID].build.entries[0].itemId,d.items[0]._id);
});
test('GM editing creates restricted recovery and preserves custom data',async()=>{
 setup();const a=new FakeActor(fixture()),b=ready(a);b.name='Renamed';const r=await commit(b,a,fingerprint(a));
 assert.equal(created.length,1);assert.deepEqual(r.backup.toObject().ownership,{default:0,gm:3});assert.equal(r.backup.toObject().system.lifepool.health.value,33);
 const d=a.toObject();assert.equal(d.name,'Renamed');assert.equal(d.system.identity.notes,'Keep biography');assert.equal(d.system.speed.flight,7);assert.equal(d.system.lifepool.health.value,33);assert.equal(d.system.karma,0);assert.equal(d.prototypeToken.width,2);assert.equal(d.effects[0]._id,'effect');assert.equal(d.flags.other.untouched,true);assert.equal(d.items.length,2);
});
test('stale baseline prevents any writes',async()=>{
 setup();const a=new FakeActor(fixture()),b=ready(a),base=fingerprint(a);a.data.system.karma=1;
 await assert.rejects(commit(b,a,base),/changed/);assert.equal(created.length,0);
});
test('non-GM cannot update existing Actor',async()=>{
 setup();game.user.isGM=false;const a=new FakeActor(fixture());await assert.rejects(commit(ready(a),a,fingerprint(a)),/GM-only/);assert.equal(created.length,0);
});
test('nonowner cannot copy another Actor',async()=>{
 setup();game.user.isGM=false;const a=new FakeActor(fixture());a.isOwner=false;await assert.rejects(commit(ready(a),a,fingerprint(a),{copy:true}),/do not own/);
});
test('creation permission is enforced',async()=>{setup();game.user.can=()=>false;await assert.rejects(commit(newBuild(),null,null),/cannot create/);});
test('unlinked token Actors rejected',async()=>{setup();const a=new FakeActor(fixture());a.isToken=true;await assert.rejects(commit(ready(a),a,fingerprint(a)),/unlinked token/);});
test('partial failure retains complete recovery copy',async()=>{
 setup();const a=new FakeActor(fixture()),b=ready(a);b.entries=[];failDelete=true;
 await assert.rejects(commit(b,a,fingerprint(a)),/save may be incomplete/);assert.equal(created[0].toObject().items.length,2);assert.equal(created[0].toObject().name.startsWith('[Recovery]'),true);
});
test('save as new leaves original unchanged and preserves existing current pools',async()=>{
 setup();const a=new FakeActor(fixture()),base=fingerprint(a),b=ready(a);b.name='Copy test';const r=await commit(b,a,base,{copy:true});
 assert.equal(fingerprint(a),base);assert.equal(r.actor.name,'Copy test (Copy)');assert.equal(r.actor.system.lifepool.health.value,33);assert.equal(r.backup,null);
});
test('GM exception cannot bypass hard creation limits',async()=>{
 setup();const b=newBuild();b.abilities.melee=10;b.acknowledge=true;await assert.rejects(commit(b,null,null),/melee/);b.override='Custom GM-approved cap and allocation';await assert.rejects(commit(b,null,null),/melee/);
});
test('ordinary players cannot use an imported GM override to bypass checks',async()=>{
 setup();game.user.isGM=false;const b=newBuild();b.abilities.melee=10;b.override='GM';b.acknowledge=true;await assert.rejects(commit(b,null,null),/melee/);
});
test('missing manual review acknowledgment blocks save',async()=>{setup();const b=newBuild();b.abilities.resilience=2;b.abilities.vigilance=3;await assert.rejects(commit(b,null,null),/Acknowledge/);});
test('invalid numeric data cannot be overridden',async()=>{setup();const b=newBuild();b.rank=NaN;b.override='exception';b.acknowledge=true;await assert.rejects(commit(b,null,null),/whole numbers/);});
test('renamed module reads earlier prototype build provenance',()=>{
 const raw=fixture();raw.flags['mvrpg-character-creator']={build:{schema:1,entries:[{itemId:'custom',instance:'legacy-instance',sources:['granted'],definition:{id:'old:trait',name:'Legacy Trait',type:'trait',item:raw.items[0]}}],exchanges:{abilities:1,traits:0}}};
 const b=fromActor(new FakeActor(raw));assert.equal(b.entries[0].instance,'legacy-instance');assert.deepEqual(b.entries[0].sources,['granted']);assert.equal(b.exchanges.abilities,1);
});
test('final save blocks unspent ability points even if UI navigation is bypassed',async()=>{
 setup();const b=newBuild();b.acknowledge=true;await assert.rejects(commit(b,null,null),/Spend all 5/);assert.equal(created.length,0);
});
test('Jeremy allocation writes positive starting Focus at Vigilance zero',async()=>{
 setup();const b=newBuild();b.abilities.melee=2;b.abilities.resilience=3;b.acknowledge=true;const r=await commit(b,null,null);
 assert.equal(r.actor.system.lifepool.focus.max,10);assert.equal(r.actor.system.lifepool.focus.value,10);assert.equal(r.actor.system.lifepool.health.max,90);
});

function storedFolder(id,flags={},type='Actor'){
 return {id,type,flags,getFlag(scope,key){
  if(scope!==ID)throw new Error(`Flag scope "${scope}" is not valid or not currently active`);
  return this.flags?.[scope]?.[key];
 }};
}
for(const legacy of [false,true])test(`editing with unrelated folders reuses ${legacy?'legacy':'current'} recovery folder without inactive flag lookups`,async()=>{
 setup();const scope=legacy?'mvrpg-character-creator':ID;
 game.folders=[storedFolder('ordinary'),storedFolder('recovery',{[scope]:{recovery:true}})];
 globalThis.Folder.create=async()=>{throw new Error('Should reuse existing recovery folder');};
 const a=new FakeActor(fixture()),b=ready(a);b.name='Edited hero';
 const r=await commit(b,a,fingerprint(a));
 assert.equal(a.name,'Edited hero');assert.equal(r.backup.toObject().folder,'recovery');
 assert.ok(a.toObject().flags[ID].build);
});
test('editing with ordinary folders creates a recovery folder under the active module scope',async()=>{
 setup();game.folders=[storedFolder('ordinary'),storedFolder('journal',{[ID]:{recovery:true}},'JournalEntry')];
 let folderData;
 globalThis.Folder.create=async data=>{folderData=clone(data);return {id:'new-recovery'};};
 const a=new FakeActor(fixture()),b=ready(a);b.name='Edited hero';
 const r=await commit(b,a,fingerprint(a));
 assert.deepEqual(folderData.flags,{[ID]:{recovery:true}});
 assert.equal(r.backup.toObject().folder,'new-recovery');assert.equal(a.name,'Edited hero');
});
