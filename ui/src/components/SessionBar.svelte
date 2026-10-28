<script lang="ts">import {model} from '../model';</script>
<div class="session" aria-label="Session Axon">
 <span class="model" title={$model.session?`${$model.session.backend} · température ${$model.session.temperature}`:'Connexion à Axon'}>{$model.session?.modele||($model.demo?'Mode aperçu':'Session en attente')}</span>
 <span class="hint"><kbd>⇧ ↵</kbd> nouvelle ligne</span>
</div>
<style>
 .session{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0;flex:none;padding:0 3px;color:var(--muted);font-size:10px}.model{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hint{white-space:nowrap;display:flex;align-items:center;gap:5px}kbd{font:10px var(--font);color:#c0c0cb}@media(max-width:430px){.hint{display:none}}
</style>
