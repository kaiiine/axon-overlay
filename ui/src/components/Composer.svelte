<script lang="ts">
 import {tick} from 'svelte';
 import {model,setDraft,submit,demanderPicker} from '../model';
 import Icon from './Icon.svelte';
 import CommandSuggestions from './CommandSuggestions.svelte';
 import {nextIndex} from '../choices';
 const MAX_SUGGESTIONS=6;
 let selected=0;
 let input:HTMLTextAreaElement;
 $: draft=$model.draft;
 $: waitingForAnswer=$model.requests.length>0;
 $: commands=draft.startsWith('/')?$model.commands.filter(c=>c.cmd.toLowerCase().startsWith(draft.toLowerCase())).slice(0,MAX_SUGGESTIONS):[];
 $: offline=!$model.connected&&!$model.demo;
 $: if($model.view==='chat'&&!waitingForAnswer&&input)void tick().then(()=>input?.isConnected&&$model.view==='chat'&&!$model.requests.length&&input.focus());
 function pick(command:string){setDraft(command.split(' ')[0]+' ');selected=0;}
 function onInput(event:Event){selected=0;setDraft((event.currentTarget as HTMLTextAreaElement).value);}
 function navigateSuggestions(event:KeyboardEvent){
  event.preventDefault();
  if(event.key==='Tab')pick(commands[Math.min(selected,commands.length-1)].cmd);
  else selected=nextIndex(selected,event.key,commands.length);
 }
 function onKeydown(event:KeyboardEvent){
  if(event.isComposing)return;
  if(commands.length&&['ArrowDown','ArrowUp','Tab'].includes(event.key))return navigateSuggestions(event);
  if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();submit();}
 }
</script>
{#if commands.length}<CommandSuggestions {commands} {selected} onPick={pick}/>{/if}
<form class:waiting={waitingForAnswer} onsubmit={event=>{event.preventDefault();submit();}}>
 <label class="context" for="axon-message"><Icon name="arrow"/>{waitingForAnswer?'Ta réponse à Axon':'Nouvelle instruction'}</label>
 <div class="input-row">
 <button type="button" class="attach" title="Joindre un fichier" aria-label="Joindre un fichier" disabled={offline||$model.demo} onclick={demanderPicker}><Icon name="paperclip"/></button>
 <textarea id="axon-message" bind:this={input} rows="1" value={draft} oninput={onInput} onkeydown={onKeydown} placeholder={offline?'Connecte Axon pour commencer…':waitingForAnswer?'Ta réponse…':'Une idée, une question…'} aria-label="Message à Axon" title="Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne" disabled={$model.busy}></textarea>
 <button class="send" title="Envoyer" aria-label="Envoyer" disabled={!draft.trim()||offline||$model.busy}><Icon name="send"/></button>
 </div>
 <div class="composer-help"><span>/ pour les commandes</span><span>↵ envoyer</span></div>
</form>
<style>
form{padding:11px 12px 9px;border-radius:15px;background:linear-gradient(120deg,#ffffff0b,#ffffff04);border:1px solid #ffffff16;box-shadow:0 3px 12px #00000014,inset 0 1px 0 #ffffff06;transition:border-color 200ms;flex:none}form:focus-within{border-color:#e9bc7b66}.context{display:flex;gap:5px;align-items:center;color:#c6ae8c;font-size:10px;margin-bottom:7px}.context :global(.icon){width:11px;height:11px}.input-row{display:flex;align-items:center;gap:9px}.attach{width:28px;height:30px;flex:none;border-radius:8px;display:grid;place-items:center;color:var(--muted)}.attach:hover{background:#ffffff0a;color:var(--text)}.attach :global(.icon){width:14px;height:14px}textarea{width:100%;min-width:0;border:0;background:transparent;color:var(--text);font:13px/1.6 var(--font);resize:none;max-height:84px;field-sizing:content;appearance:none;border-radius:3px}textarea:focus-visible{outline:none}textarea::placeholder{color:#aaa5ad}.send{width:32px;height:32px;flex:none;border-radius:10px;display:grid;place-items:center;background:linear-gradient(140deg,#f3d39e,#cda261);color:#382716;box-shadow:inset 0 1px 0 #ffedc8,0 3px 12px #e0b77915}.composer-help{display:flex;justify-content:space-between;color:var(--muted);font-size:9px;margin-top:8px}@media(max-width:430px){textarea{font-size:16px}}
</style>
