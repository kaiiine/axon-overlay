<script lang="ts">
 export let label:string;
</script>
<div class="typing" role="status"><i></i><i></i><i></i><span>{label}</span></div>
<style>
 .typing{display:flex;align-items:center;gap:4px;color:#e8c795;font-size:11px;min-height:38px;margin:12px 0 6px;padding:12px 2px;border-top:1px solid var(--line);flex:none}
 span{margin-left:5px}
 i{width:3px;height:3px;border-radius:50%;background:var(--accent);animation:pulse 1.2s ease-in-out infinite}
 i:nth-child(2){animation-delay:.15s}
 i:nth-child(3){animation-delay:.3s}
 @keyframes pulse{50%{opacity:.35}}
</style>
