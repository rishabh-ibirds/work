/*
    LWC js for dynamic binding of data to html with the help of Apex controller
    Author : Rishabh Sharma
    Created: 15-04-2022 
*/

import { LightningElement, wire, track } from 'lwc';
import getBankRecords from '@salesforce/apex/BankReportLWCController.getBankRecords';
import getToday from '@salesforce/apex/BankReportLWCController.getToday';

export default class BankReport extends LightningElement {

    date;
    today;
    @track fetchedRecords;
    @track displayTable = [];
    dates = {
              today: 'today',
              yesterday: 'yesterday',
              week: 'week',
              month: 'month',
              threeMonths: 'threeMonths'
            };

    // wired call to get today's date from org | Created by Rishabh Sharma | 15-04-2022        
    @wire(getToday)
    wiredData({ error, data }) {
      if (data) {
        this.date=data;
        this.today=data;
      } else if (error) {
        console.error('Error:', error);
      }
    }

    //wired call to fetch bank records from controller | Created by Rishabh Sharma | 14-04-2022
    @wire(getBankRecords, { curDate: '$date' })
    getRecords({ error, data }) {
      if (data) {
        this.fetchedRecords = JSON.parse(JSON.stringify(data));
        console.log('Date = ', this.date);
        console.log('fetched data = ', JSON.parse(JSON.stringify(this.fetchedRecords)));
        this.fillTable();
      } else if (error) {
         console.error('Error:', error);
      }
    }

    handleDateChange(e){
      this.date = e.target.value;
    }

    // helper method to fill formatted data in displayTable | Created by Rishabh Sharma | 14-04-2022
    fillTable(){
        this.displayTable=[];
        let keys = Object.keys(this.fetchedRecords);

        this.dates={
                    today: this.fetchedRecords[keys[0]].today.Collection_Date__c,
                    yesterday: this.fetchedRecords[keys[0]].yesterday.Collection_Date__c,
                    week: this.fetchedRecords[keys[0]].week.Collection_Date__c,
                    month: this.fetchedRecords[keys[0]].month.Collection_Date__c,
                    threeMonths: this.fetchedRecords[keys[0]].threeMonths.Collection_Date__c
                  };
        
        keys.forEach((key, index) => {

            let today= this.fetchedRecords[key].today.Amount__c;
            let yesterday= this.fetchedRecords[key].yesterday.Amount__c - today;
            let week = this.fetchedRecords[key].week.Amount__c - today;
            let month= this.fetchedRecords[key].month.Amount__c - today;
            let threeMonths= this.fetchedRecords[key].threeMonths.Amount__c - today;
            let highest= this.fetchedRecords[key].highest.Amount__c;
            let lowest= this.fetchedRecords[key].lowest.Amount__c;
            let highestDate= (highest>0)?this.fetchedRecords[key].highest.Collection_Date__c:'-';
            let lowestDate= (lowest>0)?this.fetchedRecords[key].lowest.Collection_Date__c:'-';

            this.displayTable.push({'bankName': key , 
                                    'today': today,
                                    'yesterday': yesterday,
                                    'week' : week,
                                    'month': month,
                                    'threeMonths': threeMonths,
                                    'highest': highest,
                                    'highestDate': highestDate,
                                    'lowest': lowest,
                                    'lowestDate': lowestDate,
                                    'yesterdayColor': this.getColor(yesterday),
                                    'weekColor': this.getColor(week),
                                    'monthColor': this.getColor(month),
                                    'threeMonthsColor': this.getColor(threeMonths)
                                });
        });

        console.log('displayTable ', JSON.parse(JSON.stringify(this.displayTable)) );
    }

    // helper method to get color according to value | Created by Rishabh Sharma | 15-04-2022
    getColor(val){
      return (val===0)?'Yellow':(val>0)?'#13FF00':'#ff6161';
    }
}