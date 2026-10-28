<script lang="ts">
 import {setDraft} from '../model';
 import Icon from './Icon.svelte';
 const suggestions=[{icon:'code',label:'Mon projet',prompt:'Aide-moi à améliorer mon projet.'},{icon:'spark',label:'Ma journée',prompt:'Aide-moi à organiser ma journée.'}];
</script>
<div class="welcome"><span class="eyebrow">UNE IDÉE SUFFIT</span><h2>Un peu de clarté.<br/>Un peu d’élan.</h2><p>Qu’est-ce qu’on fait avancer ensemble ?</p><div class="suggestions">{#each suggestions as item}<button onclick={()=>setDraft(item.prompt)}><Icon name={item.icon}/>{item.label}<Icon name="arrow"/></button>{/each}</div></div>
<style>
 .welcome{display:flex;flex-direction:column;justify-content:center;min-height:200px;height:100%;padding:14px 5px}.eyebrow{font-size:9px;letter-spacing:1.6px;color:#c2a881}h2{font-size:30px;line-height:1.2;font-weight:400;letter-spacing:-1.2px;color:#ede5da;margin:13px 0}p{font-size:12px;color:var(--muted);line-height:1.6}.suggestions{display:flex;flex-wrap:wrap;gap:9px;margin-top:24px}button{display:flex;align-items:center;gap:9px;border:1px solid var(--line);border-radius:10px;padding:11px 12px;font-size:11px;color:#cbc3b9;flex:1;text-align:left;white-space:nowrap}button:hover{background:#e9bc7b0a;border-color:#e9bc7b40}button :global(.icon){width:14px;height:14px}button :global(.icon:last-child){margin-left:auto;width:12px;color:#b39c7c}
</style>
