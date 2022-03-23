/*
------------------------------------------------------
	Helper class for SetContactNamesHandler
	Author		: Rishabh Sharma
	Created		: 22/03/2022
------------------------------------------------------
*/
public class SetContactNamesHelper {
    // helper method to display contact names in custom field | created by Rishabh Sharma | 22/03/2022
    public static void setContactNames(List<Contact> currentContacts){
        List<Account> updateAccounts = new List<Account>();
        Set<Id> accId = new Set<id>();
        for(Contact con : currentContacts){
            accId.add(con.AccountId);
        }
        Map<Id, List<String>> accountContactNamesMap = new Map<Id,List<String>>();
        for(Contact con : [select FirstName, LastName, id, AccountId from Contact where AccountId in :accId]){
            List<String> relatedCon = accountContactNamesMap.get(con.AccountId);
            if(relatedCon == NULL){
                relatedCon = new List<String>();
            }
            String contactName = con.FirstName != null ? con.FirstName + ' ' + con.LastName : con.LastName;
            relatedCon.add(contactName);
            accountContactNamesMap.put(con.AccountId, relatedCon);
        }
        for(Account acc : [select id, Related_Contacts__c  from Account where Id in :accountContactNamesMap.keySet()]){
            if(accountContactNamesMap.containsKey(acc.Id)){
               acc.Related_Contacts__c = accountContactNamesMap.get(acc.Id).toString(); 
            }
            updateAccounts.add(acc);
        }
        if(updateAccounts.size()>0){
        	update updateAccounts;
        }
    }
}