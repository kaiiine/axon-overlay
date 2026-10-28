import {describe,expect,it} from 'vitest';
import {get} from 'svelte/store';
import {model,receive,reset} from '../ui/src/model';
import {describeSessionChange,parseSession} from '../ui/src/session';

const session={backend:'groq',modele:'llama',temperature:0.2};

describe('session',()=>{
  it('rejette un message incomplet',()=>{
    expect(parseSession({backend:'groq'})).toBeNull();
    expect(parseSession({type:'session',...session})).toEqual(session);
  });
  it('décrit uniquement ce qui change',()=>{
    expect(describeSessionChange(null,session)).toEqual([]);
    expect(describeSessionChange(session,{...session,backend:'mistral',modele:'large'})).toEqual(['Backend : groq → mistral','Modèle : large']);
    expect(describeSessionChange(session,session)).toEqual([]);
  });
  it('affiche une note système quand /backend change la session',()=>{
    reset();
    receive({type:'session',...session});
    expect(get(model).messages).toHaveLength(0);
    receive({type:'session',...session,backend:'mistral',modele:'large'});
    expect(get(model).session?.backend).toBe('mistral');
    expect(get(model).messages.map(m=>[m.who,m.text])).toEqual([['systeme','Backend : groq → mistral'],['systeme','Modèle : large']]);
    reset();
  });
});
