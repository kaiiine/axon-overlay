<script lang="ts">
 import {tick} from 'svelte';
 import {model} from '../model';
 import Icon from './Icon.svelte';
 import FormSheet from './commun/FormSheet.svelte';
 export let disabled=false;
 export let onCreer:(titre:string,type:string,matiere:string)=>string|undefined;
 const TYPES=[
  {valeur:'matiere',label:'Matière'},
  {valeur:'projet',label:'Projet'},
  {valeur:'ponctuel',label:'Ponctuel'},
  {valeur:'autre',label:'Autre'},
 ];
 let ouvert=false;
 let titre='';
 let type='matiere';
 let matiere='';
 let erreur='';
 let titreInput:HTMLInputElement;
 //: L'id de CETTE soumission (§2, lot 3) — jamais "la dernière création
 //: connue" : si une réponse tardive arrivait après que l'utilisateur a
 //: rouvert le formulaire pour une AUTRE création, elle ne doit pas la
 //: fermer à sa place.
 let idSuivi:string|null=null;
 //: `$model.creationSuivi` est la seule source de vérité pour "en cours" —
 //: plus de fermeture optimiste à l'envoi : le formulaire ne se referme
 //: que sur confirmation du backend (`statut==='ok'`). Sur échec (y compris
 //: une connexion perdue en vol), les champs restent tels quels et l'erreur
 //: s'affiche dans le formulaire.
 $: enCours=idSuivi!==null&&$model.creationSuivi?.id===idSuivi&&$model.creationSuivi.statut==='en_cours';
 $: if(idSuivi&&$model.creationSuivi?.id===idSuivi&&$model.creationSuivi.statut!=='en_cours'){
  if($model.creationSuivi.statut==='ok'){
   ouvert=false;titre='';matiere='';type='matiere';erreur='';
  }else{
   erreur=$model.creationSuivi.message||'Échec de la création.';
  }
  idSuivi=null;
 }
 $: if(ouvert&&titreInput)void tick().then(()=>titreInput?.isConnected&&titreInput.focus());
 function basculer(){ouvert=!ouvert;if(!ouvert){titre='';matiere='';type='matiere';erreur='';}}
 function soumettre(){
  const t=titre.trim();
  if(!t||disabled||enCours)return;
  erreur='';
  idSuivi=onCreer(t,type,matiere.trim())??null;
  if(!idSuivi)erreur='La création n’a pas pu être envoyée. Vérifie la connexion à Axon.';
 }
 function key(e:KeyboardEvent){if(e.key==='Enter'){e.preventDefault();soumettre();}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();basculer();}}
</script>
<button class="toggle" class:ouvert onclick={basculer} title="Nouveau suivi" aria-label="Nouveau suivi" aria-expanded={ouvert} disabled={disabled||enCours}>
 <Icon name="plus"/>
</button>
{#if ouvert}
 <FormSheet titre="Nouveau suivi" busy={enCours} onClose={basculer}>
  <div class="form-grid">
   <label>Le nom de ton espace<input bind:this={titreInput} bind:value={titre} onkeydown={key} placeholder="Machine learning, mon projet…" aria-label="Titre du suivi" autocomplete="off" disabled={disabled||enCours}/></label>
   <label>Ce que tu veux suivre<select bind:value={type} aria-label="Type de suivi" disabled={disabled||enCours}>{#each TYPES as t}<option value={t.valeur}>{t.label}</option>{/each}</select></label>
   {#if type==='matiere'}<label class="wide">Matière · facultatif<input bind:value={matiere} onkeydown={key} placeholder="Ex. Informatique" aria-label="Matière" autocomplete="off" disabled={disabled||enCours}/></label>{/if}
  </div>
  {#if erreur}<p class="erreur" role="alert">{erreur}</p>{/if}
  <svelte:fragment slot="footer"><button disabled={enCours} onclick={basculer}>Annuler</button><button class="send" aria-label="Créer" disabled={disabled||enCours||!titre.trim()} onclick={soumettre}>{enCours?'Création…':'Créer le suivi'}<Icon name="arrow"/></button></svelte:fragment>
 </FormSheet>
{/if}
<style>.toggle{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:var(--accent);background:#e9bc7b0b;border:1px solid #e9bc7b24;flex:none}.toggle:hover{background:#e9bc7b18}.toggle :global(.icon){width:12px;height:12px}.erreur{font-size:10px;color:#efa7a0;margin-top:6px}</style>
