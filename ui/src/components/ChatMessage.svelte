<script lang="ts">
 import Markdown from './Markdown.svelte';
 export let author:string;
 export let text:string;
 export let mine=false;
 export let streaming=false;
</script>
<article class:mine class:streaming aria-label={mine?'Toi':author}>
 {#if !mine}<div class="author"><span></span>Axon{#if streaming}<small>en cours</small>{/if}</div>{/if}
 <Markdown source={text}/>
</article>
<style>
 article{padding:12px 3px;line-height:1.7;font-size:13px;animation:enter 180ms var(--spring-soft) both;overflow-wrap:anywhere}article.streaming{animation:none}
 .author{display:flex;align-items:center;gap:6px;font-size:9px;letter-spacing:1.6px;text-transform:uppercase;font-weight:400;color:var(--accent);margin-bottom:7px}.author span{width:23px;height:1px;order:1;background:#e9bc7b35}small{margin-left:auto;font-size:9px;font-weight:400;color:var(--muted)}
 .mine{margin:10px 0 4px auto;width:fit-content;max-width:87%;background:linear-gradient(120deg,#ffffff14,#ffffff09);border:1px solid #ffffff12;border-radius:14px 14px 4px 14px;padding:9px 13px;color:#eeeef2}
 .streaming :global(.md > :last-child)::after{content:'';display:inline-block;width:5px;height:12px;margin-left:4px;vertical-align:-1px;border-radius:2px;background:var(--accent);animation:caret 1s steps(2,start) infinite}
 @keyframes enter{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}@keyframes caret{to{visibility:hidden}}
</style>
