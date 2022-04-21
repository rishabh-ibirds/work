/*
	Account trigger helper class
	Author     : Rishabh Sharma
	Created    : 19-04-2022
	Description: Contains method to change ownerId if billing postal code is changed in
				 Account object given that Territory__c contains that zip code.
*/
public class AccountTriggerHelper {
    
    //method to update owner according to BillingPostalCode before inserting a new account. | Created by Rishabh Sharma | 19-04-2022
/*
    public static void beforeInsert(List<Account> newRecords){
        Set<String> postalCodes = new Set<String>();
        for(Account acc : newRecords){
                postalCodes.add(acc.BillingPostalCode);
        }
        List<Territory__c> territoryRecords = [select Name, OwnerId from Territory__c where Name in :postalCodes];
        
        if(territoryRecords.size() > 0){
            Map<String, Id> zipOwnerMap = new Map<String, Id>();
            for(Territory__c t : territoryRecords){
                zipOwnerMap.put(t.Name, t.OwnerId);
            }
            
            for(Account acc : newRecords){
                if(zipOwnerMap.get(acc.BillingPostalCode) != null){
                    acc.OwnerId = zipOwnerMap.get(acc.BillingPostalCode);
                }
            }
        }
    }
*/    
    // method to handle OwnerId across Account and its related opportunities and contacts when updated. | Created by Rishabh Sharma | 19-04-2022
    public static void handleBillingAddress(Map<Id, Account> newRecords, Map<Id, Account> oldRecords){
        Set<Id> changedAddressIds = new Set<Id>();
        Set<String> postalCodes = new Set<String>();
        for(Account acc : newRecords.values()){
            if(acc.BillingPostalCode != oldRecords.get(acc.Id).BillingPostalCode){               	
                changedAddressIds.add(acc.Id);
                postalCodes.add(acc.BillingPostalCode);
            }
        }
        if(postalCodes.size() > 0){
            List<Territory__c> territoryRecords = [select Name, OwnerId from Territory__c where Name in :postalCodes];
            
            if(territoryRecords.size() > 0){
                Map<String, Id> zipOwnerMap = new Map<String, Id>();
                
                for(Territory__c t : territoryRecords){
                    zipOwnerMap.put(t.Name, t.OwnerId);
                }
                
                List<Account> accToUpdate = [select id, OwnerId, BillingPostalCode
                                             from Account
                                             where Id in :changedAddressIds];
                
                List<sObject> finalUpdateList = new List<sObject>();
                Set<Id> filteredAccountIds = new Set<Id>();
                Map<Id, String> accRelatedOwnerMap = new Map<Id, Id>();
                
                for(Account acc : accToUpdate){
                    Id owner = zipOwnerMap.get(acc.BillingPostalCode);
                    if(owner != null){
                        acc.OwnerId = owner;
                        filteredAccountIds.add(acc.Id);
                        finalUpdateList.add(acc);
                        accRelatedOwnerMap.put(acc.Id, acc.OwnerId);
                    }
                }
                
                if(filteredAccountIds.size() > 0){
                    List<Opportunity> oppToUpdate = [select Id, OwnerId from Opportunity 
                                                     where IsClosed=false and 
                                                     AccountId in :filteredAccountIds];
                    
                    List<Contact> conToUpdate = [select Id, OwnerId from Contact 
                                                 where AccountId in :filteredAccountIds];
                    
                    if(oppToUpdate.size() > 0){
                        for(Opportunity opp : oppToUpdate){
                            opp.OwnerId = accRelatedOwnerMap.get(opp.AccountId);
                            finalUpdateList.add(opp);
                        }
                    }
                    
                    if(conToUpdate.size() > 0){
                        for(Contact con : conToUpdate){
                            con.OwnerId = accRelatedOwnerMap.get(con.AccountId);
                            finalUpdateList.add(con);
                        }
                    }
                    
                    update finalUpdateList;
                }
            }
        }
    }
}