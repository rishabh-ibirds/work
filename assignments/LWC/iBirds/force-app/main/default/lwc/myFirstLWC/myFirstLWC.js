import { LightningElement, api, track, wire } from 'lwc';
import getContactData from '@salesforce/apex/myFirstLWCClass.fetchCon';
export default class MyFirstLWC extends LightningElement {

    fName = 'Radhe';
    lName = 'Wanted';
    
    constructor() {
        super();
        
    }
    
    contacts;
    
    @wire(getContactData)
    wiredData({ error, data }) {
        console.log('HI');
        if (data) {
        console.log('Data', data);
        this.contacts=data;
        } else if (error) {
        console.error('Error:', error);
        }
    }

    handleClick(){
        this.contacts.forEach(con => {
            console.log(con);
        });

        getContactData().then(result => {
            console.log('Result = ', result);
        }) .catch(error => {
            console.log('Error = ', error);
        });
    }
    
}