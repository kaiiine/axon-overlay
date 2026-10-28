<script lang="ts">
 import {model,answer,chooseFreeform} from '../model';
 import {AUTRE,choicesFor} from '../choices';
 import ChoiceList from './ChoiceList.svelte';
 import FreeformAnswer from './FreeformAnswer.svelte';
 import type {Request} from '../types';
 export let request:Request;
 $: question=request.questions[request.answers.length];
 $: choices=choicesFor(question,request.genre);
 $: busy=$model.busy||(!$model.connected&&!$model.demo);
 $: showFreeform=request.freeform===true||!choices.length;
 const choose=(choice:string)=>choice===AUTRE?chooseFreeform():answer(choice);
</script>
{#if question}
 <p class="texte">{question.texte}</p>
 {#if request.apercu}<details open><summary>Aperçu de l’action</summary><pre>{request.apercu}</pre></details>{/if}
 {#if showFreeform}
  <FreeformAnswer disabled={busy} onSubmit={answer} placeholder={request.freeform?'Précise ta réponse…':'Ta réponse…'}/>
 {:else}
  <ChoiceList {choices} primary={question.affirmatif} disabled={busy} onChoose={choose}/>
 {/if}
{/if}
<style>
.texte{font-size:13px;line-height:1.65;margin:12px 0 9px;color:#eee5d9}details{border-top:1px solid #ffffff0c;border-bottom:1px solid #ffffff0c;margin:10px 0}summary{font:10px var(--mono);color:#d5c7b4;cursor:pointer;padding:10px 0}summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:10px/1.8 var(--mono);color:#d7cbb8;background:#0002;padding:9px;border-radius:8px;max-height:140px;overflow:auto;margin-bottom:9px}
</style>
