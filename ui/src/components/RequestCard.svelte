<script lang="ts">
 import {model} from '../model';
 import Icon from './Icon.svelte';
 import QuestionPrompt from './QuestionPrompt.svelte';
 $: request=$model.requests[0];
 $: step=request?request.answers.length+1:0;
 $: waiting=$model.requests.length;
</script>
{#if request&&!$model.popup}
 <aside class="request" aria-live="polite">
  <div class="label">
   <Icon name="shield"/>{request.legacy||request.genre==='permission'?'À VALIDER':'À TOI DE CHOISIR'}
   <small>Étape {step}/{request.questions.length}{#if waiting>1} · {waiting} demandes{/if}</small>
  </div>
  {#key `${request.id}:${request.answers.length}`}<QuestionPrompt {request}/>{/key}
 </aside>
{/if}
<style>
.request{margin:16px 0 8px;padding:15px;background:linear-gradient(125deg,#3a332bd9,#302d2bbf);border:1px solid #d3ae7540;border-radius:15px;box-shadow:inset 0 1px 0 #edc78c14;animation:arrive 200ms var(--spring-soft) both}.label{display:flex;align-items:center;gap:6px;font-size:9px;letter-spacing:1px;color:#e7c38e}.label :global(.icon){width:14px;height:14px}small{margin-left:auto;color:#c0ad92;font-size:9px;letter-spacing:0}@keyframes arrive{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
</style>
