import {describe,expect,it} from 'vitest';
import {AUTRE,choicesFor,defaultIndex,indexFromDigit,nextIndex} from '../ui/src/choices';

describe('choicesFor',()=>{
  it('ajoute « Autre » aux questions ouvertes',()=>{
    expect(choicesFor({texte:'?',choix:['a','b']})).toEqual(['a','b',AUTRE]);
  });
  it('n’ajoute rien aux choix fermés ni aux genres fermés',()=>{
    expect(choicesFor({texte:'?',choix:['a'],libre:false})).toEqual(['a']);
    expect(choicesFor({texte:'?',choix:['Oui','Non']},'autorisation')).toEqual(['Oui','Non']);
  });
  it('ne duplique pas un « Autre » déjà proposé',()=>{
    expect(choicesFor({texte:'?',choix:['a','autre (préciser).']})).toEqual(['a',AUTRE]);
  });
  it('est vide sans choix',()=>{
    expect(choicesFor({texte:'?',choix:[]})).toEqual([]);
    expect(choicesFor(undefined)).toEqual([]);
  });
});

describe('navigation clavier',()=>{
  it('tourne dans la liste',()=>{
    expect(nextIndex(2,'ArrowDown',3)).toBe(0);
    expect(nextIndex(0,'ArrowUp',3)).toBe(2);
    expect(nextIndex(1,'Home',3)).toBe(0);
    expect(nextIndex(1,'End',3)).toBe(2);
    expect(nextIndex(1,'x',3)).toBe(1);
  });
  it('mappe les chiffres sur les choix existants',()=>{
    expect(indexFromDigit('1',3)).toBe(0);
    expect(indexFromDigit('3',3)).toBe(2);
    expect(indexFromDigit('4',3)).toBe(-1);
    expect(indexFromDigit('0',3)).toBe(-1);
    expect(indexFromDigit('a',3)).toBe(-1);
  });
  it('place le focus initial sur la réponse affirmative',()=>{
    expect(defaultIndex(['Non','Oui'],'Oui')).toBe(1);
    expect(defaultIndex(['Non','Oui'],'')).toBe(0);
  });
});
