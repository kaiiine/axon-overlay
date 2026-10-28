<script lang="ts">
 import Icon from './Icon.svelte';
 import {toolIcon} from '../toolIcon';
 export let name:string;
 export let detail='';
</script>
<div class="tool-event">
 <span class="tool-mark"><Icon name={toolIcon(name)}/></span>
 <b>{name}</b>
 {#if detail}<span class="tool-detail">{detail}</span>{/if}
</div>
<style>
 .tool-event{display:flex;align-items:center;gap:8px;padding:8px 2px;font-size:10px;color:var(--muted);animation:enter 180ms var(--spring-soft) both}
 b{font-weight:500;color:#b3acb1;flex:none}
 .tool-detail{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--faint)}
 .tool-mark{width:18px;height:18px;border-radius:6px;display:grid;place-items:center;background:#ffffff05;color:#b9ab96;flex:none}
 .tool-mark :global(.icon){width:10px;height:10px}
 @keyframes enter{0%{opacity:0;transform:translateX(-3px)}100%{opacity:1;transform:translateX(0)}}
</style>
