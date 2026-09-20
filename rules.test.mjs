import test from 'node:test';
import assert from 'node:assert/strict';
import {newBuild,evaluate,addEntry,setPackage,derived,validateDraft} from '../scripts/rules.js';
import {STARTER,ORIGINS,OCCUPATIONS} from '../scripts/catalogue.js';
const find=n=>STARTER.find(d=>d.name===n);
test('rank 1–6 core budgets and Basic-only thematic bonus',()=>{
 for(let rank=1;rank<=6;rank++){const b=newBuild();b.rank=rank;const r=evaluate(b);assert.equal(r.abilityBudget,5*rank);assert.equal(r.powerBudget,5*rank);assert.equal(r.traitBudget,rank);}
});
test('negative allocations return points and lower bound is enforced',()=>{
 const b=newBuild();b.abilities.melee=4;b.abilities.agility=3;b.abilities.ego=-2;
 assert.equal(evaluate(b).abilityLeft,0);assert.equal(evaluate(b).errors.length,0);
 b.abilities.ego=-4;assert.match(evaluate(b).errors.join(),/ego/);
});
test('normal score cap and fractional values rejected',()=>{
 const b=newBuild();b.abilities.melee=5;assert.match(evaluate(b).errors.join(),/melee/);b.abilities.melee=1.5;assert.match(evaluate(b).errors.join(),/whole/);
});
test('exchanges debit powers and credit intended budget',()=>{
 const b=newBuild();b.exchanges={abilities:2,traits:1};const r=evaluate(b);
 assert.equal(r.abilityBudget,7);assert.equal(r.traitBudget,2);assert.equal(r.powerLeft,2);
});
test('adding a set reduces thematic bonus; Basic does not count',()=>{
 const b=newBuild();b.rank=3;addEntry(b,find('Inspiration'));assert.equal(evaluate(b).thematic,3);
 addEntry(b,find('Attack Stance'));addEntry(b,find('Defense Stance'));assert.equal(evaluate(b).thematic,2);
 addEntry(b,find('Snap Shooting'));assert.equal(evaluate(b).thematic,1);
});
test('prerequisite and rank checks resolve when required option selected',()=>{
 const b=newBuild();addEntry(b,find('Counterstrike Technique'));assert.equal(evaluate(b).errors.length,2);
 b.rank=2;addEntry(b,find('Attack Stance'));assert.equal(evaluate(b).errors.length,0);
});
test('grants are removed by provenance, manual entitlement is retained',()=>{
 const b=newBuild();addEntry(b,find('Determination'));
 setPackage(b,'originId','special-training',ORIGINS,STARTER);assert.equal(b.entries.length,1);assert.deepEqual(b.entries[0].sources,['choice','origin']);
 setPackage(b,'originId','custom',ORIGINS,STARTER);assert.equal(b.entries.length,1);assert.deepEqual(b.entries[0].sources,['choice']);
});
test('origin grants do not consume discretionary traits',()=>{
 const b=newBuild();setPackage(b,'originId','special-training',ORIGINS,STARTER);assert.equal(evaluate(b).traits,0);
 setPackage(b,'originId','custom',ORIGINS,STARTER);assert.equal(b.entries.length,0);
});
test('Adventurer grants two traits and a tag without budget charge',()=>{
 const b=newBuild();setPackage(b,'occupationId','adventurer',OCCUPATIONS,STARTER);assert.equal(b.entries.length,3);assert.equal(evaluate(b).traits,0);
});
test('Special Training blocks unknown Basic suitability and prohibited sets',()=>{
 const b=newBuild();b.originId='special-training';addEntry(b,{id:'x',name:'Alien power',type:'power',sets:['telepathy']});
 assert.match(evaluate(b).errors.join(),/Special Training/);
 b.entries=[];setPackage(b,'originId','special-training',ORIGINS,STARTER);addEntry(b,find('Inspiration'));assert.equal(evaluate(b).errors.length,0);
});
test('unknown imported content remains unverified',()=>{
 const b=newBuild();addEntry(b,{id:'native:test',name:'Imported',type:'trait',sets:[]});assert.match(evaluate(b).warnings.join(),/Imported/);
});
test('ordinary derived totals and movement rounding',()=>{
 const b=newBuild();b.abilities.resilience=2;b.abilities.vigilance=3;b.abilities.agility=5;
 assert.deepEqual(derived(b),{health:60,focus:90,initiative:3,run:6,climb:3,swim:3,jump:3,karma:0});
 b.abilities.agility=0;assert.equal(derived(b).climb,3);
});
test('zero abilities still give minimum Health and Focus of 10',()=>{const r=evaluate(newBuild());assert.equal(r.stats.health,10);assert.equal(r.stats.focus,10);});
test('invalid draft structures are rejected',()=>{assert.throws(()=>validateDraft({schema:1,entries:[]}));assert.throws(()=>validateDraft({...newBuild(),schema:2}));});
test('starter catalogue has resolvable prerequisites and valid native types',()=>{
 const ids=new Set(STARTER.map(x=>x.id));assert.equal(ids.size,STARTER.length);
 for(const d of STARTER){assert.equal(d.item.type,d.type);for(const p of d.requires??[])assert(ids.has(p));}
});
