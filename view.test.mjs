import test from 'node:test';
import assert from 'node:assert/strict';
import {newBuild} from '../scripts/rules.js';
import {STARTER} from '../scripts/catalogue.js';
import {renderView,esc} from '../scripts/view.js';
test('all five panels render with their primary controls',()=>{
 const expected=['Portrait path','abilities.melee','originId','Import JSON','Create Character'];
 for(let step=0;step<5;step++){const html=renderView({build:newBuild(),step,catalogue:STARTER,isGM:true});assert(html.includes(expected[step]));assert(html.includes('PROTOTYPE 0.1'));assert(!html.includes('undefined'));}
});
test('untrusted character names, descriptions and source titles are escaped',()=>{
 const b=newBuild();b.name='<img src=x onerror=alert(1)>';const html=renderView({build:b,step:3,catalogue:[{id:'x',name:'<script>bad()</script>',type:'trait',source:'<b>source</b>',description:'<iframe src=x>',sets:[]}],packs:[{collection:'x"onclick="bad()',title:'<iframe>'}]});
 assert(!html.includes('<script>'));assert(!html.includes('<iframe'));assert(!html.includes('<img src=x'));assert(html.includes('&lt;script&gt;'));assert.equal(esc('"<&'), '&quot;&lt;&amp;');
});
test('existing-character save is disabled for players and copy stays available',()=>{
 const actor={system:{lifepool:{health:{value:0},focus:{value:0}}}};const html=renderView({build:newBuild(),step:4,catalogue:STARTER,actor,isGM:false});
 assert.match(html,/data-cmd="save" disabled/);assert(html.includes('Save as New Character'));assert(!html.includes('GM exception reason'));
});
test('rank-cap selector and GM exception are absent; unavailable powers are disabled',()=>{
 const b=newBuild();const first=renderView({build:b,step:0,catalogue:STARTER,isGM:true});assert(!first.includes('data-field="rankCap"'));
 const review=renderView({build:b,step:4,catalogue:STARTER,isGM:true});assert(!review.includes('data-field="override"'));
 const options=renderView({build:b,step:3,catalogue:STARTER,isGM:true});assert.match(options,/data-id="starter:change-of-plans"[^>]*disabled/);assert(options.includes('requires rank 2'));
});
