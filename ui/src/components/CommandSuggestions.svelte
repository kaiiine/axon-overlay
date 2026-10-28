<script lang="ts">
 import type {Command} from '../types';
 export let commands:Command[];
 export let selected:number;
 export let onPick:(command:string)=>void;
</script>
<div class="commands" aria-label="Suggestions de commandes">
 {#each commands as command,i}
  <button class:selected={i===selected} onclick={()=>onPick(command.cmd)}><b>{command.cmd}</b><span>{command.desc}</span></button>
 {/each}
</div>
<style>
 .commands{flex:none;max-height:112px;overflow:auto;border:1px solid #ffffff12;border-radius:17px;padding:6px;background:#242332e8}
 button{display:flex;gap:10px;padding:6px 8px;width:100%;text-align:left;font-size:10px;border-radius:5px}
 b{color:#e1b867;font:10px var(--mono)}
 span{color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 button.selected,button:hover{background:#ffffff08}
</style>
