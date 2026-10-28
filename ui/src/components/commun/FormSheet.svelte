<script lang="ts">
 import {onMount} from 'svelte';
 import Icon from '../Icon.svelte';
 export let titre:string;
 export let sousTitre='';
 export let busy=false;
 export let onClose:()=>void;
 let dialog:HTMLDialogElement;
 onMount(()=>{
  const previous=document.activeElement as HTMLElement|null;
  if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
  return ()=>{if(previous?.isConnected)previous.focus();};
 });
 function escape(event:KeyboardEvent){if(event.key==='Escape'){event.stopPropagation();event.preventDefault();if(!busy)onClose();}}
</script>
<dialog bind:this={dialog} class="form-sheet" aria-label={titre} oncancel={event=>{event.preventDefault();if(!busy)onClose();}} onkeydown={escape}>
 <header><div><span>UN NOUVEAU POINT DE DÉPART</span><h2>{titre}</h2>{#if sousTitre}<p>{sousTitre}</p>{/if}</div><button class="close" aria-label={`Fermer ${titre.toLowerCase()}`} disabled={busy} onclick={onClose}><Icon name="close"/></button></header>
 <div class="fields"><slot/></div>
 <footer><slot name="footer"/></footer>
</dialog>
<style>
 .form-sheet{position:fixed;inset:48px 14px 14px;margin:0;width:calc(100% - 28px);height:calc(100% - 62px);max-width:none;max-height:none;padding:13px 17px 11px;color:var(--text);border:1px solid #ddc69a42;border-radius:19px;background:radial-gradient(ellipse at 0% 0%,#caaa7620,transparent 60%),#292831;box-shadow:0 16px 50px #0006,inset 0 1px 0 #ffedce12;overflow:hidden;flex-direction:column;gap:9px}.form-sheet[open]{display:flex}.form-sheet::backdrop{background:#12101855;backdrop-filter:blur(5px)}header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex:none}header span{font-size:7px;letter-spacing:1.5px;color:#c8ad84}h2{font-size:18px;letter-spacing:-.5px;font-weight:400;margin-top:3px}p{font-size:10px;color:var(--muted);margin-top:4px}.close{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;color:var(--muted)}.close:hover{background:#ffffff0b}.close :global(.icon){width:12px;height:12px}.fields{flex:1;min-height:0;overflow:auto;padding:2px}.fields :global(.form-grid){display:grid;grid-template-columns:1.5fr 1fr;gap:8px 12px}.fields :global(label){display:flex;flex-direction:column;gap:4px;font-size:9px;color:#c3b4c7}.fields :global(input),.fields :global(select){width:100%;min-width:0;border:1px solid #ffffff18;background:#ffffff06;color:var(--text);font:11px/1.4 var(--font);padding:7px 9px;border-radius:8px;accent-color:var(--accent)}.fields :global(input:focus),.fields :global(select:focus){border-color:#daba8266}.fields :global(.wide){grid-column:1/-1}.fields :global(.erreur){font-size:10px;color:#efa7a0;margin-top:6px}footer{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex:none;padding-top:8px;border-top:1px solid #ffffff0c}footer :global(button){display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:10px;padding:7px 12px;border-radius:8px;color:var(--muted)}footer :global(.send){background:linear-gradient(135deg,#eed0a0,#cda777);color:#302318;box-shadow:inset 0 1px 0 #ffebc15c}footer :global(.icon){width:12px;height:12px}@media(max-width:480px){.form-sheet{padding:11px;gap:7px}.fields :global(.form-grid){grid-template-columns:1fr}h2{font-size:16px}}
</style>
