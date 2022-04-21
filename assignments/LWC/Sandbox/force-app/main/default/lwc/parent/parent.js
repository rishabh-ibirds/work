import { LightningElement } from 'lwc';

export default class Parent extends LightningElement {

    handlePoke(){
        console.log('Event fired from great grandchild');
        let newCls = this.template.querySelector('.evt');
        let newP = this.template.querySelector('p');

        newCls.innerText = 'Fired';
        newP.innerText = 'Fired';
    }
}