<script lang="ts">
 import {tick} from 'svelte';
 import {model} from '../model';
 import Icon from './Icon.svelte';
 import FormSheet from './commun/FormSheet.svelte';
 //: Même patron que CreerSuivi.svelte (§2, lot 3 posé comme modèle à
 //: reprendre pour ces actions-là aussi) : le "+" révèle le formulaire, qui
 //: ne se referme que sur confirmation du backend.
 export let disabled=false;
 export let suivis:{id:string;title:string}[]=[];
 export let onCreer:(suiviId:string,titre:string,typeEcheance:string,date:string)=>string|undefined;
 const TYPES=[
  {valeur:'devoir',label:'Devoir'},
  {valeur:'partiel',label:'Partiel'},
  {valeur:'rendu_projet',label:'Rendu de projet'},
  {valeur:'autre',label:'Autre'},
 ];
 let ouvert=false;
 let suiviId='';
 let titre='';
 let type='devoir';
 let date='';
 let erreur='';
 let titreInput:HTMLInputElement;
 let idEnAttente:string|null=null;
 $: enAttente=idEnAttente!==null&&$model.actionEtudes?.id===idEnAttente&&$model.actionEtudes.statut==='en_cours';
 $: if(idEnAttente&&$model.actionEtudes?.id===idEnAttente&&$model.actionEtudes.statut!=='en_cours'){
  if($model.actionEtudes.statut==='ok'){
   ouvert=false;titre='';date='';type='devoir';erreur='';
  }else{
   erreur=$model.actionEtudes.message||'Échec de la création.';
  }
  idEnAttente=null;
 }
 //: `suiviId` par défaut au PREMIER suivi dès que la liste arrive (elle
 //: peut être vide à l'ouverture, se remplir juste après).
 $: if(!suiviId&&suivis.length)suiviId=suivis[0].id;
 $: if(ouvert&&titreInput)void tick().then(()=>titreInput?.isConnected&&titreInput.focus());
 function basculer(){ouvert=!ouvert;if(!ouvert){titre='';date='';type='devoir';erreur='';}}
 function soumettre(){
  const t=titre.trim();
  if(!t||!date||!suiviId||disabled||enAttente)return;
  erreur='';
  idEnAttente=onCreer(suiviId,t,type,date)??null;
  if(!idEnAttente)erreur='La création n’a pas pu être envoyée. Vérifie la connexion à Axon.';
 }
 function key(e:KeyboardEvent){if(e.key==='Enter'){e.preventDefault();soumettre();}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();basculer();}}
</script>
<button class="toggle" class:ouvert onclick={basculer} title="Nouvelle échéance" aria-label="Nouvelle échéance" aria-expanded={ouvert} disabled={disabled||enAttente||!suivis.length}>
 <Icon name="plus"/>
</button>
{#if ouvert}
 <FormSheet titre="Nouvelle échéance" busy={enAttente} onClose={basculer}>
  <div class="form-grid">
   <label>À préparer<input bind:this={titreInput} bind:value={titre} onkeydown={key} placeholder="Examen final, rendu…" aria-label="Titre de l’échéance" autocomplete="off" disabled={disabled||enAttente}/></label>
   <label>Pour quand ?<input type="date" bind:value={date} onkeydown={key} aria-label="Date de l’échéance" disabled={disabled||enAttente}/></label>
   <label>Dans quel suivi ?<select bind:value={suiviId} aria-label="Suivi concerné" disabled={disabled||enAttente}>{#each suivis as s}<option value={s.id}>{s.title}</option>{/each}</select></label>
   <label>Type d’échéance<select bind:value={type} aria-label="Type d’échéance" disabled={disabled||enAttente}>{#each TYPES as t}<option value={t.valeur}>{t.label}</option>{/each}</select></label>
  </div>
  {#if erreur}<p class="erreur" role="alert">{erreur}</p>{/if}
  <svelte:fragment slot="footer"><button disabled={enAttente} onclick={basculer}>Annuler</button><button class="send" aria-label="Créer" disabled={disabled||enAttente||!titre.trim()||!date||!suiviId} onclick={soumettre}>{enAttente?'Création…':'Ajouter l’échéance'}<Icon name="arrow"/></button></svelte:fragment>
 </FormSheet>
{/if}
<style>.toggle{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:var(--accent);background:#e9bc7b0b;border:1px solid #e9bc7b24;flex:none}.toggle:hover{background:#e9bc7b18}.toggle :global(.icon){width:12px;height:12px}.erreur{font-size:10px;color:#efa7a0;margin-top:6px}</style>
