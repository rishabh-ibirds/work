import { LightningElement } from 'lwc';

export default class Childlvl3 extends LightningElement {

    handleClick(){
        this.dispatchEvent(new CustomEvent('poke', {bubbles:true, composed:true}));
    }
}