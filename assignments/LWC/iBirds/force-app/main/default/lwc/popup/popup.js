import { LightningElement, track, api } from 'lwc';
import insertTask from '@salesforce/apex/myFirstLWCClass.insertTask';
import updateTask from '@salesforce/apex/myFirstLWCClass.updateTask';

export default class Popup extends LightningElement {
    taskArr;
    statusOptions = [
                        { label: 'Not Started', value: 'Not Started' },
                        { label: 'In Progress', value: 'In Progress' },
                        { label: 'Completed', value: 'Completed' },
                        { label: 'Waiting on someone else', value: 'Waiting on someone else' },
                        { label: 'Deferred', value: 'Deferred'}
                    ];
    
    taskToInsert = {'sobjectType': 'Task'};
    @api whoId;
    updateArr = [];

    @api
    get tasks() {
        return this.taskArr;
    }
    set tasks(value) {
        if(typeof value != 'undefined' && value != null){
            this.taskArr = [];
            value.forEach(val => {
                const t = Object.assign({}, val);
                if(t.Status == 'Completed'){
                    t['Pending'] = true;
                }else{
                    t['Pending'] = false;
                }
                this.taskArr.push(t);
            });
        }
    }

    connectedCallback() {
        console.log('statusOptions', this.statusOptions);
    }

    handleChange(e){
        this.taskToInsert[e.target.name] = e.target.value;
    }

    handleClick(){
        this.taskToInsert['WhoId'] = this.whoId;
        console.log('taskToInsert' , this.taskToInsert);
        insertTask({t : this.taskToInsert}).then((result) => {
            console.log('Success');
        }).catch((err) => {
            console.log('Error', err);
        });

        this.template.querySelector('.des').value=null;
        this.template.querySelector('.cbox').value=null;
    }

    fireEvent(){
        this.dispatchEvent(new CustomEvent('cls'));
    }

    handleSelect(e){
        console.log('handleSelect');
        let task = e.currentTarget.value;      
        task = JSON.parse(JSON.stringify(task));
        //task = JSON.stringify(task);
        console.log('task id= ', task);
        if(e.currentTarget.checked){
            this.updateArr.push(task);
        }else{
            this.updateArr = this.updateArr.filter(item => {
                return item !== task;
            });
        } 
    }

    handleUpdate(){
        console.log('update ids => ', this.updateArr);
        if(this.updateArr.length>0){
            updateTask({taskIds : this.updateArr}).then((result) => {
                console.log('result', result);
            }).catch((err) => {
                console.log('error', err);
            });
        }else{
            alert('Nothing to update');
        }
        let cbox = this.template.querySelectorAll('.chkbox');
        cbox.forEach(element => {
            element.checked = false;
        });
        this.updateArr = [];
    }
}