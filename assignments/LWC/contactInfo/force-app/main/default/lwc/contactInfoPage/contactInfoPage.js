/* 
    LWC to display information from objects related to contacts
    Author: Rishabh Sharma
    Created: 04-05-2022
*/

import { LightningElement, wire, track, api } from 'lwc';
import getContactInfo from '@salesforce/apex/ContactInfoLWCController.getContactInfo';

export default class ContactInfoPage extends LightningElement {

    @api contactId;
    @track records;
    @track eventTask = [];
    @track oppCampaign = [];
    @track files = [];

    //wired apex method to fetch contact data from controller class | created by Rishabh Sharma | 05-05-2022
    @wire(getContactInfo, { contactId: '$contactId' })
    wiredData({ error, data }) {
        if (data) {
            this.records = JSON.parse(JSON.stringify(data));
            this.eventTask = this.records.EventTask;
            this.oppCampaign = this.records.CampaignOpportunity;
            this.files = this.records.Files;
            this.files.forEach(item => {
                switch (item.typ) {
                    case "TEXT":
                        item['ico'] = "doctype:txt";
                        break;
                    case "PDF":
                        item['ico'] = "doctype:pdf";
                        break;
                    case "WORD_X":
                        item['ico'] = "doctype:word";
                        break;
                    case "EXCEL_X":
                        item['ico'] = "doctype:excel";
                        break;
                    case "PNG":
                    case "JPEG":
                        item['ico'] = "doctype:image";
                        break;
                    default:
                        item['ico'] = "doctype:unknown";
                        break;
                }
            });
        } else if (error) {
            console.error('Error:', error);
        }
    }

    // // method to logout by reloading page. | created by Rishabh Sharma | 06-05-2022
    // handleLogout() {
    //     location.reload();
    // }
}