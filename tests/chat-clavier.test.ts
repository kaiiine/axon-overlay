import {expect,it,vi} from 'vitest';
import {get} from 'svelte/store';
import {mount,unmount,tick} from 'svelte';
import App from '../ui/src/App.svelte';
import {model,navigate,receive,reset,setDraft,submit} from '../ui/src/model';

async function ouvrirChat(post=vi.fn()){
  reset();
  window.webkit={messageHandlers:{axon:{postMessage:post}}};
  const target=document.createElement('div');
  document.body.append(target);
  const app=mount(App,{target});
  await tick();
  receive({type:'connexion',connecte:true});
  navigate('chat');
  return {target,app,post};
}

async function fermer({target,app}:{target:HTMLElement;app:object}){
  await unmount(app);
  target.remove();
  delete window.webkit;
  reset();
}

const touche=(element:Element,key:string)=>element.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));

it('une commande locale ne passe pas l’île en « travaille »',async()=>{
  const ctx=await ouvrirChat();
  setDraft('/backend');
  submit();
  await tick();
  expect(get(model).state).toBe('idle');
  expect(ctx.target.querySelector('.typing')).toBeNull();
  await fermer(ctx);
});

it('un message normal passe en « réfléchit »',async()=>{
  const ctx=await ouvrirChat();
  setDraft('salut');
  submit();
  await tick();
  expect(get(model).state).toBe('thinking');
  expect(ctx.target.querySelector('.typing')?.textContent).toContain('Axon réfléchit');
  await fermer(ctx);
});

it('répondre à un sélecteur ne déclenche pas « Axon travaille »',async()=>{
  const ctx=await ouvrirChat();
  receive({type:'demande',id:7,questions:[{texte:'backend',choix:['groq','mistral'],libre:false}]});
  await tick();
  (ctx.target.querySelectorAll('.choices button')[1] as HTMLButtonElement).click();
  await tick();
  expect(ctx.post).toHaveBeenLastCalledWith({type:'reponse_demande',id:7,reponses:['mistral']});
  expect(get(model).state).toBe('idle');
  expect(ctx.target.querySelector('.typing')).toBeNull();
  await fermer(ctx);
});

it('le focus arrive sur la réponse affirmative et les flèches le déplacent',async()=>{
  const ctx=await ouvrirChat();
  receive({type:'demande',id:1,questions:[{texte:'Appliquer ?',choix:['Non','Oui'],affirmatif:'Oui',libre:false}]});
  await tick();
  const [non,oui]=[...ctx.target.querySelectorAll('.choices button')] as HTMLButtonElement[];
  expect(document.activeElement).toBe(oui);
  touche(oui,'ArrowDown');
  expect(document.activeElement).toBe(non);
  touche(non,'ArrowUp');
  expect(document.activeElement).toBe(oui);
  await fermer(ctx);
});

it('un chiffre choisit directement la réponse correspondante',async()=>{
  const ctx=await ouvrirChat();
  receive({type:'demande',id:2,questions:[{texte:'Format ?',choix:['JSON','CSV'],libre:false}]});
  await tick();
  touche(ctx.target.querySelector('.choices button') as Element,'2');
  await tick();
  expect(ctx.post).toHaveBeenLastCalledWith({type:'reponse_demande',id:2,reponses:['CSV']});
  await fermer(ctx);
});

it('une ouverture suivie immédiatement d’une demande ne laisse pas la saisie voler le focus',async()=>{
  const ctx=await ouvrirChat();
  receive({type:'demande',id:9,questions:[{texte:'Choisir',choix:['A','B'],libre:false}]});
  await tick();
  await tick();
  expect(document.activeElement?.closest('.choices')).not.toBeNull();
  await fermer(ctx);
});

it('la lecture de messages anciens résiste aux nouveaux messages et peut revenir en bas',async()=>{
  const ctx=await ouvrirChat();
  await tick();
  const log=ctx.target.querySelector('.log') as HTMLElement;
  Object.defineProperties(log,{scrollHeight:{value:1000,configurable:true},clientHeight:{value:200,configurable:true}});
  log.scrollTop=100;
  log.dispatchEvent(new Event('scroll'));
  setDraft('Une question');
  submit();
  await tick();
  await tick();
  expect(log.scrollTop).toBe(100);
  (ctx.target.querySelector('.latest') as HTMLButtonElement).click();
  await tick();
  expect(log.scrollTop).toBe(1000);
  expect(ctx.target.querySelector('.latest')).toBeNull();
  await fermer(ctx);
});

it('la réduction du nouvel en-tête masque la fenêtre native sans effacer le brouillon',async()=>{
  const ctx=await ouvrirChat();
  setDraft('À garder');
  await tick();
  (ctx.target.querySelector('.minimize') as HTMLButtonElement).click();
  await tick();
  expect(get(model).draft).toBe('À garder');
  expect(ctx.post).toHaveBeenCalledWith({type:'ouvrir',ouvert:false});
  await fermer(ctx);
});

it('la mascotte reste unique et reflète une demande dans le chat',async()=>{
  const ctx=await ouvrirChat();
  receive({type:'demande',id:12,questions:[{texte:'Continuer ?',choix:['Oui','Non'],libre:false}]});
  await tick();
  expect(ctx.target.querySelectorAll('[data-mascot]')).toHaveLength(1);
  expect(ctx.target.querySelector('[data-mascot-stage]')?.getAttribute('data-phase')).toBe('waiting');
  expect(ctx.target.querySelector('[data-mascot-stage]')?.classList.contains('compact')).toBe(true);
  expect(ctx.target.querySelector('.log .request')).not.toBeNull();
  await fermer(ctx);
});
