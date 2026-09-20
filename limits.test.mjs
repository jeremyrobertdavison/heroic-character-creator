import test from 'node:test';
import assert from 'node:assert/strict';
import {newBuild,clone,evaluate,applyAbility,applyRank,applyExchange,addAllowedEntry,removeAllowedEntry,additionErrors,navigationErrors,derived} from '../scripts/rules.js';
import {STARTER} from '../scripts/catalogue.js';
const find=name=>STARTER.find(d=>d.name===name);
const power=(id,set='basic')=>({id,name:id,type:'power',sets:[set],minRank:1,requires:[],trainingAllowed:true,item:{name:id,type:'power',system:{}}});
test('rank cannot exceed 6 or be fractional, and custom rank caps are normalized',()=>{
 const b=newBuild();for(const n of [0,7,100,1.5])assert.throws(()=>applyRank(b,n));applyRank(b,6);assert.equal(b.rankCap,6);
});
test('rank 1 cannot spend 22 points, score 5, or a fractional point',()=>{
 const b=newBuild();for(const n of [22,5,1.5])assert.throws(()=>applyAbility(b,'melee',n));assert.equal(b.abilities.melee,0);
});
test('score below cap cannot overspend total pool',()=>{
 const b=newBuild();applyAbility(b,'melee',4);assert.throws(()=>applyAbility(b,'agility',2),/remain/);assert.equal(b.abilities.agility,0);applyAbility(b,'agility',1);assert.equal(evaluate(b).abilityLeft,0);
});
test('rank 5 Melee is capped at 8 and invalid reduction to rank 1 is rejected atomically',()=>{
 const b=newBuild();applyRank(b,5);assert.throws(()=>applyAbility(b,'melee',10));applyAbility(b,'melee',8);const before=clone(b);assert.throws(()=>applyRank(b,1),/Rank unchanged/);assert.deepEqual(b,before);
 applyAbility(b,'melee',4);applyRank(b,1);assert.equal(b.rank,1);assert.equal(b.abilities.melee,4);
});
test('negative ability frees points without defeating individual caps',()=>{
 const b=newBuild();applyAbility(b,'ego',-3);applyAbility(b,'melee',4);applyAbility(b,'agility',4);assert.equal(evaluate(b).abilityLeft,0);assert.throws(()=>applyAbility(b,'melee',5));
});
test('next and direct tab clicks cannot bypass unspent ability points',()=>{
 const b=newBuild();assert.equal(navigationErrors(b,0,1).length,0);for(const target of [2,3,4])assert.match(navigationErrors(b,0,target).join(),/Spend all/);
 applyAbility(b,'melee',4);applyAbility(b,'agility',1);assert.deepEqual(navigationErrors(b,1,2),[]);assert.deepEqual(navigationErrors(b,3,0),[]);
});
test('power count is capped and changing sets accounts for loss of thematic bonus',()=>{
 const b=newBuild();for(let i=0;i<4;i++)addAllowedEntry(b,power('p'+i));
 assert.throws(()=>addAllowedEntry(b,power('new-set','tactics')),/Power picks/);assert.equal(b.entries.length,4);
 addAllowedEntry(b,power('p4'));assert.equal(evaluate(b).powerLeft,0);assert.throws(()=>addAllowedEntry(b,power('p5')),/Power picks/);assert.equal(b.entries.length,5);
});
test('trait limit blocks an additional discretionary trait',()=>{
 const b=newBuild();addAllowedEntry(b,{id:'t1',name:'T1',type:'trait'});assert.throws(()=>addAllowedEntry(b,{id:'t2',name:'T2',type:'trait'}),/Discretionary traits/);assert.equal(b.entries.length,1);
});
test('Change of Plans blocked at rank 1 even with Inspiration; valid at rank 2',()=>{
 const b=newBuild();addAllowedEntry(b,find('Inspiration'));assert.throws(()=>addAllowedEntry(b,find('Change of Plans')),/rank 2/);applyRank(b,2);addAllowedEntry(b,find('Change of Plans'));assert.equal(b.entries.length,2);
});
test('missing prerequisite prevents selection and removing it is blocked',()=>{
 const b=newBuild();applyRank(b,2);assert(additionErrors(b,find('Change of Plans')).some(e=>e.toLowerCase().includes('inspiration')));addAllowedEntry(b,find('Inspiration'));addAllowedEntry(b,find('Change of Plans'));const source=b.entries[0].instance;assert.throws(()=>removeAllowedEntry(b,source),/requires/);assert.equal(b.entries.length,2);
});
test('rank reduction cannot retain a higher-rank power',()=>{
 const b=newBuild();applyRank(b,2);addAllowedEntry(b,find('Inspiration'));addAllowedEntry(b,find('Change of Plans'));assert.throws(()=>applyRank(b,1),/requires rank 2/);assert.equal(b.rank,2);
});
test('exchanges cannot overspend powers or strip points already allocated',()=>{
 const b=newBuild();assert.throws(()=>applyExchange(b,'abilities',6),/Power picks/);applyExchange(b,'abilities',1);applyAbility(b,'melee',4);applyAbility(b,'agility',2);assert.throws(()=>applyExchange(b,'abilities',0),/Reduce ability/);assert.equal(b.exchanges.abilities,1);
});
test('Health and Focus minimum holds for negative, zero and positive abilities',()=>{
 const b=newBuild();for(const score of [-3,-1,0]){b.abilities.resilience=score;b.abilities.vigilance=score;assert.equal(derived(b).health,10);assert.equal(derived(b).focus,10);}b.abilities.vigilance=1;assert.equal(derived(b).focus,30);
});
test('Jeremy regression: M2 R3 V0 has 90 Health and 10 Focus with no unspent points',()=>{
 const b=newBuild();applyAbility(b,'melee',2);applyAbility(b,'resilience',3);assert.equal(derived(b).health,90);assert.equal(derived(b).focus,10);assert.equal(evaluate(b).abilityLeft,0);
});
