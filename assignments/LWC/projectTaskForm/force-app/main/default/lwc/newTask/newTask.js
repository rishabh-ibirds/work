import { LightningElement } from 'lwc';

export default class NewTask extends LightningElement {
    isVisibleModal = false;
    fields = [{fieldApiName: 'Name', objectApiName:"Project__c"}];

    toggleModal(){
        this.isVisibleModal = !this.isVisibleModal;
    }

    handleSuccess(){
        this.dispatchEvent(new CustomEvent('project'));
        this.toggleModal();
    }
}