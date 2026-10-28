<script lang="ts">
 import {onMount} from 'svelte';
 import {AUTRE,defaultIndex,indexFromDigit,nextIndex} from '../choices';
 export let choices:string[];
 export let primary='';
 export let disabled=false;
 export let onChoose:(choice:string)=>void;
 let buttons:HTMLButtonElement[]=[];
 const focusAt=(index:number)=>buttons[index]?.focus();
 const currentIndex=()=>buttons.findIndex(button=>button===document.activeElement);
 onMount(()=>focusAt(defaultIndex(choices,primary)));
 function onKeydown(event:KeyboardEvent){
  if(event.isComposing||disabled)return;
  const digit=indexFromDigit(event.key,choices.length);
  if(digit>=0){event.preventDefault();onChoose(choices[digit]);return;}
  const target=nextIndex(currentIndex(),event.key,choices.length);
  if(target===currentIndex())return;
  event.preventDefault();
  focusAt(target);
 }
</script>
<div class="choices" role="toolbar" tabindex="-1" aria-label="Réponses" onkeydown={onKeydown}>
 {#each choices as choice,i}
  <button bind:this={buttons[i]} style={`--i:${i}`} data-key={i<9?i+1:''} class:primary={choice===primary} class:autre={choice===AUTRE} {disabled} onclick={()=>onChoose(choice)}>{choice}</button>
 {/each}
</div>
<style>
 .choices{display:flex;flex-wrap:wrap;gap:6px;padding:2px 1px 3px;margin-top:9px}
 button{display:inline-flex;align-items:center;gap:7px;max-width:100%;font-size:11px;line-height:1.35;text-align:left;min-height:34px;padding:8px 12px;border:1px solid #ffffff14;border-radius:10px;background:#ffffff08;animation:enter 180ms calc(var(--i) * 25ms) var(--spring) both;transition:transform 150ms var(--spring),background 150ms,border-color 150ms}
 button::before{content:attr(data-key);font:9px var(--mono);color:var(--faint)}
 button:hover:not(:disabled){background:#ffffff12;border-color:#ffffff22;transform:translateY(-1px)}
 button:focus-visible{outline:none;border-color:#ffaf0099;box-shadow:0 0 0 3px #ffaf0022}
 button.primary{background:#e2bb80;color:#33271a;border-color:#e2bb80;box-shadow:inset 0 1px 0 #f6dbaf55}
 button.primary::before{color:#30200099}
 button.primary:hover:not(:disabled){background:#f0cd98}
 button.autre{color:var(--muted);border-style:dashed}
 @keyframes enter{0%{opacity:0;transform:translateY(6px) scale(.92)}100%{opacity:1;transform:none}}
</style>
