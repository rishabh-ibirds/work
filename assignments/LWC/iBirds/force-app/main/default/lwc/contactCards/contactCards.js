import { LightningElement, wire } from 'lwc';
import getContact from '@salesforce/apex/myFirstLWCClass.fetchCon';
import insertContact from '@salesforce/apex/myFirstLWCClass.insertCon';
const DELAY = 300;
export default class ContactCards extends LightningElement {

    contacts = [];
    tasks=[];
    filteredRecords;
    con = { 'sobjectType': 'Contact' };
    isVisibleTask = false;

    @wire(getContact)
    wiredData({ error, data }) {
        if (data) {
            console.log('Data', data);
            this.contacts = JSON.parse(JSON.stringify(data));
            this.contacts.forEach(con => {
              let count = 0;
              if('Tasks' in con){
                con.Tasks.forEach(t => {
                  if(t.Status === 'Completed'){
                    count++;
                  }
                });
                con['Progress'] = count/con.Tasks.length * 100;
              }
            });
            this.filteredRecords = [... this.contacts];          
            console.log('Tasks==', this.tasks);
        } else if (error) {
            console.error('Error:', error);
        }
    }

    handleKeyChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        //const searchColumn = "Name";
        if(searchKey){
            this.delayTimeout = setTimeout(() => {
              this.filteredRecords = this.contacts.filter((item) => {          
                return item['Name'].toLowerCase().includes(searchKey.toLowerCase());
              });
            }, DELAY);
        } else {
          this.filteredRecords = this.contacts; 
        }
    }

    handleRecChange(e){
      this.con[e.target.name] = e.target.value;
      console.log('CON', this.con);
    }

    handleBtnClick(){
      insertContact({con : this.con}).then((result) => {
        console.log('reuslt', result);
      }).catch((err) => {
        console.log('Error', err);
      });
    }

    showTask(e){
      let con = e.target.value;
      con = JSON.parse(JSON.stringify(con));
      console.log('Contact= ' , con);     
      this.tasks = con.Tasks;
      this.conId = con.Id;
      console.log(this.conId);
      this.isVisibleTask = true;
    }

    handleChildEvent(){
      this.isVisibleTask = false;
    }
}