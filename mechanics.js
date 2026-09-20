import {ID,LEGACY_ID} from './rules.js';
import {CATALOGUE} from './catalogue.js';
export const CONTENT_VERSION='0.3.0';
export const definition=id=>CATALOGUE.find(d=>d.id===id);
export function catalogueId(item,actor) {
  return item.flags?.[ID]?.catalogueId??item.flags?.[LEGACY_ID]?.catalogueId??
    actor?.flags?.[ID]?.build?.entries?.find(e=>e.itemId===item.id)?.definition.id;
}
export const owns=(actor,key)=>Array.from(actor.items??[]).some(i=>catalogueId(i,actor)===`starter:${key}`);
export const activeEffects=actor=>Array.from(actor.effects??[]).filter(e=>!e.disabled&&!e.isSuppressed&&e.flags?.[ID]?.kind);
export const hasEffect=(actor,key)=>activeEffects(actor).some(e=>e.flags[ID].kind===key);
export function integer(value,label,min=0,max=1000000) {
  if(value===''||value===null||value===undefined)throw Error(`${label} is required.`);
  const n=Number(value);if(!Number.isInteger(n)||n<min||n>max)throw Error(`${label} must be an integer from ${min} to ${max}.`);return n;
}
export function validatePower(actor,d) {
  if(!d||d.type!=='power'||!Array.from(actor.items??[]).some(i=>catalogueId(i,actor)===d.id))throw Error('This character does not own that included power.');
  if(actor.system.rank<d.minRank)throw Error(`Requires rank ${d.minRank}.`);
  for(const id of d.requires??[])if(!Array.from(actor.items??[]).some(i=>catalogueId(i,actor)===id))throw Error(`Requires ${definition(id)?.name??id}.`);
  const focus=actor.system.lifepool.focus.value;
  if(d.item.system.cost>0&&(focus<=d.item.system.cost||d.item.system.cost>5*actor.system.rank))throw Error('Not enough Focus: keep at least 1 Focus and spend at most five times rank.');
  if(d.item.system.duration==='concentration'&&(focus<=0||actor.system.lifepool.health.value<=0))throw Error('Cannot maintain concentration at zero Health or Focus.');
  if(d.id==='starter:counterstrike-technique'&&!hasEffect(actor,'attack-stance'))throw Error('Attack Stance must be active.');
}
export function modifiers(actor,{fear=false,target=null,close=false}={}) {
  let edges=hasEffect(actor,'inspiration')?1:0;
  if(fear&&owns(actor,'fearless'))edges++;
  let troubles=actor.system.lifepool.focus.value<=0&&!owns(actor,'determination')?1:0;
  if(close&&target) {
    const stance=hasEffect(target,'defense-stance'),poise=owns(target,'unflappable-poise');
    troubles+=poise?(stance?2:1):(stance?1:0);
  }
  return {edges,troubles,support:hasEffect(actor,'combat-support')};
}
export function damageFor(key,{middle,multiplier,modifier,resistance=0,fantastic=false,hit=true}) {
  for(const [k,v] of Object.entries({middle,multiplier,modifier,resistance}))if(!Number.isFinite(v))throw Error(`Invalid ${k}.`);
  if(middle<2||middle>6||resistance<0)throw Error('Invalid damage die or resistance.');
  if(!hit||multiplier-resistance<1)return 0;
  const regular=Math.max(0,middle*(multiplier-resistance)+modifier);
  if(key==='sniping')return Math.ceil(regular*(fantastic?3:1));
  if(['snap-shooting','weapons-blazing'].includes(key))return Math.ceil(regular*(fantastic?1:0.5));
  return Math.ceil(regular*(fantastic?2:1));
}
export function timedExpired(flag,combat) {
  if(!flag.combatId||flag.combatId!==combat.id)return false;
  return combat.combatant?.actor?.uuid===flag.sourceActor&&
    (combat.round>flag.round||(combat.round===flag.round&&combat.turn>flag.turn));
}
export function upgradeChanges(actor) {
  return Array.from(actor.items).flatMap(item=>{
    const d=definition(catalogueId(item,actor));if(!d)return [];
    const saved=actor.flags?.[ID]?.build?.entries?.find(e=>e.itemId===item.id)?.definition;
    const system=structuredClone(d.item.system);
    if(saved?.detail){const safe=String(saved.detail).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));system.description+=`<p><strong>Character choice:</strong> ${safe}</p>`;}
    return [{_id:item.id,...Object.fromEntries(Object.entries(system).map(([k,v])=>[`system.${k}`,structuredClone(v)])),
      [`flags.${ID}.catalogueId`]:d.id,[`flags.${ID}.contentVersion`]:CONTENT_VERSION}];
  });
}
