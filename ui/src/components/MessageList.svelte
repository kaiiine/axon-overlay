<script lang="ts">
 import {tick} from 'svelte';
 import Icon from './Icon.svelte';
 import {model} from '../model';
 import ChatWelcome from './ChatWelcome.svelte';
 import ChatMessage from './ChatMessage.svelte';
 import ToolEvent from './ToolEvent.svelte';
 import SystemNote from './SystemNote.svelte';
 export let live='';
 let log:HTMLDivElement;
 let following=true;
 let showLatest=false;
 function updateScroll(){following=log.scrollHeight-log.scrollTop-log.clientHeight<80;showLatest=!following;}
 function latest(){log.scrollTop=log.scrollHeight;updateScroll();}
 $: size=$model.messages.length+live.length+$model.requests.length;
 $: if(size&&log)followBottom(log);
 function followBottom(target:HTMLElement){
  const shouldFollow=following;
  void tick().then(()=>{if(shouldFollow&&target.isConnected)target.scrollTop=target.scrollHeight;});
 }
</script>
<div class="transcript">
<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users must be able to scroll the transcript.) -->
<div class="log" onscroll={updateScroll} bind:this={log} role="log" aria-label="Conversation avec Axon" aria-live="polite" tabindex="0">
 {#if !$model.messages.length&&!live&&!$model.requests.length}<ChatWelcome/>{/if}
 {#each $model.messages as message (message.id)}
  {#if message.who==='outil'}
   <ToolEvent name={message.text} detail={message.detail}/>
  {:else if message.who==='systeme'}
   <SystemNote text={message.text}/>
  {:else}
   <ChatMessage author={message.who} text={message.text} mine={message.who==='toi'}/>
  {/if}
 {/each}
 {#if live}<ChatMessage author="axon" text={live} streaming/>{/if}
 <slot/>
</div>
{#if showLatest}<button class="latest" onclick={latest}><Icon name="chevron"/>Derniers messages</button>{/if}
</div>
<style>
 .transcript{position:relative;flex:1;min-height:0;display:flex}.latest{position:absolute;bottom:4px;left:50%;transform:translateX(-50%);display:flex;gap:5px;align-items:center;background:#33313b;border:1px solid #ffca7040;padding:7px 12px;border-radius:20px;font-size:10px;white-space:nowrap;box-shadow:0 4px 12px #0004}.latest:active:not(:disabled){transform:translateX(-50%)}.latest :global(.icon){width:12px;height:12px;transform:rotate(90deg)}
 .log{flex:1;outline-offset:-2px;min-height:0;overflow:auto;padding:0 2px 4px}

</style>
