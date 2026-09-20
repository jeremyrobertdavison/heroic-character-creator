import {CATALOGUE,ORIGINS,OCCUPATIONS} from './catalogue.js';
const CORE_BY_ID=new Map(CATALOGUE.map(d=>[d.id,d]));
export const ID = 'heroic-character-creator';
// Read previous prototype metadata without changing its native character data.
export const LEGACY_ID = 'mvrpg-character-creator';
export const ABILITIES = ['melee','agility','resilience','vigilance','ego','logic'];
export const clone = value => JSON.parse(JSON.stringify(value));
export const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function newBuild() {
  return {schema:1,name:'New Hero',img:'icons/svg/mystery-man.svg',rank:1,rankCap:6,
    abilities:Object.fromEntries(ABILITIES.map(k=>[k,0])),identity:{codeName:'',realName:'',origin:'',occupation:''},
    originId:'',occupationId:'',entries:[],exchanges:{abilities:0,traits:0},
    recalculate:true,resources:{health:10,focus:10,initiative:0,run:5,climb:3,swim:3,jump:3,karma:0},
    acknowledge:false};
}
export function addEntry(build, definition, source='choice') {
  // Separate manual copies remain distinct. Grants share an existing identical catalogue entry.
  const existing = build.entries.find(e=>e.definition.id===definition.id);
  if(existing && (source!=='choice' || !definition.repeatable)) {
    if (!existing.sources.includes(source)) existing.sources.push(source);
    return existing;
  }
  const entry={instance:uid(),definition:clone(definition),sources:[source]};
  build.entries.push(entry); return entry;
}
export const isPackageSource = source => /^(origin|occupation)(:|$)/.test(source);
export function assignedPackages(build) {
  const result=[];
  for(const [field,list,source] of [['originId',ORIGINS,'origin'],['occupationId',OCCUPATIONS,'occupation']]) {
    const pack=list.find(p=>p.id===build[field]);if(pack)result.push({pack,source,kind:source});
  }
  for(const entry of build.entries) {
    const d=entry.definition,kind=d.detailType;
    if(!['origin','occupation'].includes(kind)||!d.packageId)continue;
    const pack=(kind==='origin'?ORIGINS:OCCUPATIONS).find(p=>p.id===d.packageId);
    if(pack)result.push({pack,source:`${kind}:${entry.instance}`,kind});
  }
  return result;
}
export function syncPackageBenefits(build,catalogue=CATALOGUE) {
  const packages=assignedPackages(build),lookup=new Map(catalogue.map(d=>[d.id,d]));
  for(const e of build.entries)e.sources=e.sources.filter(s=>!isPackageSource(s));
  for(const {pack,source} of packages) {
    const visited=new Set();
    const add=(id,chain=false)=>{
      if(visited.has(id))return;visited.add(id);
      const d=lookup.get(id);if(!d)throw new Error(`Missing catalogue grant: ${id}`);
      if(chain)for(const req of d.requires??[])if(lookup.get(req)?.type==='power')add(req,true);
      addEntry(build,d,source);
    };
    for(const id of pack.grants??[])add(id);
    for(const id of pack.requiredPowers??[])add(id,true);
  }
  build.entries=build.entries.filter(e=>e.sources.length);
}
export function setPackage(build,field,value,packages,catalogue=CATALOGUE) {
  build[field]=value;
  const source=field==='originId'?'origin':'occupation',pack=packages.find(p=>p.id===value);
  build.identity[source]=pack?.name??'';
  syncPackageBenefits(build,catalogue);
}
export function derived(build) {
  const a=build.abilities, run=5+Math.floor(Math.max(0,a.agility)/5);
  // Core Rulebook p. 19: minimum maximum pool is 10, including zero/negative abilities.
  return {health:Math.max(10,a.resilience*30),focus:Math.max(10,a.vigilance*30),initiative:a.vigilance,
    run,climb:Math.ceil(run/2),swim:Math.ceil(run/2),jump:Math.ceil(run/2),karma:build.entries.some(e=>e.definition.id==='starter:heroic')?build.rank:0};
}
export function evaluate(build) {
  const errors=[],warnings=[], add=(message)=>errors.push(message);
  if(!build.name?.trim()) add('Enter a character name.');
  if(!Number.isInteger(build.rank)||build.rank<1||build.rank>6) add('Rank must be a whole number from 1 to 6.');
  for(const [key,value] of Object.entries(build.exchanges)) if(!Number.isInteger(value)||value<0) add(`The ${key} exchange must be a nonnegative whole number.`);
  const abilityBudget=5*build.rank+build.exchanges.abilities;
  const abilitySpent=ABILITIES.reduce((sum,k)=>sum+Number(build.abilities[k]),0);
  for(const k of ABILITIES) {
    const v=build.abilities[k];
    if(!Number.isInteger(v)||v< -3||v>build.rank+3) add(`${k}: use a whole number from -3 to ${build.rank+3}.`);
  }
  if(abilitySpent>abilityBudget) add(`Ability points exceed the budget by ${abilitySpent-abilityBudget}.`);
  const powers=build.entries.filter(e=>e.definition.type==='power');
  const sets=new Set(powers.flatMap(e=>e.definition.budgetSet?[e.definition.budgetSet]:e.definition.sets??[]).filter(s=>s && s!=='basic'));
  const thematic=Math.max(0,build.rank-sets.size), powerBudget=4*build.rank+thematic;
  const powerSpent=powers.length+build.exchanges.abilities+build.exchanges.traits;
  if(powerSpent>powerBudget) add(`Power picks exceed the budget by ${powerSpent-powerBudget}.`);
  const traits=build.entries.filter(e=>e.definition.type==='trait'&&!e.sources.some(s=>isPackageSource(s)||s==='granted')).length;
  const traitBudget=build.rank+build.exchanges.traits;
  if(traits>traitBudget) add(`Discretionary traits exceed the budget by ${traits-traitBudget}. Reconcile granted traits or exchanges.`);
  const selected=new Set(build.entries.flatMap(e=>[e.definition.id,e.definition.baseId].filter(Boolean)));
  const packages=assignedPackages(build),origins=packages.filter(p=>p.kind==='origin').map(p=>p.pack.id);
  const packageKeys=packages.map(p=>`${p.kind}:${p.pack.id}`);
  if(new Set(packageKeys).size!==packageKeys.length)add('Conflict: choose different additional origin/occupation packages.');
  const surprising=new Set(build.entries.filter(e=>e.definition.id==='core:surprising-power').map(e=>e.definition.surprisingPowerId));
  for(const {pack} of packages){
    for(const id of [...pack.grants??[],...pack.requiredPowers??[]])if(!selected.has(id))add(`Missing package benefit: ${pack.name} needs ${CORE_BY_ID.get(id)?.name??id}. Reapply package benefits on Backstory.`);
    if(pack.minRank&&build.rank<pack.minRank)add(`${pack.name} requires rank ${pack.minRank}.`);
    for(const group of pack.requiredAny??[])if(!group.some(id=>selected.has(id)))add(`${pack.name}: choose at least one of ${group.map(id=>CORE_BY_ID.get(id)?.name??id).join(' or ')} on Options.`);
  }
  if(selected.has('starter:heroic')&&build.entries.some(e=>['villainous','bloodthirsty'].includes(e.definition.name.trim().toLowerCase())||['core:villainous','core:bloodthirsty'].includes(e.definition.id)))add('Conflict: Heroic cannot be combined with Villainous or Bloodthirsty.');
  const allowed=new Set(['martialArts','meleeWeapons','rangedWeapons','shieldBearer','tactics']);
  for(const {definition:d} of build.entries) {
    if(d.minRank && build.rank<d.minRank&&!surprising.has(d.id)) add(`${d.name} requires rank ${d.minRank}.`);
    for(const id of d.requires??[]) if(!selected.has(id)) add(`${d.name} requires ${CORE_BY_ID.get(id)?.name??id.replace(/^(starter|core):/,'').replaceAll('-',' ')}.`);
    for(const group of d.requiresAny??[])if(!group.some(id=>selected.has(id)))add(`${d.name} requires ${group.map(id=>CORE_BY_ID.get(id)?.name??id).join(' or ')}.`);
    if(d.requiredOrigins&&!d.requiredOrigins.some(id=>origins.includes(id)))add(`${d.name} requires an appropriate origin: ${d.requiredOrigins.join(', ')}.`);
    if(d.detailType==='element'&&d.detail==='Hellfire'&&!selected.has('core:cursed'))add(`${d.name} requires Cursed to use Hellfire.`);
    if(d.detailPrompt&&!d.detail&&!d.packageId&&!d.surprisingPowerId)add(`Details needed: ${d.name}. Use Customize on Options.`);
    if(d.budgetSet&&!(d.sets??[]).includes(d.budgetSet))add(`${d.name} requires a valid power-set choice.`);
    if(origins.length===1&&origins[0]==='special-training'&&d.type==='power'&&!surprising.has(d.id)&&!((d.sets??[]).some(s=>allowed.has(s))||((d.sets??[]).every(s=>s==='basic')&&d.trainingAllowed===true)))add(`${d.name}: eligibility for Special Training must be resolved.`);
    if(origins.length===1&&d.type==='power'&&!surprising.has(d.id)){
      const pack=packages.find(p=>p.kind==='origin')?.pack;
      if(pack?.id==='spirit-of-vengeance') {
        const required=new Set(),visit=id=>{if(required.has(id))return;required.add(id);for(const r of CORE_BY_ID.get(id)?.requires??[])visit(r);};
        (pack.requiredPowers??[]).forEach(visit);
        const demonic=(d.sets??[]).includes('magic')&&((d.requires??[]).includes('core:cursed')||['core:brain-drain','core:leech-life','core:exorcism','core:sense-supernatural'].includes(d.id));
        const hellfire=(d.sets??[]).includes('elementalControl')&&(!d.detail||d.detail==='Hellfire');
        if(!required.has(d.id)&&!demonic&&!hellfire)add(`${d.name} requires another origin or a Surprising Power allocation.`);
        if((d.sets??[]).includes('elementalControl')&&d.detail&&d.detail!=='Hellfire')add(`${d.name} requires Hellfire for Spirit of Vengeance.`);
      }
      if(pack?.allowedPowers){
        const permitted=new Set(),visit=id=>{if(permitted.has(id))return;permitted.add(id);for(const r of CORE_BY_ID.get(id)?.requires??[])visit(r);};
        pack.allowedPowers.forEach(visit);
        if(!permitted.has(d.id))add(`${d.name} requires another origin or a Surprising Power allocation.`);
      }
    }
    if(!d.reviewed) warnings.push(`${d.name}: prerequisites, grants and exceptions need manual review.`);
    if(d.type==='power' && (d.sets??[]).length>1&&!d.budgetSet) warnings.push(`${d.name}: multiple power-set membership needs manual budget review.`);
  }
  if(!build.identity.origin?.trim()) warnings.push('No origin entered.');
  if(!build.identity.occupation?.trim()) warnings.push('No occupation entered.');
  if(packages.some(p=>p.pack.id==='custom')) warnings.push('Custom backstory: review all grants and restrictions manually.');
  for(const {pack} of packages)for(const note of pack.notes??[])warnings.push(`${pack.name}: ${note}`);
  const manual=build.entries.filter(e=>e.definition.automationMode==='reference'&&e.definition.type!=='tag').map(e=>e.definition.name);
  if(manual.length)warnings.push(`Manual gameplay effects and static bonuses: ${manual.join(', ')}. Rule text is included; apply these effects on the native sheet with the GM.`);
  warnings.push('Prototype coverage: special caps, advanced set counting, conditional effects, static power/trait bonuses and full book eligibility are not fully automated.');
  const stats=build.recalculate?derived(build):build.resources;
  for(const key of ['health','focus','initiative','run','climb','swim','jump','karma']) {
    if(!Number.isInteger(stats[key]) || (key!=='initiative' && stats[key]<0)) add(`${key}: enter a valid whole-number total${key==='initiative'?'':' of at least zero'}.`);
  }
  if(stats.health<10||stats.focus<10)add('Maximum Health and Focus must each be at least 10.');
  return {errors,warnings,abilityBudget,abilitySpent,abilityLeft:abilityBudget-abilitySpent,powerBudget,powerSpent,powerLeft:powerBudget-powerSpent,traitBudget,traits,traitLeft:traitBudget-traits,thematic,sets:[...sets],stats};
}
export function validateDraft(build) {
  if(!build||build.schema!==1||!Array.isArray(build.entries)||build.entries.length>500) throw new Error('Not a supported creator draft.');
  if(!build.abilities||!build.identity||!build.exchanges||!build.resources) throw new Error('Incomplete creator draft.');
  for(const e of build.entries) if(!e.instance||!e.definition?.id||!['power','trait','tag'].includes(e.definition.type)||!Array.isArray(e.sources)) throw new Error('Invalid selection in draft.');
  return build;
}

