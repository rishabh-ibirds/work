public class ContactsLinkedToAccount{
    
    public Map<String, List<Contact>> conRecordsMap {get; set;}
    
    public ContactsLinkedToAccount(){
        conRecordsMap = new Map<String, List<Contact>>();
        getContacts();
    }
    
    public void getContacts(){
        Map<Id, Contact> conMap = new Map<Id, Contact>([SELECT Id, Name, FirstName, Account.Name, LastName, Email, Phone, AccountId FROM Contact where AccountId!=null ORDER BY LastModifiedDate desc]);
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
    }
}