import {ID,ABILITIES} from './rules.js';
import {STARTER} from './catalogue.js';
import {backupActor} from './adapter.js';
import {esc} from './view.js';
import {CONTENT_VERSION,definition,catalogueId,owns,activeEffects,hasEffect,integer,validatePower,modifiers,damageFor,timedExpired,upgradeChanges} from './mechanics.js';
const {ApplicationV2,DialogV2}=foundry.applications.api;
const windows=new Map(),locks=new Set();
const keyOf=d=>d.id.slice(8);
function gm(){
  if(!game.user.isGM)throw Error('The GM resolves power effects. Use Request to send the power to chat.');
  const primary=game.users.activeGM??game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];
  if(primary&&primary.id!==game.user.id)throw Error(`Ask ${primary.name}, the active resolution GM, to resolve this action.`);
}
function owner(actor){if(!actor?.isOwner&&!game.user.isGM)throw Error('You must own this character.');}
async function locked(key,fn){if(locks.has(key))throw Error('An operation is already in progress.');locks.add(key);try{return await fn();}finally{locks.delete(key);}}
const field=(name,label,value=0,min=0)=>`<label>${esc(label)}<input type="number" name="${name}" value="${value}" min="${min}" step="1" required></label>`;
const check=(name,label)=>`<label><input type="checkbox" name="${name}"> ${esc(label)}</label>`;
async function prompt(title,content,label='Continue'){
  return DialogV2.prompt({window:{title},content,ok:{label,callback:(_event,button)=>Object.fromEntries(Array.from(button.form.elements).filter(e=>e.name).map(e=>[e.name,e.type==='checkbox'?e.checked:e.value]))},rejectClose:false});
}
async function confirm(title,content){return DialogV2.confirm({window:{title},content,rejectClose:false});}
async function note(actor,title,body,extra={}){return ChatMessage.create({speaker:ChatMessage.getSpeaker({actor}),content:`<h3>${esc(title)}</h3>${body}`, ...extra});}
function targets(max=1){
  const list=Array.from(game.user.targets).map(t=>t.actor).filter(Boolean);
  if(!list.length||list.length>max||new Set(list.map(a=>a.uuid)).size!==list.length||list.some(a=>a.type!=='super'))throw Error(`Target ${max===1?'one character':`one or two distinct characters`} on the canvas first.`);
  return list;
}
function combatRequired(actor){
  const combat=game.combat;if(!combat?.started||!combat.turns.some(c=>c.actor?.uuid===actor.uuid))throw Error('Start combat and add the source character before using this timed power.');return combat;
}
async function effect(actor,kind,source,{timed=false,changes=[]}={}){
  if(hasEffect(actor,kind))throw Error('That benefit is already active.');
  const combat=timed?combatRequired(source):null;
  return actor.createEmbeddedDocuments('ActiveEffect',[{name:`Heroic: ${definition(`starter:${kind}`)?.name??kind}`,img:'icons/svg/aura.svg',origin:source.uuid,disabled:false,transfer:false,changes,
    flags:{[ID]:{kind,sourceActor:source.uuid,combatId:combat?.id??null,round:combat?.round??null,turn:combat?.turn??null}}}]);
}
async function removeKind(actor,kind){const ids=activeEffects(actor).filter(e=>e.flags[ID].kind===kind).map(e=>e.id);if(ids.length)await actor.deleteEmbeddedDocuments('ActiveEffect',ids);}
async function spend(actor,cost){if(!cost)return;const n=actor.system.lifepool.focus.value;if(n<=0||n<cost)throw Error('Not enough Focus.');await actor.update({'system.lifepool.focus.value':n-cost});}
async function damage(actor,amount){if(amount>0)await actor.update({'system.lifepool.health.value':Math.max(0,actor.system.lifepool.health.value-amount)});}
async function refreshRoll(message,roll,updates={}){
  roll.options.edges=roll.edges;roll.options.troubles=roll.troubles;roll.options.rerolls=roll.rerolls;
  const content=await foundry.applications.handlebars.renderTemplate(roll.template,roll.prepareChatTemplateData());
  return message.update({rolls:[roll],content,...updates});
}
async function nativeRoll(actor,{ability='agility',type='nonCombat',item=null,target=null,close=false,fear=false,tn=10,extra={}}={}){
  owner(actor);const stat=actor.system.abilities[ability],mods=modifiers(actor,{fear,target,close});
  const roll=new game.mvrpg.D616('',{}, {actor,item,ability,rollType:type,against:type==='combat'?ability:'none',lifepoolTarget:'none',tn,
    modifier:(type==='nonCombat'?stat.nonCombatScore:stat.value)+(item?.system.roll?.bonus??0),
    edges:(stat.edges??0)+(item?.system.roll?.edges??0)+mods.edges,
    troubles:(stat.troubles??0)+(item?.system.roll?.troubles??0)+mods.troubles,
    [ID]:{protectedMiddle:mods.support}});
  if(!await roll.evaluate())return null;
  // Special damage always uses our resolution controls; suppress the native generic damage button.
  roll.lifepoolTarget='none';roll.options.lifepoolTarget='none';
  if(mods.support){roll.dice[1].results=[{result:1,active:true}];roll._total=roll.finalResults.total;}
  return roll.toMessage({speaker:ChatMessage.getSpeaker({actor}),flags:{[ID]:{actor:actor.uuid,...extra}}});
}
export async function abilityCheck(actor,ability){
  if(!ABILITIES.includes(ability))throw Error('Unknown ability.');owner(actor);
  const f=await prompt(`${actor.name}: ${ability}`,field('tn','Target number (set by GM)',10,1)+check('fear','Fear-related check (Fearless applies)'));
  if(!f)return;return nativeRoll(actor,{ability,tn:integer(f.tn,'Target number',1),fear:f.fear});
}
async function reaction(actor,d){
  const messages=game.messages.contents.filter(m=>m.rolls?.[0]?.constructor===game.mvrpg.D616&&!m.flags?.[ID]?.resolved&&!m.flags?.[ID]?.resolutionState).slice(-20).reverse();
  const f=await prompt(d.name,`<p>Choose the triggering roll before any edge/trouble rerolls. Confirm the trigger, ally/enemy relationship and available reaction.</p><select name="message">${messages.map(m=>`<option value="${esc(m.id)}">${esc(m.speaker?.alias??'Roll')} · ${esc(m.rolls[0].finalResults?.total)} · ${esc(m.id)}</option>`).join('')}</select>`,'Apply reaction');
  if(!f)return;const message=game.messages.get(f.message);if(!message)throw Error('No roll selected.');
  return locked(`roll:${message.id}`,async()=>{
    const roll=message.rolls[0],key=keyOf(d),reactions=message.flags?.[ID]?.reactions??[];
    if(message.flags?.[ID]?.resolved||message.flags?.[ID]?.resolutionState)throw Error('This roll has already been resolved or claimed.');
    if(roll.rerolls.history.length)throw Error('Undo the existing rerolls before adding this reaction.');
    if(reactions.includes(`${actor.uuid}:${key}`))throw Error('This character already used that reaction on this roll.');
    if(key==='change-of-plans'&&roll.troubles<1)throw Error('The triggering roll has no trouble.');
    if(key==='slow-motion-dodge'&&message.flags?.[ID]?.targets&&!message.flags[ID].targets.includes(actor.uuid))throw Error('This character is not a target of that attack.');
    if(key==='change-of-plans'&&message.flags?.[ID]?.actor===actor.uuid)throw Error('Choose an ally’s check, not your own.');
    if(key==='slow-motion-dodge'&&(roll.type!=='combat'||roll.against!=='agility'))throw Error('Requires an attack against Agility defense.');
    validatePower(actor,d);
    await message.setFlag(ID,'resolutionState','reaction-in-progress');
    try{
      await spend(actor,d.item.system.cost);
      if(key==='change-of-plans')roll.edges++;else roll.troubles++;
      await refreshRoll(message,roll,{[`flags.${ID}.reactions`]:[...reactions,`${actor.uuid}:${key}`],[`flags.${ID}.resolutionState`]:null});
      await note(actor,d.name,`<p>Applied to roll ${esc(message.id)}. Focus cost: ${d.item.system.cost}.</p>`);
    }catch(e){await message.setFlag(ID,'resolutionState','error-review-required');throw e;}
  });
}
async function attack(actor,d,bonusMessage=null,basic=null){
  const max=bonusMessage?1:['snap-shooting','weapons-blazing'].includes(keyOf(d))?2:1,selected=targets(max);
  const key=basic??keyOf(d),close=basic==='melee',ability=close?'melee':'agility';
  const f=await prompt(d.name,`<p>Targets: ${selected.map(t=>esc(t.name)).join(', ')}. Confirm legal targets, range, line of sight and available actions. Finish rerolls in chat before applying damage.</p>${key==='sniping'?field('distance','Distance in spaces (minimum 20)',20,20):''}<p>Enter situational edges/troubles in the native roll dialog. Resolve target-specific differences manually before applying outcomes.</p>`,'Roll');
  if(!f)return;if(key==='sniping')integer(f.distance,'Distance',20);
  if(!basic)validatePower(actor,d);
  const msg=await nativeRoll(actor,{ability,type:'combat',item:basic?null:actor.items.find(i=>catalogueId(i,actor)===d.id),target:selected[0],close,
    tn:selected[0].system.abilities[ability].defense,
    extra:{power:key,targets:selected.map(a=>a.uuid),damage:{multiplier:actor.system.abilities[ability].damageMultiplier,modifier:actor.system.abilities[ability].damageModifier},resolved:false,resolutionState:'cost-pending'}});
  if(!msg)return;
  try{
    await spend(actor,basic||bonusMessage?0:d.item.system.cost);
    if(bonusMessage)await bonusMessage.setFlag(ID,'bonusUsed',true);
    await msg.setFlag(ID,'resolutionState',null);
  }catch(e){await msg.setFlag(ID,'resolutionState','error-review-required');throw e;}
  return msg;
}
export async function usePower(actor,id){
  gm();const d=definition(id);validatePower(actor,d);const key=keyOf(d);
  return locked('gm-mutation',async()=>{
    if(['sniping','snap-shooting','weapons-blazing'].includes(key))return attack(actor,d);
    if(['slow-motion-dodge','change-of-plans'].includes(key))return reaction(actor,d);
    if(key==='unflappable-poise')return ui.notifications.info('This permanent benefit applies to close attacks through Heroic Actions.');
    let target=actor,combat=null;
    if(['inspiration','combat-support','counterstrike-technique'].includes(key))target=targets()[0];
    if(['inspiration','combat-support'].includes(key)){
      if(target.uuid===actor.uuid)throw Error('Choose an ally other than this character.');
      combat=combatRequired(actor);
      if(hasEffect(target,key))throw Error('That benefit is already active.');
    }
    if(key==='combat-support'&&actor.getFlag(ID,'supportCombat')===combat.id)throw Error('Combat Support has already been used in this combat.');
    if(['attack-stance','defense-stance'].includes(key)&&hasEffect(actor,key))throw Error('This stance is already active.');
    const f=await prompt(d.name,`${d.item.system.description}<p>Target: ${esc(target.name)}. Confirm the trigger, action availability, and hearing/reach requirements.</p>${key==='counterstrike-technique'?field('regular','Attacker’s regular damage after applicable resistance (not doubled)',0):''}`,'Apply effect');
    if(!f)return;validatePower(actor,d);
    const amount=key==='counterstrike-technique'?Math.ceil(integer(f.regular,'Regular damage')/2):0;
    // A durable journal record is written before mutation. Errors deliberately do not auto-retry.
    const receipt=await note(actor,d.name,`<p>Applying to ${esc(target.name)}. Focus cost: ${d.item.system.cost}.</p>`,{flags:{[ID]:{state:'in-progress',actor:actor.uuid,power:key}}});
    try{
      await spend(actor,d.item.system.cost);
      if(key==='combat-support')await actor.setFlag(ID,'supportCombat',combat.id);
      if(key==='counterstrike-technique')await damage(target,amount);
      else await effect(target,key,actor,{timed:['inspiration','combat-support'].includes(key),changes:key==='attack-stance'?[{key:'system.abilities.melee.damageModifierBonus',mode:2,value:'@system.abilities.melee.value',priority:20}]:[]});
      await receipt.update({content:`<h3>${esc(d.name)}</h3><p>Applied to ${esc(target.name)}. Focus spent: ${d.item.system.cost}.${key==='counterstrike-technique'?` Damage: ${amount}.`:''}</p>`,[`flags.${ID}.state`]:'complete'});
    }catch(e){await receipt.setFlag(ID,'state','error-review-required');throw Error(`${e.message} Partial action possible; inspect the chat receipt, Focus and effects before retrying.`);}
  });
}
export async function resolveAttack(message){
  gm();return locked('gm-mutation',async()=>{
    let flag=message.flags?.[ID];if(!flag?.power||flag.resolved||flag.resolutionState)throw Error('This attack is already resolved or needs recovery review.');
    const actor=await fromUuid(flag.actor),roll=message.rolls[0];if(!actor||!roll)throw Error('The source character or roll is missing.');
    const selected=await Promise.all(flag.targets.map(uuid=>fromUuid(uuid)));if(selected.some(t=>!t))throw Error('A target no longer exists.');
    const snapshot=JSON.stringify(roll.toJSON());
    const f=await prompt('Apply attack outcome',`<p>Finish all rerolls first. Current total: ${roll.finalResults.total}; Fantastic: ${roll.fantasticResult?'yes':'no'}. Damage uses the ability values saved when the attack was rolled.</p><p>Resistance reduces the damage multiplier. Enter target-specific final defense and confirm any situational differences.</p>${selected.map((t,i)=>`<fieldset><legend>${esc(t.name)}</legend>${field(`defense${i}`,'Final defense',t.system.abilities[roll.ability].defense,1)}${field(`dr${i}`,'Damage reduction (multiplier)',0)}</fieldset>`).join('')}${check('final','I have resolved all applicable edges/troubles and target-specific modifiers.')}`,'Apply damage');
    if(!f)return;if(!f.final)throw Error('Confirm the roll is final before applying damage.');
    if(snapshot!==JSON.stringify(message.rolls[0].toJSON()))throw Error('The roll changed while this dialog was open. Review it again.');
    flag=message.flags[ID];if(flag.resolved||flag.resolutionState)throw Error('The attack is already claimed.');
    const results=selected.map((target,i)=>{
      const hit=roll.ultimateFantasticResult||roll.finalResults.total>=integer(f[`defense${i}`],'Defense',1);
      return {target,hit,amount:damageFor(flag.power,{...flag.damage,middle:roll.activeResultDie('dieM').total,resistance:integer(f[`dr${i}`],'Damage reduction'),fantastic:roll.fantasticResult,hit})};
    });
    await message.setFlag(ID,'resolutionState','applying');
    try{
      for(const r of results){
        await damage(r.target,r.amount);
        if(r.hit){
          await removeKind(r.target,'defense-stance');
          if(flag.power==='snap-shooting'&&roll.fantasticResult&&!hasEffect(r.target,'bleeding'))await effect(r.target,'bleeding',actor);
        }
      }
      const bonus=flag.power==='weapons-blazing'&&roll.fantasticResult&&results.some(r=>r.hit);
      await message.update({[`flags.${ID}.resolved`]:true,[`flags.${ID}.resolutionState`]:'complete',[`flags.${ID}.bonusAvailable`]:bonus,[`flags.mvrpg.allowModification`]:false});
      await note(actor,`${definition(`starter:${flag.power}`)?.name??flag.power}: outcome`,results.map(r=>`<p>${esc(r.target.name)}: ${r.hit?`${r.amount} Health damage`:'miss'}.</p>`).join('')+(flag.power==='snap-shooting'&&roll.fantasticResult&&results.some(r=>r.hit)?'<p>Bleeding marked. Apply ongoing bleeding and recovery manually.</p>':'')+(bonus?'<p>A bonus attack is available on the original roll card. Select one target before using it.</p>':''));
    }catch(e){await message.setFlag(ID,'resolutionState','error-review-required');throw Error(`${e.message} Partial outcome possible. Inspect target Health/effects before correcting manually; this card will not apply again.`);}
  });
}
export async function upgradeContent(actor){
  gm();return locked('gm-mutation',async()=>{
    const changes=upgradeChanges(actor);if(!changes.length)return ui.notifications.info('No creator-linked included Items were found. Imported Items are not adopted by name.');
    if(!await confirm('Update included content',`<p>Update rules and power settings on ${changes.length} creator-linked Items on ${esc(actor.name)}? Custom descriptions/settings on these Items will be replaced. Names, artwork, Items, other equipment, effects, and current Health/Focus are preserved. A recovery Actor is created first.</p>`))return;
    const baseline=JSON.stringify(actor.toObject()),recovery=await backupActor(actor);
    if(!recovery)throw Error('Recovery copy could not be created; no content was changed.');
    if(baseline!==JSON.stringify(actor.toObject()))throw Error('Character changed during backup. Review and retry the content update.');
    try{
      await actor.updateEmbeddedDocuments('Item',changes);
      const build=structuredClone(actor.getFlag(ID,'build'));
      if(build){for(const e of build.entries){const d=definition(e.definition.id);if(d&&changes.some(c=>c._id===e.itemId))e.definition=structuredClone(d);}await actor.setFlag(ID,'build',build);}
      await actor.setFlag(ID,'contentVersion',CONTENT_VERSION);
      ui.notifications.info(`Updated ${changes.length} Items. Recovery: ${recovery.name}.`);
    }catch(e){throw Error(`Update interrupted. Recovery: ${recovery.name}. ${e.message}`);}
  });
}
export class HeroicActions extends ApplicationV2 {
  static DEFAULT_OPTIONS={id:'heroic-actions-{id}',classes:['mcc-app'],tag:'section',window:{title:'Heroic Actions',resizable:true},position:{width:700,height:760}};
  constructor(actor){super();this.actor=actor;this.busy=false;}
  async _renderHTML(){
    const actor=this.actor,items=Array.from(actor.items).map(i=>({i,d:definition(catalogueId(i,actor))})).filter(x=>x.d);
    const button=(cmd,label,data='')=>`<button type="button" data-heroic-cmd="${cmd}" ${data}>${label}</button>`;
    return `<div class="hcc-actions"><h2>${esc(actor.name)}</h2><p>Health ${actor.system.lifepool.health.value}/${actor.system.lifepool.health.max} · Focus ${actor.system.lifepool.focus.value}/${actor.system.lifepool.focus.max}</p><p>Use this panel for included conditional benefits. Standard sheet rolls do not apply those benefits. The GM confirms actions, triggers, hearing and range; target tokens before resolving powers.</p><h3>Ability checks</h3><div class="hcc-buttons">${ABILITIES.map(a=>button('ability',esc(a),`data-key="${a}"`)).join('')}</div><p>Melee: close combat; Agility: ranged combat and coordination; Resilience: endurance; Vigilance: awareness; Ego: will and influence; Logic: reasoning. Checks use the system’s noncombat score; defenses are 10 + ability + bonuses.</p>${game.user.isGM?`<div class="hcc-buttons">${button('basic','Close attack', 'data-key="melee"')}${button('basic','Ranged attack','data-key="agility"')}${button('upgrade','Update included content')}${owns(actor,'heroic')?button('karma','After rest: reset Karma'):''}</div>`:''}<h3>Included powers, traits and tags</h3>${items.map(({d})=>`<article><details><summary><strong>${esc(d.name)}</strong></summary>${d.item.system.description}</details>${d.type==='power'?button(game.user.isGM?'power':'request',game.user.isGM?'Use / resolve':'Request in chat',`data-key="${esc(d.id)}"`):d.id.includes('connections-')?button('ability','Ask contact: Ego check','data-key="ego"'):''}</article>`).join('')||'<p>No creator-linked included content. Use the creator to add included options. Existing imported Items retain their native behavior.</p>'}<h3>Active module effects</h3>${activeEffects(actor).map(e=>`<p>${esc(e.name)} ${game.user.isGM?button('end','End',`data-key="${e.id}"`):''}</p>`).join('')||'<p>None.</p>'}<p>Timed ally benefits expire at the source’s next turn or combat end. End concentration when interrupted. Bleeding’s recurring damage and recovery require GM resolution.</p>${button('refresh','Refresh')}</div>`;
  }
  _replaceHTML(html,content){content.innerHTML=html;}
  _onRender(context,options){super._onRender(context,options);this.element.querySelector('.hcc-actions').addEventListener('click',async event=>{
    const b=event.target.closest('[data-heroic-cmd]');if(!b||this.busy)return;event.preventDefault();this.busy=true;b.disabled=true;
    try{
      const key=b.dataset.key,cmd=b.dataset.heroicCmd;owner(this.actor);
      if(cmd==='ability')await abilityCheck(this.actor,key);
      else if(cmd==='power')await usePower(this.actor,key);
      else if(cmd==='basic'){gm();await locked('gm-mutation',()=>attack(this.actor,{id:`starter:${key}`,name:`${key} attack`},null,key));}
      else if(cmd==='upgrade')await upgradeContent(this.actor);
      else if(cmd==='request'){const d=definition(key);validatePower(this.actor,d);await note(this.actor,`Requested: ${d.name}`,`${d.item.system.description}<p>GM: open this character’s Heroic Actions to resolve the request.</p>`,{flags:{[ID]:{requestActor:this.actor.uuid}}});}
      else if(cmd==='end'){gm();await this.actor.effects.get(key)?.delete();}
      else if(cmd==='karma'){gm();if(owns(this.actor,'heroic')&&await confirm('Reset Karma','<p>Has the character completed the required rest? Set current Karma to rank?</p>'))await this.actor.update({'system.karma':this.actor.system.rank});}
    }catch(e){ui.notifications.error(e.message);console.error(`${ID}:`,e);}finally{this.busy=false;this.render({force:true});}
  });}
}
export function openActions(actor){owner(actor);if(actor.type!=='super')throw Error('Choose a super character.');const old=windows.get(actor.uuid);if(old?.rendered){old.bringToFront();old.render({force:true});return old;}const app=new HeroicActions(actor);windows.set(actor.uuid,app);app.render({force:true});return app;}
function allActors(){const map=new Map(game.actors.map(a=>[a.uuid,a]));for(const token of canvas?.tokens?.placeables??[])if(token.actor)map.set(token.actor.uuid,token.actor);return [...map.values()];}
function isResolutionGM(){try{gm();return true;}catch{return false;}}
export function registerActionHooks(){
  // Wrap only managed-roll rerolls; ordinary system rolls retain their original behavior.
  const original=game.mvrpg.D616.prototype.mvReroll;
  game.mvrpg.D616.prototype.mvReroll=async function(die,message){
    if(message.flags?.[ID]?.resolved||message.flags?.[ID]?.resolutionState){ui.notifications.warn('This Heroic attack is locked for resolution.');return;}
    if(this.options[ID]?.protectedMiddle&&this.edgesAndTroubles<0&&die==='dieM'){ui.notifications.warn('Combat Support protects this die from trouble. Choose another die.');return;}
    return original.call(this,die,message);
  };
  const undo=game.mvrpg.D616.prototype.undoLastReroll;
  game.mvrpg.D616.prototype.undoLastReroll=async function(message,...args){
    if(message.flags?.[ID]?.resolved||message.flags?.[ID]?.resolutionState){ui.notifications.warn('This Heroic attack is locked for resolution.');return;}
    return undo.call(this,message,...args);
  };
  const renderChat=(message,html)=>{
    const root=html instanceof HTMLElement?html:html?.[0];if(!root||root.querySelector('.hcc-chat-controls'))return;
    const f=message.flags?.[ID];if(!f)return;
    const box=document.createElement('div');box.className='hcc-chat-controls';
    const add=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=async e=>{e.preventDefault();e.stopPropagation();b.disabled=true;try{await fn();}catch(error){ui.notifications.error(error.message);}finally{b.disabled=false;}};box.append(b);};
    if(f.requestActor&&game.user.isGM)add('Open Heroic Actions',async()=>openActions(await fromUuid(f.requestActor)));
    if(f.power&&game.user.isGM&&!f.resolved&&!f.resolutionState)add('Apply Heroic outcome',()=>resolveAttack(message));
    if(f.bonusAvailable&&!f.bonusUsed&&game.user.isGM)add('Bonus attack',async()=>{gm();await locked(`bonus:${message.id}`,async()=>{if(message.flags[ID].bonusUsed)throw Error('Bonus already used.');const actor=await fromUuid(f.actor);await locked('gm-mutation',()=>attack(actor,definition('starter:weapons-blazing'),message));});});
    if(f.resolutionState==='error-review-required'||f.state==='error-review-required'){const p=document.createElement('p');p.textContent='Partial action possible. GM must inspect resources/effects and correct manually; do not reapply.';box.append(p);}
    if(f.actor&&!f.power&&message.rolls?.[0]?.options?.[ID]?.protectedMiddle){const p=document.createElement('p');p.textContent='Combat Support: special die fixed and protected from trouble.';box.append(p);}
    if(box.childNodes.length)root.append(box);
  };
  Hooks.on('renderChatMessageHTML',renderChat);Hooks.on('renderChatMessage',renderChat);
  const expire=async combat=>{if(!isResolutionGM())return;for(const actor of allActors()){const ids=activeEffects(actor).filter(e=>timedExpired(e.flags[ID],combat)).map(e=>e.id);if(ids.length)await actor.deleteEmbeddedDocuments('ActiveEffect',ids);}};
  Hooks.on('updateCombat',(combat,changes)=>{if('turn' in changes||'round' in changes)expire(combat).catch(e=>ui.notifications.error(e.message));});
  Hooks.on('deleteCombat',combat=>{if(!isResolutionGM())return;(async()=>{for(const actor of allActors()){const ids=activeEffects(actor).filter(e=>e.flags[ID].combatId===combat.id).map(e=>e.id);if(ids.length)await actor.deleteEmbeddedDocuments('ActiveEffect',ids);}})().catch(e=>ui.notifications.error(e.message));});
  Hooks.on('updateActor',actor=>{if(!isResolutionGM()||actor.type!=='super')return;if(actor.system.lifepool.focus.value<=0||actor.system.lifepool.health.value<=0)(async()=>{await removeKind(actor,'attack-stance');await removeKind(actor,'defense-stance');})().catch(e=>ui.notifications.error(e.message));});
}
