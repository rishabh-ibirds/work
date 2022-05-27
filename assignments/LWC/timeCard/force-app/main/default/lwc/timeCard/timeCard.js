/*
    LWC for community user to manage Timecards
    Author : Rishabh Sharma
    Created: 10-05-2022
*/
import { LightningElement, wire, track } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import CONTACT_ID from "@salesforce/schema/User.ContactId";
import NAME_FIELD from '@salesforce/schema/User.Name';
import USER_ID from "@salesforce/user/Id";
import getTimeCard from '@salesforce/apex/TimeCardLWCController.getTimeCard';
import saveTimeCard from '@salesforce/apex/TimeCardLWCController.saveTimeCard';

export default class TimeCard extends LightningElement {

    @track timeCardRecord;
    startDate;
    freezeRecord = false;
    total;
    overtime;

    // wired method to fetch current user's record | created by Rishabh Sharma | 10-05-2022
    @wire(getRecord, { recordId: USER_ID, fields: [CONTACT_ID, NAME_FIELD] })
    user;

    // getter for contactId to return currernt user's contact Id | created by Rishabh Sharma | 10-05-2022
    get contactId() {
        return getFieldValue(this.user.data, CONTACT_ID);
    }

    // getter for username to return currernt user's name | created by Rishabh Sharma | 12-05-2022
    get username(){
        return getFieldValue(this.user.data, NAME_FIELD);
    }

    // wire method to fetch associated timecard record for user | created by Rishabh Sharma | 10-05-2022
    @wire(getTimeCard, { contactId: '$contactId' })
    wiredData({ error, data }) {
      if (data) {
        this.timeCardRecord = JSON.parse(JSON.stringify(data));
        this.startDate = this.timeCardRecord.Start_Date__c;
        let dates = this.template.querySelector('.date');
        for(let i = 0; i < 7; i++){
            let date = new Date(this.startDate);
            date.setDate(date.getDate() + i);
            dates.innerHTML += `<th scope="col" style="background-color: #FAFAF9;"><center> ${date.getDate()}/${date.getMonth()+1} (${date.toString().split(' ')[0]})</center></th>`;
        }
        if('Total__c' in this.timeCardRecord){
            this.total = this.timeCardRecord.Total__c;
            this.overtime= this.timeCardRecord.Overtime__c;
        }
        if(this.timeCardRecord.Status__c == 'Submitted' || this.timeCardRecord.Status__c == 'Approved'){
            this.freezeRecord = true;
            this.template.querySelector('.subheading').innerHTML = `Timecard ${this.timeCardRecord.Status__c}!`;
        }
      } else if (error) {
         console.error('Error:', error);
      }
    }

    // method to update values in timecard record in real time on client side | created by Rishabh Sharma | 10-05-2022
    handleTimecardChange(event){
        let name = event.target.name;
        let value = event.target.value;
        if(value==''){
            value = 0;
        }
        if(value > 16){
            value = 16;
        }        
        this.timeCardRecord[name] = value;
        event.target.value = value;
        this.total = parseInt(this.timeCardRecord.Mon__c ) + parseInt(this.timeCardRecord.Tue__c) + parseInt(this.timeCardRecord.Wed__c) + parseInt(this.timeCardRecord.Thu__c) + parseInt(this.timeCardRecord.Fri__c) + parseInt(this.timeCardRecord.Sat__c) + parseInt(this.timeCardRecord.Sun__c);
        this.overtime = (this.total > 40)?this.total - 40:0;
    }

    // method to save the timecard in its current state | created by Rishabh Sharma | 10-05-2022
    handleSave(){
        saveTimeCard({timeCardRecord : this.timeCardRecord}).then((result) => {
            this.timeCardRecord = result;
        }).catch((err) => {
            console.error('error:', err);
        });
    }

    // method to save and submit timecard for approval in its current state | created by Rishabh Sharma | 11-05-2022
    handleSubmit(){
        this.timeCardRecord.Status__c = "Submitted";
        this.handleSave();
        this.freezeRecord = true;
        this.template.querySelector('.subheading').innerHTML = `Timecard Submitted`;
    }
}