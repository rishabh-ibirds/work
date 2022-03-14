/* custom controller for contacts to add a new account to the contacts
    Author: Rishabh Sharma
    dated 09-03-2022
*/ 

public class ContactsController{
    public Account relatedAccount{get; set;}
    public List <ContactsControllerWrapper> fetchContacts{get; set;}
    
    public ContactsController(){
        relatedAccount = new Account();
        fetchContacts = new List<ContactsControllerWrapper>();
        getContacts();
    }
    
    //created by rishabh sharma : function to fetch contact details in vfpage: dated 09-03-2022
    public void getContacts(){
        for(Contact con : [select id, salutation, firstname, lastname, Email, Phone from Contact where AccountId=null]){
            fetchContacts.add(new ContactsControllerWrapper(con));
        }
    }
     
    // created by rishabh sharma: function to add accounts : dated 10-03-2022
    public void insertAccount(){
        List <Account> insertionList = new List<Account>();
        List <Contact> updateContacts = new List<Contact>();
        if(relatedAccount.Name!=null){
            insertionList.add(relatedAccount);
            insert insertionList;
            Boolean errMsg = false;
            for(Integer i=0; i<fetchContacts.size(); i++){
                ContactsControllerWrapper c=fetchContacts.get(i);
                if(c.selected){                   
                    if(c.con.lastname==null){
                        if(!errMsg){
                            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.FATAL,'Please enter last name on selected fields.'));
                            errMsg=false;
                        }
                        continue;
                    }
                    c.con.AccountId=relatedAccount.Id;
                    updateContacts.add(c.con);
                    fetchContacts.remove(i);
                    i--;
                }
            }
            if(updateContacts!=null){
                upsert updateContacts;
                relatedAccount=new Account();
            }
        }else{
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.FATAL,'Please enter an Account Name'));
            return;
        }
    }
    
   // created by rishabh sharma | dated 11-03-2022 | function to add blank rows
    public void addRow(){
        fetchContacts.add(new ContactsControllerWrapper(new Contact()));
    }

    //created by rishabh sharma | dated 11-03-2022 | function to delete contacts
    public void deleteContact(){
        List<Contact> deletionList = new List<Contact>();
        for(Integer i=0; i<fetchContacts.size(); i++){
            if(fetchContacts.get(i).selected){
                if(fetchContacts.get(i).con.Id == null){
                    fetchContacts.remove(i);
                    i--;
                }else{
                    deletionList.add(fetchContacts.get(i).con);
                    fetchContacts.remove(i);
                    i--;
                }
            }
        }
        if(deletionList.size()>0){
            delete deletionList;
        }
    }
   
    //created by rishabh sharma : wrapper class for added functionality: dated 10-03-2022
    public class ContactsControllerWrapper {
        public Contact con {get; set;}
        public Boolean selected {get; set;}

        public ContactsControllerWrapper(Contact c) {
            con = c;
            selected = false;
        }
    }
}