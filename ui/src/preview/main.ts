import {mount,tick} from 'svelte';
import App from '../App.svelte';
import {model,receive,reset,navigate,ouvrirSuivi,openIntegration} from '../model';
import {refreshStudies,previewPost} from './bridge';
import {diff} from './fixtures';
import '../app.css';
window.webkit={messageHandlers:{axon:{postMessage:previewPost}}};
reset();
const media=matchMedia('(prefers-reduced-motion: reduce)');
model.update(s=>({...s,motion:!media.matches}));
mount(App,{target:document.getElementById('app')!});
receive({type:'connexion',connecte:true});
model.update(s=>({...s,session:{backend:'ollama',modele:'qwen2.5:7b',temperature:.7},commands:[{cmd:'/help',desc:'Les commandes disponibles'},{cmd:'/fiche',desc:'Créer une fiche'}],messages:[{id:101,who:'toi',text:'Peux-tu simplifier la page de connexion ?'},{id:102,who:'axon',text:'Deux améliorations utiles :\n\n- Valider les champs avant l’envoi.\n- Afficher une erreur claire quand la connexion échoue.\n\nJe te propose une modification ciblée.'}],file:{path:'src/auth/login.py',content:diff,diff:true,start:1}}));
refreshStudies();
model.subscribe(s=>window.parent.postMessage({source:'axon-final-preview',height:s.view==='chat'?540:s.view==='code'?500:280,width:s.view==='chat'?560:780,view:s.view},'*'));
async function scenario(name:string){
 model.update(s=>({...s,requests:[],notice:'',popup:null,state:'idle'}));
 for(const dialog of document.querySelectorAll<HTMLDialogElement>('dialog[open]'))dialog.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
 if(name==='suivi'){ouvrirSuivi('ml');return;}
 if(['gmail','workspace','slack','jira'].includes(name)){openIntegration(name);return;}
 const view=name==='hitl'?'chat':name==='create'||name==='deadline'?'etudes':name;
 if(['home','chat','code','etudes','settings','integrations'].includes(view))navigate(view as 'home');
 if(name==='hitl')receive({type:'demande',id:'preview-hitl',genre:'permission',apercu:diff,questions:[{texte:'Appliquer ces modifications à la page de connexion ?',choix:['Appliquer','Refuser'],affirmatif:'Appliquer',libre:true}]});
 if(name==='create'||name==='deadline'){
  await tick();
  const label=name==='deadline'?'Échéances':'Suivis';
  const button=Array.from(document.querySelectorAll<HTMLButtonElement>('.student-nav nav button')).find(b=>b.textContent?.includes(label));button?.click();await tick();
  document.querySelector<HTMLButtonElement>(name==='create'?'[aria-label="Nouveau suivi"]':'.etudes [aria-label="Nouvelle échéance"]')?.click();
 }
}
window.addEventListener('message',event=>{if(event.source===window.parent&&event.data?.source==='axon-final-control')void scenario(event.data.page);});
void scenario('home');
