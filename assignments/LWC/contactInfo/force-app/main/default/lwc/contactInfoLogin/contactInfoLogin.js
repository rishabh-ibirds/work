/*
    LWC to implement custom login for contacts using otp via email
    Author : Rishabh Sharma
    Created: 02-05-2022
*/
import { LightningElement } from 'lwc';
import validateContact from '@salesforce/apex/ContactInfoLWCController.validateContact';

export default class ContactInfoLogin extends LightningElement {

    contactId;
    otp;
    showInfo = false;

    //function to authorize contact using email/phone and otp | created by Rishabh Sharma | 04-05-2022
    handleLogin() {
        let txt = this.template.querySelector('.input');
        if (this.contactId == undefined) {
            validateContact({ user: txt.value }).then(result => {
                this.contactId = Object.keys(result)[0];
                this.otp = result[this.contactId];
                console.log('Id and otp', this.contactId, this.otp);
                txt.placeholder = "ENTER OTP";
                txt.value = "";
                this.template.querySelector('.title').innerText = "Verify";
                this.template.querySelector('.subtitle').innerText = "OTP has been sent to your email.";
                this.template.querySelector('lightning-icon').iconName = "utility:email";
                this.template.querySelector('lightning-button').label = "Verify";
                txt.setCustomValidity('');
                txt.reportValidity();
            }).catch(error => {
                txt.setCustomValidity('Invalid Email/Phone entered or contact does not have valid email');
                txt.reportValidity();
                //console.error('Error:', error);
            });
        } else {
            if (txt.value == this.otp) {
                this.showInfo = true;
            } else {
                txt.setCustomValidity('OTP invalid!');
                txt.reportValidity();
            }
        }
    }
}