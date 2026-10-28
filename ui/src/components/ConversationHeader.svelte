<script lang="ts">
 import {model,navigate,close,ouvrirEtudes} from '../model';
 import Icon from './Icon.svelte';
 $: label=$model.requests.length?'J’ai besoin de ton accord':!$model.connected&&!$model.demo?'Hors connexion':$model.state==='thinking'?'Je réfléchis':$model.state==='working'?'Je m’en occupe':$model.state==='finished'?'C’est prêt':'À ton écoute';
</script>
<div class="conversation-header">
 <div class="identity"><div class="name">axon<span>PERSONAL ASSISTANT</span></div><span class="presence" role="status"><i class:offline={!$model.connected&&!$model.demo}></i>{label}</span></div>
 <button class="minimize" onclick={close} title="Réduire l’overlay" aria-label="Réduire l’overlay"><span aria-hidden="true">−</span></button>
</div>
<nav class="conversation-nav" aria-label="Navigation de la conversation">
 <span class="selected"><Icon name="chat"/>Conversation</span>
 <button onclick={()=>navigate('code')}><Icon name="code"/>Fichiers{#if $model.file}<span class="count">1</span>{/if}</button>
 <div class="utilities"><button onclick={()=>navigate('home')} title="Accueil" aria-label="Accueil Axon"><Icon name="home"/></button><button onclick={ouvrirEtudes} title="Études" aria-label="Mes études"><Icon name="book"/></button><button onclick={()=>navigate('settings')} title="Réglages" aria-label="Réglages Axon"><Icon name="settings"/></button></div>
</nav>
<style>
 .conversation-header{display:flex;align-items:center;gap:10px;min-height:66px;padding:4px 1px 4px 77px;flex:none}.identity{flex:1;min-width:0}.name{display:flex;align-items:center;gap:14px;font-size:21px;letter-spacing:-.8px;font-weight:500}.name>span{font-size:8px;letter-spacing:1.4px;color:var(--muted);font-weight:400}.presence{display:flex;align-items:center;gap:6px;color:#beb5a8;font-size:11px;margin-top:4px}i{width:4px;height:4px;border-radius:50%;background:var(--accent)}i.offline{background:#a7a7b0}.minimize{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;font-size:20px;color:var(--muted)}button:hover{background:#ffffff09;color:var(--text)}
 .conversation-nav{display:flex;align-items:center;gap:4px;border-bottom:1px solid var(--line);padding-bottom:9px;flex:none}.conversation-nav>button,.selected{display:flex;align-items:center;gap:7px;padding:8px 9px;border-radius:8px;color:var(--muted);font-size:11px}.selected{background:#ffffff09;color:#f0e7d7}.count{font:10px var(--mono);padding:1px 5px;border-radius:4px;background:#ffffff0a}.utilities{display:flex;margin-left:auto;gap:2px}.utilities button{display:grid;place-items:center;width:30px;height:30px;border-radius:8px;color:var(--muted)}.conversation-nav :global(.icon){width:14px;height:14px}@media(max-width:430px){.name>span{display:none}.conversation-nav>button,.selected{padding:8px 6px;font-size:10px}.utilities button{width:27px}}
</style>
