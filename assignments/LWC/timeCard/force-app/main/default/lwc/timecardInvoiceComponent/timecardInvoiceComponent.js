/*
    LWC to display invoices for timecards in a table
    Author : Rishabh Sharma
    Created: 11-05-2022
*/
import { LightningElement, wire, track } from 'lwc';
import getInvoices from '@salesforce/apex/TimeCardLWCController.getInvoices';

export default class TimecardInvoiceComponent extends LightningElement {

    @track invoices;

    // wire method to fetch all invoice records | created by Rishabh Sharma | 11-05-2022
    @wire(getInvoices)
    wiredData({ error, data }) {
        if (data) {
            this.invoices = JSON.parse(JSON.stringify(data));
            console.log(JSON.parse(JSON.stringify(this.invoices)));
            this.invoices.forEach(item => {
                let date = new Date(item.Timecard__r.Start_Date__c);
                item['link'] = `https://ibirdssoftwareservicespvt51-dev-ed.lightning.force.com/${item.Id}`;
                item.Contact__r['link'] = `https://ibirdssoftwareservicespvt51-dev-ed.lightning.force.com/${item.Contact__r.Id}`;
                item.Timecard__r['link'] = `https://ibirdssoftwareservicespvt51-dev-ed.lightning.force.com/${item.Timecard__r.Id}`;
                item.Timecard__r['date'] = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
            });
            console.log(JSON.parse(JSON.stringify(this.invoices)));
        } else if (error) {
            console.error('Error:', error);
        }
    }
}