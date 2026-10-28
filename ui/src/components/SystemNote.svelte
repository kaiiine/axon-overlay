<script lang="ts">
 export let text:string;
</script>
<div class="note" role="status"><span>{text}</span></div>
<style>
 .note{display:flex;justify-content:center;padding:6px 0;animation:enter 200ms var(--spring-soft) both}
 span{padding:3px 11px;border:1px solid #ffaf0024;border-radius:12px;background:#ffaf0008;font:10px var(--mono);color:#eed3a3}
 @keyframes enter{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:none}}
</style>
