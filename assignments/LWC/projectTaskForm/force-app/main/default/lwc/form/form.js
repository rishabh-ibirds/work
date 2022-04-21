/*
    LWC form for data manipulation in Project and Project tasks custom object.
    Author  : Rishabh Sharma
    Created : 07/04/2022 
*/
import { LightningElement, wire, track, api } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import PROJECT_OBJECT from '@salesforce/schema/Project__c';
import getProjectTasks from '@salesforce/apex/ProjectFormLWC.getProjectTasks';
import updateProjectTasks from '@salesforce/apex/ProjectFormLWC.updateProjectTasks';
import { refreshApex } from '@salesforce/apex';
import getToday from '@salesforce/apex/ProjectFormLWC.getToday';

export default class Form extends LightningElement {
    @track records;
    @track filteredRecords;
    @track options = [];
    @track projectTasks;
    @track newRecs = [{ Name: '', Task_Type__c: '', Project__c: this.currentProject, Completion_Date__c: this.date}];
    currentProject;
    date;
    displayDate;
    today;
    taskTypes = [
                    { label: 'Analysis', value: 'Analysis' },
                    { label: 'Development', value: 'Development' },
                    { label: 'Deployment', value: 'Deployment' },
                    { label: 'Documentation', value: 'Documentation' },
                    { label: 'Meeting', value: 'Meeting' }
                ];
    @api
    get isToday() {
        return new Date(this.displayDate).setHours(0,0,0,0) == new Date(this.today).setHours(0,0,0,0);
    }

    @wire(getToday, {})
    getToday ({error, data}) {
        if (data) {
            this.date = new Date(data);
            this.displayDate = this.date.toISOString();
            this.today = this.displayDate;
        } else if (error) {
            console.log(error);
        }
    }

    @wire(getListUi, { objectApiName: PROJECT_OBJECT, listViewApiName: 'All' })
    listView({ error, data }) {
        if (data) {
            let opt = [];
            console.log('date', this.date);
            console.log('data', data);
            data.records.records.forEach(currentItem => {
                opt.push({ label: currentItem.fields.Name.value, value: currentItem.fields.Id.value});
            });
            this.options = JSON.parse(JSON.stringify(opt));
            console.log('options = ', this.options);
        } else if (error) {
            console.log('Error', error);
        }
    }

    handleRefresh(){
        return refreshApex(this.listView);
    }

    // @wire(getRelatedListRecords, {
    //     parentRecordId: '001RM000003UNu6YAG',
    //     relatedListId: 'Contacts',
    //     fields: ['Contact.Name','Contact.Id']
    // })

    @wire(getProjectTasks)
    wiredData ({error, data}) {
        if (data) {
            this.records = this.records = JSON.parse(JSON.stringify(data));
            console.log('records ==>', this.records);
        } else if (error) {
            
        }
    }


    nextDate(){
        this.date.setDate(this.date.getDate()+1);
        this.displayDate = this.date.toISOString();
        this.handleChange();
    }

    prevDate(){
        this.date.setDate(this.date.getDate()-1);
        this.displayDate = this.date.toISOString();
        this.handleChange();
    }

    handleDate(e){
        let newDate = e.target.value;
        this.date = new Date(newDate);
        this.displayDate = this.date.toISOString();
        console.log('tostring', this.date.toISOString());
        this.handleChange();
    }

    handleTaskChange(e){
        this.currentProject = e.target.value;
        this.handleChange();
    }

    handleChange(){
        if(!this.currentProject){
            return;
        }
        this.filteredRecords = this.records.filter(item => {
            return (item.Project__c == this.currentProject && new Date(item.Completion_Date__c).setHours(0,0,0,0) == new Date(this.displayDate).setHours(0,0,0,0)); 
        });
        this.filteredRecords = JSON.parse(JSON.stringify(this.filteredRecords));
        this.newRecs = [{ Name: '', Task_Type__c: '', Project__c: this.currentProject, Completion_Date__c: this.date , Hours__c:''}];
    }

    handleDescriptionChange(e){
        let val = e.currentTarget.value;
        let index = e.currentTarget.name;
        this.filteredRecords[index].Description__c = val;
        this.filteredRecords = JSON.parse(JSON.stringify(this.filteredRecords));
        console.log('recs', JSON.parse(JSON.stringify(this.filteredRecords)));
    }

    addRow(){
        this.newRecs.push({ Name: '', Task_Type__c: '', Project__c: this.currentProject, Completion_Date__c: this.date , Hours__c: ''});
        console.log('newRecs', this.newRecs);
    }

    removeRow(e){
        let index = e.currentTarget.dataset.index;
        console.log('index = ', index);
        console.log('values at index ', JSON.parse(JSON.stringify(this.newRecs[index])) );
        this.newRecs.splice(index, 1);
    }

    handleNewRecs(e){
        let index = e.currentTarget.dataset.index;
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;
        console.log('index, name, value', index, name, value);
        this.newRecs[index][name] = value;
        console.log('newRecs => ', JSON.parse(JSON.stringify(this.newRecs)));
    }

    handleSubmit(evt){

        const newValid = [
            ...this.template.querySelectorAll('.chk'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        const editValid = [
            ...this.template.querySelectorAll('.desc'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        if (editValid) {
            let finalList = [...this.filteredRecords];
            if(new Date(this.today).setHours(0,0,0,0) == new Date(this.displayDate).setHours(0,0,0,0)){
                if(newValid){
                    finalList = finalList.concat(this.newRecs);
                }else{
                    if(!confirm("Incomplete records. No new records will be added. Press OK to proceed OR Press Cancel to go back to form.")){
                        return;
                    }
                }
            }
            console.log('final list = ', JSON.parse(JSON.stringify(finalList)) );
            
            updateProjectTasks({toUpdateRecs : finalList}).then((result) => {
                console.log("Success");
            }).catch((err) => {
                alert(err);
                console.log("Error", err);
            });
        } else {
            alert('Please update the invalid form entries and try again.');
        }
    }
}