// Shared enforcement for UI controls and programmatic actions. Drafts may be
// incomplete, but ordinary edits cannot create overspending or illegal choices.
export function allocationErrors(build, complete=false) {
  const r=evaluate(build), errors=[];
  if(!Number.isInteger(build.rank)||build.rank<1||build.rank>6)errors.push('Rank must be a whole number from 1 to 6.');
  for(const k of ABILITIES)if(!Number.isInteger(build.abilities[k])||build.abilities[k]<-3||build.abilities[k]>build.rank+3)errors.push(`${k} must be between -3 and ${build.rank+3}.`);
  if(r.abilityLeft<0)errors.push(`Reduce ability allocations by ${-r.abilityLeft} points.`);
  if(complete&&r.abilityLeft>0)errors.push(`Spend all ${r.abilityLeft} remaining ability points before continuing.`);
  return errors;
}
export function selectionErrors(build) {
  return evaluate(build).errors.filter(e=>e.startsWith('Power picks')||e.startsWith('Discretionary traits')||e.includes(' requires ')||e.includes('eligibility for Special Training')||e.startsWith('Conflict:'));
}
export function additionErrors(build,definition) {
  const candidate=clone(build);addEntry(candidate,definition);if(['origin','occupation'].includes(definition.detailType)&&definition.packageId)syncPackageBenefits(candidate);
  return selectionErrors(candidate);
}
export function applyAbility(build,key,value) {
  if(!ABILITIES.includes(key)||!Number.isInteger(value)||value< -3||value>build.rank+3)throw new Error(`Ability scores must be whole numbers from -3 to ${build.rank+3} (rank + 3).`);
  const r=evaluate(build),total=r.abilitySpent-build.abilities[key]+value;
  if(total>r.abilityBudget && value>=build.abilities[key])throw new Error(`Only ${Math.max(0,r.abilityLeft)} ability points remain. Reduce another score first.`);
  build.abilities[key]=value;
}
export function abilityMaximum(build,key) {
  const r=evaluate(build);return Math.min(build.rank+3,r.abilityBudget-r.abilitySpent+build.abilities[key]);
}
export function applyRank(build,value) {
  if(!Number.isInteger(value)||value<1||value>6)throw new Error('Rank must be a whole number from 1 to 6.');
  const candidate=clone(build);candidate.rank=value;candidate.rankCap=6;
  const errors=[...allocationErrors(candidate),...selectionErrors(candidate)];
  if(errors.length)throw new Error(`Rank unchanged. Adjust your abilities and selected options before changing to rank ${value}: ${errors.join(' ')}`);
  build.rank=value;build.rankCap=6;
}
export function applyExchange(build,key,value) {
  if(!['abilities','traits'].includes(key)||!Number.isInteger(value)||value<0)throw new Error('Exchanged picks must be nonnegative whole numbers.');
  const candidate=clone(build);candidate.exchanges[key]=value;
  const errors=[...allocationErrors(candidate),...selectionErrors(candidate)];
  if(errors.length)throw new Error(errors.join(' '));
  build.exchanges[key]=value;
}
export function addAllowedEntry(build,definition) {
  const errors=additionErrors(build,definition);if(errors.length)throw new Error(errors.join(' '));
  const added=addEntry(build,definition);if(['origin','occupation'].includes(definition.detailType)&&definition.packageId)syncPackageBenefits(build);return added;
}
export function removeAllowedEntry(build,instance) {
  const entry=build.entries.find(e=>e.instance===instance);
  if(entry?.sources.some(isPackageSource))throw new Error('Change the backstory package to remove its grant.');
  const candidate=clone(build);candidate.entries=candidate.entries.filter(e=>e.instance!==instance);if(['origin','occupation'].includes(entry?.definition.detailType))syncPackageBenefits(candidate);
  const previous=new Set(selectionErrors(build));
  const errors=selectionErrors(candidate).filter(e=>!previous.has(e));if(errors.length)throw new Error(errors.join(' '));
  build.entries=candidate.entries;
}
export function navigationErrors(build,current,target) {
  if(target>1) return allocationErrors(build,true);
  if(target>current&&current===1)return allocationErrors(build,true);
  return [];
}
