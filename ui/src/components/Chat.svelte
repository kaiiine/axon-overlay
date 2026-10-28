<script lang="ts">
 import {onDestroy} from 'svelte';
 import {revelation} from '../fluidite';
 import {model,detacherPiece} from '../model';
 import MessageList from './MessageList.svelte';
 import RequestCard from './RequestCard.svelte';
 import TypingIndicator from './TypingIndicator.svelte';
 import AttachmentChip from './AttachmentChip.svelte';
 import Composer from './Composer.svelte';
 import ConversationHeader from './ConversationHeader.svelte';
 import SessionBar from './SessionBar.svelte';
 let live='';
 const reveal=revelation(text=>live=text);
 $: reveal.viser($model.enDirect,$model.motion);
 onDestroy(reveal.arreter);
 $: busyState=$model.state==='thinking'||$model.state==='working';
 $: typingLabel=$model.state==='working'?'Axon travaille':'Axon réfléchit';
 $: showTyping=busyState&&!$model.requests.length&&!live;
</script>
<div class="chat-body">
 <ConversationHeader/>
 <MessageList {live}>
  <RequestCard/>
  {#if showTyping}<TypingIndicator label={typingLabel}/>{/if}
 </MessageList>
 {#if $model.attachments.length}
  <div class="attachments" aria-label="Pièces jointes">
   {#each $model.attachments as a (a.nom)}
    <AttachmentChip nom={a.nom} statut={a.statut} message={a.message} taille={a.taille} onRemove={()=>detacherPiece(a.nom)}/>
   {/each}
  </div>
 {/if}
 <Composer/>
 <SessionBar/>
</div>
<style>
 .chat-body{display:flex;flex-direction:column;height:100%;gap:8px;min-height:0}
 .attachments{display:flex;flex-wrap:wrap;gap:6px;flex:none}
</style>
