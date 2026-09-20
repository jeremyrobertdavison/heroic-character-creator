import {ID,LEGACY_ID} from './rules.js';
import {CharacterCreator} from './app.js';
const openWindows=new Map();
export function openCreator(actor=null) {
  if(game.system.id!=='mvrpg')return ui.notifications.error('This creator requires the mvrpg game system.');
  if(actor&&(actor.type!=='super'||actor.isToken))return ui.notifications.warn('Open a super character from the Actors directory. Unlinked token Actors are not supported.');
  if(actor&&!actor.isOwner&&!game.user.isGM)return ui.notifications.warn('You must own this character.');
  if(!actor&&!game.user.can('ACTOR_CREATE'))return ui.notifications.warn('Your Foundry role needs Create Actor permission to create a character.');
  const key=actor?.uuid??'new',existing=openWindows.get(key);
  if(existing?.rendered){existing.bringToFront();return existing;}
  const app=new CharacterCreator(actor);openWindows.set(key,app);app.render({force:true});return app;
}
function addButton(container,label,onClick,className) {
  if(!container||container.querySelector(`.${className}`))return;
  const button=document.createElement('button');button.type='button';button.className=`${className} mcc-launch`;
  button.innerHTML='<i class="fas fa-user-pen" aria-hidden="true"></i> ';button.append(document.createTextNode(label));
  button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();onClick();});container.append(button);
}
Hooks.once('init',()=>{
  class CreatorMenu extends foundry.applications.api.ApplicationV2 {
    render(){openCreator();return this;}
  }
  game.settings.registerMenu(ID,'open',{name:'Character Creator',label:'Open Character Creator',hint:'Create a new character. Existing characters have an Open Creator button on their sheets.',icon:'fas fa-user-pen',type:CreatorMenu,restricted:false});
});
Hooks.once('ready',()=>{
  if(game.modules.get(LEGACY_ID)?.active)ui.notifications.warn('Disable the earlier Character Creator module before using Heroic Character Creator.');
  game.modules.get(ID).api={open:openCreator,create:()=>openCreator(),version:'0.1.1'};
  if(game.system.id!=='mvrpg')return;
  ui.actors?.render({force:true});
});
// ApplicationV2 hooks pass HTMLElements; older sidebar hooks may still pass jQuery.
function rootOf(html){return html instanceof HTMLElement?html:html?.[0];}
function directory(app,html){
  if(game.system.id!=='mvrpg'||!game.user.can('ACTOR_CREATE'))return;
  const root=rootOf(html),host=root?.querySelector('.directory-header')??root?.querySelector('.header-actions')??root;
  addButton(host,'Create Character',()=>openCreator(),'mcc-directory-launch');
}
Hooks.on('renderActorDirectory',directory);
Hooks.on('renderActorSheetV2',(app,html)=>{
  const actor=app.document;
  if(game.system.id!=='mvrpg'||actor?.type!=='super'||(!actor.isOwner&&!game.user.isGM)||actor.isToken)return;
  const root=rootOf(html);
  addButton(root?.querySelector('.window-header')??root?.querySelector('.window-content'),'Open Creator',()=>openCreator(actor),'mcc-sheet-launch');
});
// Explicit system sheet hook protects against systems restricting parent hook propagation.
Hooks.on('renderSuperSheet',(app,html)=>{
  const actor=app.document??app.actor;
  if(game.system.id!=='mvrpg'||actor?.type!=='super'||(!actor.isOwner&&!game.user.isGM)||actor.isToken)return;
  const root=rootOf(html);
  addButton(root?.querySelector('.window-header')??root?.querySelector('.window-content'),'Open Creator',()=>openCreator(actor),'mcc-sheet-launch');
});
