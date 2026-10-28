import {get} from 'svelte/store';
import {model,receive,notice} from '../model';
import type {Outbound} from '../types';
import {studies,studyPage} from './fixtures';
const later=(callback:()=>void)=>setTimeout(callback,100);
export function refreshStudies(){
 receive({type:'raccourci_resultat',action:'etudes_suivis',rows:studies});
 receive({type:'raccourci_resultat',action:'etudes_echeances',rows:[{id:'exam',suiviId:'ml',title:'Examen final',meta:'Machine learning · 25 novembre',tag:'partiel'}]});
 receive({type:'raccourci_resultat',action:'etudes_fiches_recentes',rows:[{id:'fiche_regression.html',title:'Régression linéaire',meta:'28 octobre · fiche de révision',tag:'Fiche'}]});
}
export function previewPost(message:Outbound){
 if(message.type==='mode'||message.type==='pret')return;
 if(message.type==='ouvrir'){if(!message.ouvert)notice('Fenêtre réduite dans le plugin. L’aperçu reste ouvert.');return;}
 if(message.type==='creer_suivi'){later(()=>{studies.push({id:'demo-'+message.id,title:message.titre,meta:message.matiere||'Nouveau suivi',tag:message.type_suivi});refreshStudies();receive({type:'creer_suivi_resultat',id:message.id});});return;}
 if(message.type==='raccourci'){
  later(()=>{
   if(message.action==='etudes_page_suivi'){receive({type:'raccourci_resultat',action:message.action,item:message.item,page:studyPage(message.item||'ml')});return;}
   if(['etudes_suivis','etudes_echeances','etudes_fiches_recentes'].includes(message.action)){refreshStudies();return;}
   if(message.action==='etudes_ouvrir_fiche'){notice('Aperçu : le plugin ouvrirait ce résultat dans ton navigateur.');return;}
   if(message.panel){receive({type:'raccourci_resultat',action:message.action,panel:message.panel,item:message.item,text:'**Exemple de résumé.** Voici les points à retenir pour la prochaine étape.'});return;}
   const rows=message.action==='gmail_non_lus'?[{id:'m1',title:'Relecture de la proposition',meta:'Camille · aujourd’hui',tag:'non lu'},{id:'m2',title:'Planning de la semaine',meta:'Équipe · hier',tag:'info'}]:message.action==='jira_mes_tickets'?[{id:'j1',title:'AXON-42 · Nouvelle interface',meta:'En cours · priorité normale',tag:'En cours'}]:[{id:'w1',title:'Point projet',meta:'14:00 · Agenda',tag:'Agenda',detail:'Revue de l’interface et des prochaines étapes.'}];
   receive({type:'raccourci_resultat',action:message.action,stats:[{label:'Éléments',value:String(rows.length),accent:true}],rows});
  });return;
 }
 if(message.type==='creer_echeance'){later(()=>{receive({type:'etudes_action_resultat',id:message.id});receive({type:'raccourci_resultat',action:'etudes_echeances',rows:[...(get(model).integrationData.etudes_echeances?.rows??[]),{id:'demo-'+message.id,suiviId:message.suivi_id,title:message.titre,meta:message.date,tag:message.type_echeance}]});});return;}
 if(message.type==='demander_picker'){receive({type:'pieces_jointes',items:[{nom:'Cours-exemple.pdf',statut:'ok',taille:'240 Ko',est_image:false}]});return;}
 if(message.type==='detacher'){receive({type:'pieces_jointes',items:[]});return;}
 if(['maj_echeance','lier_ressource','archiver_suivi','supprimer_suivi','planifier_rappels'].includes(message.type)){later(()=>{receive({type:'etudes_action_resultat',id:(message as {id:string}).id});notice('Action simulée. Aucune donnée réelle n’a été modifiée.');});return;}
 if(message.type==='demander_flux'){later(()=>{receive({type:'flux_morceau',id:message.id,texte:'**Le point sur ton suivi.** Les ressources sont prêtes ; on peut passer aux exercices.'});receive({type:'flux_fin',id:message.id});});return;}
 if(message.type==='reponse_demande'||message.type==='decision'){later(()=>{receive({type:'message',texte:'Réponse enregistrée dans cet aperçu. Aucune action réelle n’a été exécutée.'});receive({type:'etat',etat:'finished'});});return;}
 if(message.type==='commande'){later(()=>{receive({type:'message',texte:'**Message reçu.** Cet aperçu utilise le vrai front, avec des réponses de démonstration. Aucun agent ni service externe n’est contacté.'});receive({type:'etat',etat:'finished'});});}
}
