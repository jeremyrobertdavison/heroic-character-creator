import {ID,LEGACY_ID,ABILITIES,clone,newBuild,derived,evaluate,uid,allocationErrors} from './rules.js';
export function fingerprint(actor) {return JSON.stringify(actor.toObject());}
export function definitionFromItem(item, source='Existing character') {
  const raw=typeof item.toObject==='function'?item.toObject():clone(item);
  // No name-based adoption: preserve native source identities and unverified status.
  return {id:`native:${item.uuid??raw._id??uid()}`,name:raw.name,type:raw.type,
    sets:raw.system?.powerSets??[],reviewed:false,source,
    description:String(raw.system?.description??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(),item:raw};
}
export function fromActor(actor) {
  const raw=actor.toObject(), saved=raw.flags?.[ID]?.build??raw.flags?.[LEGACY_ID]?.build, build=newBuild();
  if(saved?.schema===1) Object.assign(build,clone(saved));
  build.name=raw.name;build.img=raw.img;build.rank=raw.system.rank;build.rankCap=6;
  build.identity=clone(raw.system.identity);
  build.abilities=Object.fromEntries(ABILITIES.map(k=>[k,raw.system.abilities[k].value]));
  const existing=new Map((saved?.entries??[]).map(e=>[e.itemId,e]));
  build.entries=raw.items.filter(i=>['power','trait','tag'].includes(i.type)).map(i=>{
    const previous=existing.get(i._id);
    const changed=previous && JSON.stringify(previous.definition.item)!==JSON.stringify(i);
    return {instance:previous?.instance??uid(),itemId:i._id,
      definition:previous?{...clone(previous.definition),name:i.name,sets:i.system?.powerSets??[],item:clone(i),...(changed?{reviewed:false}: {})}:definitionFromItem(i),
      sources:previous?.sources??['legacy']};
  });
  if(!saved) {build.originId=raw.system.identity.origin?'custom':'';build.occupationId=raw.system.identity.occupation?'custom':'';}
  build.resources={health:raw.system.lifepool.health.max,focus:raw.system.lifepool.focus.max,
    initiative:raw.system.initiative.value,...Object.fromEntries(['run','climb','swim','jump'].map(k=>[k,raw.system.speed[k]])),karma:raw.system.karma};
  build.recalculate=false;build.acknowledge=false;delete build.override;
  return build;
}
export function planChanges(build, actor=null) {
  const raw=actor?.toObject(), stats=build.recalculate?derived(build):build.resources;
  const update={name:build.name.trim(),img:build.img,'system.rank':build.rank};
  for(const k of ABILITIES) update[`system.abilities.${k}.value`]=build.abilities[k];
  // Only identity fields exposed by this creator are changed; other biography remains intact.
  for(const k of ['codeName','realName','origin','occupation']) update[`system.identity.${k}`]=build.identity[k]??'';
  update['system.lifepool.health.max']=stats.health;update['system.lifepool.focus.max']=stats.focus;
  update['system.initiative.value']=stats.initiative;
  for(const k of ['run','climb','swim','jump']) update[`system.speed.${k}`]=stats[k];
  if(!actor) {
    update['system.lifepool.health.value']=stats.health;update['system.lifepool.focus.value']=stats.focus;update['system.karma']=stats.karma;
  }
  const retained=new Set(build.entries.map(e=>e.itemId).filter(Boolean));
  const remove=(raw?.items??[]).filter(i=>['power','trait','tag'].includes(i.type)&&!retained.has(i._id)).map(i=>i._id);
  const add=build.entries.filter(e=>!e.itemId).map(e=>{
    const item=clone(e.definition.item);
    delete item._id;delete item.folder;delete item.ownership;delete item._stats;
    item.flags={...item.flags,[ID]:{instance:e.instance,catalogueId:e.definition.id}};
    return {entry:e,item};
  });
  return {update,remove,add};
}
function ensurePermission(actor, copy) {
  if(actor&&!actor.isOwner&&!game.user.isGM) throw new Error('You do not own this character.');
  if(actor&&!copy&&!game.user.isGM) throw new Error('Existing-character updates are GM-only in this prototype. Use Save as New if you can create Actors.');
  if((!actor||copy)&&!game.user.can('ACTOR_CREATE')) throw new Error('Your Foundry role cannot create Actors. Ask the GM to create this draft.');
  if(actor?.isToken) throw new Error('Open the original character from the Actors directory, not an unlinked token.');
}
async function recoveryFolder() {
  let folder=game.folders.find(f=>f.type==='Actor'&&(f.getFlag(ID,'recovery')||f.getFlag(LEGACY_ID,'recovery')));
  if(!folder) folder=await Folder.create({name:'Character Creator — Recovery',type:'Actor',flags:{[ID]:{recovery:true}}});
  return folder;
}
export async function backupActor(actor) {
  const data=actor.toObject();delete data._id;
  data.name=`[Recovery] ${actor.name} — ${new Date().toISOString()}`;
  data.folder=(await recoveryFolder()).id;data.ownership={default:0,[game.user.id]:3};
  data.flags={...data.flags,[ID]:{...data.flags?.[ID],recoveryOf:actor.uuid,recoveryAt:Date.now()}};
  return Actor.create(data,{keepEmbeddedIds:true,renderSheet:false});
}
export async function commit(build, actor, baseline, {copy=false}={}) {
  ensurePermission(actor,copy);
  if(!build.name?.trim()) throw new Error('Enter a character name.');
  if(!Number.isInteger(build.rank)||build.rank<1||build.rank>6||ABILITIES.some(k=>!Number.isInteger(build.abilities[k]))) throw new Error('Rank and ability scores must be valid whole numbers; rank must be 1–6.');
  const result=evaluate(build);
  const errors=[...result.errors,...allocationErrors(build,true)];
  if(errors.length) throw new Error([...new Set(errors)].join('\n'));
  if(!build.acknowledge) throw new Error('Acknowledge the manual rule review on the Review tab.');
  if(actor&&fingerprint(actor)!==baseline) throw new Error('This character changed after you opened the creator. Close and reopen it before saving; export your draft to retain your choices.');
  const plan=planChanges(build,actor), finalBuild=clone(build);
  let target=actor,backup=null;
  if(actor&&!copy) {
    backup=await backupActor(actor);
    if(!backup) throw new Error('Could not create a recovery copy. No changes were applied.');
    if(fingerprint(actor)!==baseline) throw new Error('Character changed during backup. Reopen the creator; no changes were applied.');
  }
  try {
    if(!actor||copy) {
      let data=actor?actor.toObject():{type:'super',ownership:{default:0,[game.user.id]:3},prototypeToken:{actorLink:true,name:build.name.trim(),texture:{src:build.img}}};
      delete data._id;
      data=foundry.utils.mergeObject(data,foundry.utils.expandObject(plan.update),{inplace:false});
      if(copy) {
        data.name=`${build.name} (Copy)`;data.folder=null;data.ownership={default:0,[game.user.id]:3};
        delete data.flags?.[ID]?.recoveryOf;
      }
      const retained=(data.items??[]).filter(i=>!plan.remove.includes(i._id));
      for(const {entry,item} of plan.add) {
        item._id=foundry.utils.randomID();retained.push(item);
        finalBuild.entries.find(e=>e.instance===entry.instance).itemId=item._id;
      }
      data.items=retained;
      data.flags={...data.flags,[ID]:{build:finalBuild,coverage:'prototype-manual-review',savedAt:Date.now()}};
      target=await Actor.create(data,{keepEmbeddedIds:true,renderSheet:false});
      if(!target) throw new Error('Actor creation was cancelled.');
    } else {
      // Snapshot exists. Adds and field writes precede deletions to minimize data loss on failure.
      if(plan.add.length) {
        const created=await target.createEmbeddedDocuments('Item',plan.add.map(a=>a.item));
        if(created.length!==plan.add.length) throw new Error('Not all selected Items were created.');
        created.forEach((item,i)=>{finalBuild.entries.find(e=>e.instance===plan.add[i].entry.instance).itemId=item.id;});
      }
      await target.update(plan.update);
      if(plan.remove.length) await target.deleteEmbeddedDocuments('Item',plan.remove);
      await target.setFlag(ID,'build',finalBuild);
    }
    const latest=target.toObject();
    for(const [path,value] of Object.entries(plan.update)) {
      if(copy&&path==='name')continue;
      const actual=path.split('.').reduce((o,k)=>o?.[k],latest);
      if(actual!==value)throw new Error(`Post-save verification failed for ${path}.`);
    }
    if(plan.remove.some(id=>latest.items.some(i=>i._id===id)))throw new Error('Some requested Item removals did not complete.');
    if(latest.name!==(copy?`${build.name} (Copy)`:build.name.trim())||latest.system.rank!==build.rank||finalBuild.entries.some(e=>!latest.items.some(i=>i._id===e.itemId))) throw new Error('Saved data did not pass the post-save check.');
    return {actor:target,backup};
  } catch(error) {
    throw new Error(`${error.message}${backup?` The save may be incomplete. The original is preserved as “${backup.name}” in Character Creator — Recovery. Do not retry blindly; use the recovery copy.`:''}`);
  }
}
