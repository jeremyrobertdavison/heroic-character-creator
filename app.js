import {ID,LEGACY_ID,clone,uid,newBuild,addEntry,setPackage,validateDraft,derived} from './rules.js';
import {STARTER,ORIGINS,OCCUPATIONS} from './catalogue.js';
import {fromActor,fingerprint,definitionFromItem,planChanges,commit} from './adapter.js';
import {renderView,esc} from './view.js';
const {ApplicationV2}=foundry.applications.api;
export class CharacterCreator extends ApplicationV2 {
  static DEFAULT_OPTIONS={id:'heroic-character-creator-{id}',classes:['mcc-app'],tag:'section',window:{title:'Heroic Character Creator',resizable:true},position:{width:980,height:810}};
  constructor(actor=null) {
    super();this.actor=actor;this.baseline=actor?fingerprint(actor):null;
    this.build=actor?fromActor(actor):newBuild();this.catalogue=clone(STARTER);this.step=0;this.busy=false;
    this.recovering=false;this.saved=false;this.fileControllers=[];
    for(const e of this.build.entries) if(!this.catalogue.some(d=>d.id===e.definition.id)) this.catalogue.push(clone(e.definition));
  }
  get draftKey(){return `${ID}:${game.world.id}:${game.user.id}:${this.actor?.id??'new'}`;}
  changes() {
    const plan=planChanges(this.build,this.actor), raw=this.actor?.toObject(), changes=[];
    for(const [key,value] of Object.entries(plan.update)) {
      const old=key.split('.').reduce((o,k)=>o?.[k],raw);
      if(value!==old) changes.push(`${key.replace(/^system\./,'')}: ${old===undefined?'—':old} → ${value}`);
    }
    for(const a of plan.add) changes.push(`Add ${a.item.type}: ${a.item.name}`);
    for(const id of plan.remove) changes.push(`Remove: ${raw.items.find(i=>i._id===id)?.name??id}`);
    return changes;
  }
  async _prepareContext() {
    return {build:this.build,step:this.step,catalogue:this.catalogue,actor:this.actor,isGM:game.user.isGM,changes:this.changes(),busy:this.busy,
      packs:game.packs.filter(p=>p.documentName==='Item'&&p.visible).map(p=>({collection:p.collection,title:p.title??p.metadata.label}))};
  }
  async _renderHTML(context) {return renderView(context);}
  _replaceHTML(result,content) {content.innerHTML=result;}
  _onRender(context,options) {
    super._onRender(context,options);
    const root=this.element.querySelector('.mcc-shell');
    root.addEventListener('click',event=>{
      const button=event.target.closest('[data-cmd]');
      if(!button||button.disabled||this.busy)return;
      event.preventDefault();this.command(button.dataset.cmd,button).catch(error=>this.error(error));
    });
    root.addEventListener('change',event=>{
      const el=event.target;
      if(el.matches('[data-field]')) {
        const path=el.dataset.field, value=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;
        if(path==='originId'||path==='occupationId') setPackage(this.build,path,value,path==='originId'?ORIGINS:OCCUPATIONS,this.catalogue);
        else {
          if(path==='recalculate'&&!value) this.build.resources=derived(this.build);
          const parts=path.split('.');let obj=this.build;for(const key of parts.slice(0,-1))obj=obj[key];obj[parts.at(-1)]=value;
        }
        if(path!=='acknowledge'&&path!=='override') this.build.acknowledge=false;
        this.persist();clearTimeout(this.refreshTimer);this.refreshTimer=setTimeout(()=>this.render({force:true}),160);
      }
      if(el.matches('.mcc-options-file')) this.readFile(el, false).catch(e=>this.error(e));
      if(el.matches('.mcc-draft-file')) this.readFile(el, true).catch(e=>this.error(e));
      if(el.matches('.mcc-filter'))this.filter();
    });
    root.querySelector('.mcc-search')?.addEventListener('input',()=>this.filter());
    root.addEventListener('dragover',event=>event.preventDefault());
    root.addEventListener('drop',async event=>{
      event.preventDefault();if(this.busy)return;
      try {
        const data=JSON.parse(event.dataTransfer.getData('text/plain'));
        if(data.type!=='Item'||!data.uuid)throw new Error('Drop a native Item document here.');
        const item=await fromUuid(data.uuid);
        if(!item?.testUserPermission(game.user,'OBSERVER'))throw new Error('You cannot read this Item.');
        this.importItems([item]);this.persist();clearTimeout(this.refreshTimer);this.refreshTimer=setTimeout(()=>this.render({force:true}),160);
      }catch(error){this.error(error);}
    });
  }
  filter() {
    const q=this.element.querySelector('.mcc-search')?.value.toLowerCase()??'',type=this.element.querySelector('.mcc-filter')?.value??'';
    for(const row of this.element.querySelectorAll('.mcc-option'))row.hidden=(!row.dataset.search.includes(q))||(type&&row.dataset.type!==type);
  }
  persist() {
    try{localStorage.setItem(this.draftKey,JSON.stringify({format:ID,schema:1,actorUuid:this.actor?.uuid??null,baseline:this.baseline,build:this.build,savedAt:Date.now()}));return true;}
    catch{ui.notifications.warn('Browser draft storage is unavailable or full. Use Export draft.');return false;}
  }
  exportDraft() {
    const data={format:ID,schema:1,actorUuid:this.actor?.uuid??null,baseline:this.baseline,build:this.build};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`${this.build.name.replace(/[^a-z0-9_-]+/gi,'-')||'hero'}-creator-draft.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  loadDraft(data) {
    if(![ID,LEGACY_ID].includes(data.format))throw new Error('This is not a creator draft. Use Import JSON on Options for Actor or Item exports.');
    const build=validateDraft(clone(data.build));
    if(this.actor&&data.actorUuid!==this.actor.uuid)throw new Error('This draft belongs to another character. Open a new creator to import it as a new character.');
    if(this.actor && data.baseline!==fingerprint(this.actor))throw new Error('The character changed after this draft was saved. Import the draft into a new creator to make a copy, or reopen the current character to reconcile changes.');
    if(!this.actor)for(const entry of build.entries)delete entry.itemId;
    this.build=build;this.build.acknowledge=false;
    for(const e of build.entries)if(!this.catalogue.some(d=>d.id===e.definition.id))this.catalogue.push(clone(e.definition));
    this.persist();this.render({force:true});
  }
  async readFile(input,isDraft) {
    const file=input.files[0];if(!file)return;
    if(file.size>10*1024*1024)throw new Error('Please import a JSON export smaller than 10 MB.');
    const data=JSON.parse(await file.text());
    if(isDraft){this.loadDraft(data);return;}
    let items=Array.isArray(data)?data:data.items??[data];
    // Actor pack exports may contain Actors rather than Item documents.
    if(items.some(i=>Array.isArray(i.items)))items=items.flatMap(i=>i.items??[]);
    const count=this.importItems(items);
    if(!count)throw new Error('No supported powers, traits or tags found. JournalEntry exports contain reference text, not Items.');
    this.render({force:true});ui.notifications.info(`Loaded ${count} character options.`);
  }
  importItems(items) {
    let count=0;
    for(const item of items) {
      if(!['power','trait','tag'].includes(item.type))continue;
      const d=definitionFromItem(item,'Imported content — manual rules review');
      // New imports are unverified native content. Preserve their mechanics, never infer prerequisites from names.
      if(!this.catalogue.some(v=>v.id===d.id)){this.catalogue.push(d);count++;}
    }
    return count;
  }
  async command(cmd,button) {
    clearTimeout(this.refreshTimer);
    if(cmd==='step')this.step=Number(button.dataset.step);
    else if(cmd==='next')this.step=Math.min(4,this.step+1);
    else if(cmd==='back')this.step=Math.max(0,this.step-1);
    else if(cmd==='draft'){if(this.persist())ui.notifications.info('Draft saved on this browser.');return;}
    else if(cmd==='export'){this.exportDraft();return;}
    else if(cmd==='resume') {
      const data=localStorage.getItem(this.draftKey)??localStorage.getItem(this.draftKey.replace(ID,LEGACY_ID));if(!data)throw new Error('No saved draft for this character on this browser.');
      this.loadDraft(JSON.parse(data));return;
    }
    else if(cmd==='import-draft'){this.element.querySelector('.mcc-draft-file').click();return;}
    else if(cmd==='import-options'){this.element.querySelector('.mcc-options-file').click();return;}
    else if(cmd==='art') {
      const Picker=foundry.applications.apps?.FilePicker?.implementation??foundry.applications.apps?.FilePicker??globalThis.FilePicker;
      if(!Picker)throw new Error('Artwork browser is unavailable. Paste a Foundry image path in Portrait path.');
      const picker=new Picker({type:'image',current:this.build.img,callback:path=>{this.build.img=path;this.persist();this.render({force:true});}});
      picker.browse();return;
    }
    else if(cmd==='load') {
      const id=this.element.querySelector('.mcc-pack').value;
      this.busy=true;this.render({force:true});
      try {
        const pack=id==='world'?null:game.packs.get(id);
        if(pack&&!pack.visible)throw new Error('This compendium is not visible to you.');
        const docs=id==='world'?game.items.filter(i=>i.testUserPermission(game.user,'OBSERVER')):await pack.getDocuments();
        ui.notifications.info(`Loaded ${this.importItems(docs)} character options.`);
      } finally{this.busy=false;this.render({force:true});}
      return;
    }
    else if(cmd==='add') {const d=this.catalogue.find(d=>d.id===button.dataset.id);if(d)addEntry(this.build,d);this.build.acknowledge=false;}
    else if(cmd==='remove') {this.build.entries=this.build.entries.filter(e=>e.instance!==button.dataset.id);this.build.acknowledge=false;}
    else if(cmd==='grant') {
      const e=this.build.entries.find(e=>e.instance===button.dataset.id);
      if(e.sources.includes('granted'))e.sources=['choice'];else e.sources=['granted'];this.build.acknowledge=false;
    }
    else if(cmd==='custom') {
      const root=this.element,name=root.querySelector('.mcc-custom-name').value.trim(),type=root.querySelector('.mcc-custom-type').value;
      const description=root.querySelector('.mcc-custom-description').value,set=root.querySelector('.mcc-custom-set').value.trim()||'basic';
      if(!name)throw new Error('Enter a name for the custom option.');
      const validSets=['basic','elementalControl','healing','illusion','luck','magic','martialArts','meleeWeapons','omniversalTravel','phasing','plasticity','powerControl','rangedWeapons','resize','shieldBearer','sixthSense','spiderPowers','superSpeed','superStrength','tactics','telekenesis','telepathy','teleportation','translation','weatherControl'];
      if(type==='power'&&!validSets.includes(set))throw new Error('Unknown power-set key. Use one of: '+validSets.join(', '));
      const d={id:`custom:${uid()}`,name,type,sets:type==='power'?[set]:[],reviewed:false,source:'Custom option',description,
        item:{name,type,img:'icons/svg/book.svg',system:{description:`<p>${esc(description)}</p>`,...(type==='power'?{powerSets:[set]}:{})},effects:[]}};
      this.catalogue.push(d);addEntry(this.build,d);this.build.acknowledge=false;
    }
    else if(cmd==='save'||cmd==='copy') {
      if(this.step!==4)return;this.busy=true;await this.render({force:true});
      try {
        const result=await commit(this.build,this.actor,this.baseline,{copy:cmd==='copy'});
        this.saved=true;try{localStorage.removeItem(this.draftKey);}catch{}
        ui.notifications.info(`Saved ${result.actor.name}${result.backup?' with a recovery copy':''}.`);
        this.busy=false;await this.close();result.actor.sheet.render(true);
      } finally{this.busy=false;if(!this.saved)this.render({force:true});}
      return;
    }
    this.persist();this.render({force:true});
  }
  error(error){console.error(`${ID} |`,error);ui.notifications.error(error.message??String(error),{permanent:true});}
  async close(options={}) {if(this.busy)return this;clearTimeout(this.refreshTimer);if(!this.saved)this.persist();return super.close(options);}
}
