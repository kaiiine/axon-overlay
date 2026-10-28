<script lang="ts">
 import {renderMarkdown} from '../markdown';
 export let source:string;
</script>
<div class="md">{@html renderMarkdown(source)}</div>
<style>
 .md{user-select:text}
 .md :global(p){white-space:pre-wrap;overflow-wrap:anywhere;margin:0 0 7px}
 .md :global(p:last-child){margin-bottom:0}
 .md :global(h1),.md :global(h2),.md :global(h3){font-size:12.5px;font-weight:600;color:#e7e8ee;margin:10px 0 5px}
 .md :global(h1:first-child),.md :global(h2:first-child),.md :global(h3:first-child){margin-top:0}
 .md :global(strong){color:#eceef4;font-weight:600}
 .md :global(em){font-style:italic}
 .md :global(code){font:11px var(--mono);background:#ffffff0d;padding:1px 5px;border-radius:4px;overflow-wrap:anywhere}
 .md :global(pre){background:#0006;border:1px solid #ffffff0f;padding:8px 10px;border-radius:8px;overflow:auto;margin:6px 0}
 .md :global(pre code){background:none;padding:0;white-space:pre}
 .md :global(ul),.md :global(ol){margin:4px 0 7px;padding-left:18px}
 .md :global(li){margin:2px 0}
 .md :global(blockquote){margin:6px 0;padding:2px 0 2px 10px;border-left:2px solid #ffaf0045;color:var(--muted)}
 .md :global(a){color:var(--accent);text-decoration:underline;text-underline-offset:2px}
 .md :global(.table-wrap){margin:6px 0;overflow-x:auto;border:1px solid #ffffff0f;border-radius:8px}
 .md :global(table){border-collapse:collapse;width:100%;font-size:10.5px}
 .md :global(th),.md :global(td){padding:6px 9px;text-align:left;border-bottom:1px solid #ffffff0a;white-space:nowrap}
 .md :global(th:last-child),.md :global(td:last-child){white-space:normal}
 .md :global(th){background:#ffffff06;color:#c7c9d4;font-weight:600}
 .md :global(tr:last-child td){border-bottom:none}
</style>
