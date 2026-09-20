import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOGUE,STARTER,ORIGINS,OCCUPATIONS} from '../scripts/catalogue.js';
import {newBuild,addEntry,setPackage,evaluate,additionErrors,addAllowedEntry,removeAllowedEntry,selectionErrors,syncPackageBenefits,assignedPackages,ID} from '../scripts/rules.js';
import {validatePower,definition,upgradeChanges} from '../scripts/mechanics.js';
import {planChanges} from '../scripts/adapter.js';
import {renderView} from '../scripts/view.js';
const get=name=>CATALOGUE.find(d=>d.name===name),copy=d=>structuredClone(d);
function build(rank=6){const b=newBuild();b.rank=rank;return b;}
function grant(b,name){const d=get(name);for(const id of d.requires??[])if(!b.entries.some(e=>e.definition.id===id))grant(b,CATALOGUE.find(d=>d.id===id).name);return addEntry(b,d);}
test('core inventory includes every base entry plus explicit package specializations',()=>{
 const base=CATALOGUE.filter(d=>!d.baseId&&d.name!=='Connections: Super Heroes or Villains');
 assert.equal(base.filter(d=>d.type==='power').length,321);
 assert.equal(base.filter(d=>d.type==='trait').length,57);
 assert.equal(base.filter(d=>d.type==='tag').length,48);
 assert.equal(ORIGINS.filter(d=>d.id!=='custom').length,30);
 assert.equal(OCCUPATIONS.filter(d=>d.id!=='custom').length,18);
 assert.equal(new Set(CATALOGUE.map(d=>d.id)).size,CATALOGUE.length);
 for(const d of STARTER)assert.equal(CATALOGUE.find(x=>x.id===d.id),d);
});
test('all prerequisites and grant references resolve, and dependency chains are acyclic',()=>{
 const map=new Map(CATALOGUE.map(d=>[d.id,d]));
 function visit(id,path=[]){assert(map.has(id),id);assert(!path.includes(id),`Cycle ${id}`);const d=map.get(id);for(const r of [...d.requires??[],...(d.requiresAny??[]).flat()])visit(r,[...path,id]);}
 for(const d of CATALOGUE)visit(d.id);
 for(const pack of [...ORIGINS,...OCCUPATIONS])for(const id of [...pack.grants??[],...pack.requiredPowers??[],...(pack.requiredAny??[]).flat()])assert(map.has(id),`${pack.name}: ${id}`);
});
test('all numbered power chains require their preceding number',()=>{for(const d of CATALOGUE.filter(d=>d.type==='power')){const m=d.name.match(/^(.*) ([2-4])$/);if(!m)continue;const previous=get(`${m[1]} ${Number(m[2])-1}`);assert(previous);assert(d.requires.includes(previous.id),d.name);}});
test('every origin can resolve its automatic package at rank six without unknown grants',()=>{for(const p of ORIGINS.filter(p=>p.id!=='custom')){const b=build();setPackage(b,'originId',p.id,ORIGINS,CATALOGUE);assert.deepEqual(selectionErrors(b),[],p.name);assert.equal(evaluate(b).traits,0,p.name);}});
test('every occupation grants its labels without consuming discretionary traits',()=>{for(const p of OCCUPATIONS.filter(p=>p.id!=='custom')){const b=build(1);setPackage(b,'occupationId',p.id,OCCUPATIONS,CATALOGUE);assert.equal(evaluate(b).traits,0,p.name);assert.equal(b.entries.length,p.grants.length,p.name);}});
test('Skrull required powers are paid picks, and a low rank cannot retain them',()=>{const b=build(3);setPackage(b,'originId','alien-skrull',ORIGINS,CATALOGUE);assert.equal(evaluate(b).powerSpent,5);b.rank=1;assert(selectionErrors(b).some(e=>e.includes('rank 3')));});
test('origin swaps keep manually chosen benefits and remove obsolete package-only grants',()=>{const b=build();addEntry(b,get('Tech Reliance'));setPackage(b,'originId','high-tech',ORIGINS,CATALOGUE);setPackage(b,'originId','mutant',ORIGINS,CATALOGUE);assert(b.entries.some(e=>e.definition.name==='Tech Reliance'));assert(b.entries.some(e=>e.definition.name==='X-Gene'));setPackage(b,'originId','unknown',ORIGINS,CATALOGUE);assert(!b.entries.some(e=>e.definition.name==='X-Gene'));});
test('additional occupation applies and removes its own grants',()=>{const b=build();setPackage(b,'occupationId','engineer',OCCUPATIONS,CATALOGUE);const extra={...copy(get('Extra Occupation')),packageId:'lawyer',detail:'Lawyer'};const e=addAllowedEntry(b,extra);assert(b.entries.some(e=>e.definition.name==='Legal Eagle'));assert.equal(evaluate(b).traits,1);removeAllowedEntry(b,e.instance);assert(!b.entries.some(e=>e.definition.name==='Legal Eagle'));assert(b.entries.some(e=>e.definition.name==='Inventor'));});
test('additional origin releases Special Training restriction with explicit entitlement',()=>{const b=build(3);setPackage(b,'originId','special-training',ORIGINS,CATALOGUE);assert(additionErrors(b,get('Flight 1')).length);addAllowedEntry(b,{...copy(get('Extraordinary Origin')),packageId:'weird-science',detail:'Weird Science'});assert.equal(assignedPackages(b).filter(p=>p.kind==='origin').length,2);assert.deepEqual(additionErrors(b,get('Flight 1')),[]);});
test('Surprising Power is scoped to one power and never waives its power prerequisites',()=>{const b=build(1);addAllowedEntry(b,{...copy(get('Surprising Power')),surprisingPowerId:get('Flight 1').id,detail:'Flight 1'});assert.deepEqual(additionErrors(b,get('Flight 1')),[]);assert(additionErrors(b,get('Flight 2')).some(e=>e.includes('requires')));const b2=build(1);addEntry(b2,{...copy(get('Surprising Power')),surprisingPowerId:get('Flight 2').id,detail:'Flight 2'});assert(additionErrors(b2,get('Flight 2')).some(e=>e.includes('Flight 1')));});
test('Special Training honors the book list and numbered basic limit of two',()=>{const b=build(4);setPackage(b,'originId','special-training',ORIGINS,CATALOGUE);grant(b,'Accuracy 2');assert(!selectionErrors(b).length);assert(additionErrors(b,get('Accuracy 3')).some(e=>e.includes('Special Training')));assert(additionErrors(b,get('Wisecracker')).some(e=>e.includes('Special Training')));});
test('OR prerequisites accept either Grow 2 or Shrink 2',()=>{for(const choice of ['Grow 2','Shrink 2']){const b=build(3);grant(b,choice);assert.deepEqual(additionErrors(b,get('Resize Other')),[]);}assert(additionErrors(build(3),get('Resize Other')).some(e=>e.includes('Grow 2 or Shrink 2')));});
test('magic tags and origin-only labels are gated',()=>{const b=build(3);assert(additionErrors(b,get('Hex Bolt')).some(e=>e.includes('Chaotic')));setPackage(b,'originId','magic-chaos-magic',ORIGINS,CATALOGUE);assert.deepEqual(additionErrors(b,get('Hex Bolt')),[]);assert(additionErrors(b,get('X-Gene')).some(e=>e.includes('origin')));});
test('elemental choices enforce the Hellfire tag',()=>{const b=build(3),d={...copy(get('Elemental Burst')),detail:'Hellfire'};assert(additionErrors(b,d).some(e=>e.includes('Cursed')));addEntry(b,get('Cursed'));assert.deepEqual(additionErrors(b,d),[]);});
test('Pym origin requires a size power before final save',()=>{const b=build();setPackage(b,'originId','high-tech-pym-particles',ORIGINS,CATALOGUE);assert(evaluate(b).errors.some(e=>e.includes('choose at least one')));addAllowedEntry(b,get('Grow 1'));assert(!evaluate(b).errors.some(e=>e.includes('choose at least one')));});
test('vampire origin blocks unrelated powers unless another origin or explicit waiver is chosen',()=>{const b=build();setPackage(b,'originId','monstrous-vampire',ORIGINS,CATALOGUE);assert(additionErrors(b,get('Inspiration')).some(e=>e.includes('another origin')));});
test('choosing a multi-set power does not count both alternatives',()=>{const b=build(2);addEntry(b,{...copy(get('Banging Heads')),budgetSet:'martialArts'});assert.deepEqual(evaluate(b).sets,['martialArts']);assert.equal(evaluate(b).thematic,1);});
test('unconfigured package details block final review without blocking unrelated selections',()=>{const b=build();setPackage(b,'originId','mythic-asgardian',ORIGINS,CATALOGUE);assert(evaluate(b).errors.some(e=>e.includes('Details needed: God Heritage')));assert.deepEqual(additionErrors(b,get('Inspiration')),[]);});
test('creator exposes full packages, power-set and availability filters',()=>{const b=build();const html=renderView({build:b,step:3,catalogue:CATALOGUE});assert.match(html,/mcc-set-filter/);assert.match(html,/Available only/);assert.match(html,/Telepathic Possession/);assert.match(renderView({build:b,step:2,catalogue:CATALOGUE}),/Weird Science: Gamma Mutate/);});
test('manual-reference powers never advertise automated combat effects',()=>{for(const d of CATALOGUE.filter(d=>d.id.startsWith('core:')&&d.type==='power')){assert.equal(d.automationMode,'reference');assert.equal(d.item.system.roll.hasRoll,false);assert.match(d.item.system.description,/no automatic combat effects/);}});
test('Focus spending cannot exhaust the pool or exceed five times rank',()=>{const a={system:{rank:2,lifepool:{focus:{value:5},health:{value:50}}},items:[{flags:{[ID]:{catalogueId:'starter:sniping'}}}]};assert.throws(()=>validatePower(a,definition('starter:sniping')),/at least 1/);a.system.lifepool.focus.value=6;assert.doesNotThrow(()=>validatePower(a,definition('starter:sniping')));});
test('explicit customization produces narrow native Item edits',()=>{const b=build();const e=addEntry(b,{...copy(get('Linguist')),detail:'Kree',item:{...copy(get('Linguist').item),name:'Linguist: Kree'}});e.itemId='existing';e.choiceEdited=true;const plan=planChanges(b);assert.equal(plan.itemUpdates[0].name,'Linguist: Kree');assert.equal(plan.itemUpdates[0].effects,undefined);});

test('native-sheet removal of a required package benefit is detected and can be reconciled',()=>{const b=build(3);setPackage(b,'originId','alien-skrull',ORIGINS,CATALOGUE);b.entries=b.entries.filter(e=>e.definition.name!=='Slip Free');assert(evaluate(b).errors.some(e=>e.startsWith('Missing package benefit:')));syncPackageBenefits(b);assert(!evaluate(b).errors.some(e=>e.startsWith('Missing package benefit:')));});
