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
    recalculate:true,resources:{health:0,focus:0,initiative:0,run:5,climb:3,swim:3,jump:3,karma:1},
    acknowledge:false,override:''};
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
export function setPackage(build, field, value, packages, catalogue) {
  const source=field==='originId'?'origin':'occupation';
  for(const entry of build.entries) entry.sources=entry.sources.filter(s=>s!==source);
  build.entries=build.entries.filter(e=>e.sources.length);
  build[field]=value;
  const pack=packages.find(p=>p.id===value);
  build.identity[source]=pack?.name ?? '';
  for(const id of pack?.grants??[]) {
    const definition=catalogue.find(d=>d.id===id);
    if(!definition) throw new Error(`Missing catalogue grant: ${id}`);
    addEntry(build,definition,source);
  }
}
export function derived(build) {
  const a=build.abilities, run=5+Math.floor(Math.max(0,a.agility)/5);
  // Nonpositive Health/Focus ability handling requires manual confirmation in this prototype.
  return {health:Math.max(0,a.resilience*30),focus:Math.max(0,a.vigilance*30),initiative:a.vigilance,
    run,climb:Math.ceil(run/2),swim:Math.ceil(run/2),jump:Math.ceil(run/2),karma:build.rank};
}
export function evaluate(build) {
  const errors=[],warnings=[], add=(message)=>errors.push(message);
  if(!build.name?.trim()) add('Enter a character name.');
  if(!Number.isInteger(build.rank)||build.rank<1||build.rank>6) add('Rank must be a whole number from 1 to 6.');
  if(!Number.isInteger(build.rankCap)||build.rankCap<build.rank||build.rankCap>6) add('Rank cap must be between the current rank and 6.');
  for(const [key,value] of Object.entries(build.exchanges)) if(!Number.isInteger(value)||value<0) add(`The ${key} exchange must be a nonnegative whole number.`);
  const abilityBudget=5*build.rank+build.exchanges.abilities;
  const abilitySpent=ABILITIES.reduce((sum,k)=>sum+Number(build.abilities[k]),0);
  for(const k of ABILITIES) {
    const v=build.abilities[k];
    if(!Number.isInteger(v)||v< -3||v>build.rank+3) add(`${k}: use a whole number from -3 to ${build.rank+3}. Exceptional caps need a GM override.`);
  }
  if(abilitySpent>abilityBudget) add(`Ability points exceed the budget by ${abilitySpent-abilityBudget}.`);
  const powers=build.entries.filter(e=>e.definition.type==='power');
  const sets=new Set(powers.flatMap(e=>e.definition.sets??[]).filter(s=>s && s!=='basic'));
  const thematic=Math.max(0,build.rank-sets.size), powerBudget=4*build.rank+thematic;
  const powerSpent=powers.length+build.exchanges.abilities+build.exchanges.traits;
  if(powerSpent>powerBudget) add(`Power picks exceed the budget by ${powerSpent-powerBudget}.`);
  const traits=build.entries.filter(e=>e.definition.type==='trait'&&!e.sources.some(s=>s==='origin'||s==='occupation'||s==='granted')).length;
  const traitBudget=build.rank+build.exchanges.traits;
  if(traits>traitBudget) add(`Discretionary traits exceed the budget by ${traits-traitBudget}. Reconcile granted traits or exchanges.`);
  const selected=new Set(build.entries.map(e=>e.definition.id));
  const allowed=new Set(['martialArts','meleeWeapons','rangedWeapons','shieldBearer','tactics']);
  for(const {definition:d} of build.entries) {
    if(d.minRank && build.rank<d.minRank) add(`${d.name} requires rank ${d.minRank}.`);
    for(const id of d.requires??[]) if(!selected.has(id)) add(`${d.name} requires ${id.replace(/^starter:/,'').replaceAll('-',' ')}.`);
    if(build.originId==='special-training'&&d.type==='power'&&((d.sets??[]).some(s=>s!=='basic'&&!allowed.has(s)) || ((d.sets??[]).every(s=>s==='basic') && d.trainingAllowed!==true))) add(`${d.name}: eligibility for Special Training must be resolved (or overridden by the GM).`);
    if(!d.reviewed) warnings.push(`${d.name}: prerequisites, grants and exceptions need manual review.`);
    if(d.type==='power' && (d.sets??[]).length>1) warnings.push(`${d.name}: multiple power-set membership needs manual budget review.`);
  }
  if(!build.identity.origin?.trim()) warnings.push('No origin entered.');
  if(!build.identity.occupation?.trim()) warnings.push('No occupation entered.');
  if(build.originId==='custom'||build.occupationId==='custom') warnings.push('Custom backstory: review all grants and restrictions manually.');
  if(build.abilities.resilience<=0||build.abilities.vigilance<=0) warnings.push('Nonpositive Resilience or Vigilance: confirm Health/Focus with the rulebook and enter manual totals.');
  warnings.push('Prototype coverage: special caps, advanced set counting, conditional effects, static power/trait bonuses and full book eligibility are not fully automated.');
  const stats=build.recalculate?derived(build):build.resources;
  for(const key of ['health','focus','initiative','run','climb','swim','jump','karma']) {
    if(!Number.isInteger(stats[key]) || (key!=='initiative' && stats[key]<0)) add(`${key}: enter a valid whole-number total${key==='initiative'?'':' of at least zero'}.`);
  }
  return {errors,warnings,abilityBudget,abilitySpent,abilityLeft:abilityBudget-abilitySpent,powerBudget,powerSpent,powerLeft:powerBudget-powerSpent,traitBudget,traits,traitLeft:traitBudget-traits,thematic,sets:[...sets],stats};
}
export function validateDraft(build) {
  if(!build||build.schema!==1||!Array.isArray(build.entries)||build.entries.length>500) throw new Error('Not a supported creator draft.');
  if(!build.abilities||!build.identity||!build.exchanges||!build.resources) throw new Error('Incomplete creator draft.');
  for(const e of build.entries) if(!e.instance||!e.definition?.id||!['power','trait','tag'].includes(e.definition.type)||!Array.isArray(e.sources)) throw new Error('Invalid selection in draft.');
  return build;
}
