/* 
    Controller to fetch related contacts under accounts section
    Author: Rishabh Sharma
*/
public class ContactsUnderAccounts{
    
    public List<Account> acc {get;set;}
    public Map<String, List<Contact>> conRecords {get; set;}
    public List<ContactsUnderAccountsWrap> relationList {get; set;}

    public ContactsUnderAccounts(){
        conRecords = getContacts();
        acc = new List<Account>();
        acc = [select name from account where id in :conRecords.keySet()];
        relationList = new List<ContactsUnderAccountsWrap>();
        fillRelationList();
    }
 
    // created by Najab Maghribi | function to return map that classifies contacts based on accountid | dated 14-03-2022    
    public Map<String, List<Contact>> getContacts(){
        /*--------------WHAT THIS FUNCTION DOES ------------------------
        -conRecordsMap will store the final result where the key is account id and value is a list of contacts related with it
        -conMap is used here to fetch the contacts in a map. alternatively a list could also have been used.
        -conRecords is a list that will keep changing its pointer according to the key (accountid) to populate values (list of related contacts) without overwriting
        */
        Map<String, List<Contact>> conRecordsMap = new Map<String, List<Contact>>();
        Map<Id, Contact> conMap = new Map<Id, Contact>([SELECT Id, Name, FirstName, LastName, Email, Phone, AccountId FROM Contact ORDER BY LastModifiedDate desc Limit 50]);
        List<Contact> conRecords = new List<Contact>();
        for(Contact conRec: conMap.values()){
            if(conRecordsMap != null && conRecordsMap.containsKey(conRec.AccountId)){
                conRecords = conRecordsMap.get(conRec.AccountId);
            }else{
                conRecords  = new List<Contact>();
            }
            conRecords.add(conRec);
            conRecordsMap.put(conRec.AccountId, conRecords);
        }
        return conRecordsMap;
    }
    
    // created by Rishabh Sharma | function to fill wrapper class list | dated 15-03-2022
    public void fillRelationList(){
        for(Account a: acc){
            relationList.add(new ContactsUnderAccountsWrap(a, conRecords.get(a.id)));
        }
    }
    
    // created by Rishabh Sharma | wrapper class for added functionality | dated 15-03-2022
    public class ContactsUnderAccountsWrap{
        public Account ownerAcc {get;set;}
        public List<Contact> conRecords {get;set;}
        public ContactsUnderAccountsWrap(Account acc, List<Contact> conRecords){
            this.ownerAcc = acc;
            this.conRecords = conRecords;
        }
    }
}