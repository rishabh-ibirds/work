/*
	Territory trigger helper class
	Author	   : Rishabh Sharma
	Created    : 19-04-2022
	Description: Contains methods to validate and handle data in territory object
*/
public class TerritoryTriggerHelper {
    // method to validate a territory object. | Created by Rishabh Sharma | 19-04-2022
    public static void validateTerritory(List<Territory__c> newRecords){
        List<Territory__c> filteredRecords = newRecords.deepClone(false, false, false);
        Set<Id> updatedRecordsIds = new Set<Id>();
        Set<String> zipCodes = new Set<String>();
        Set<Id> owners = new Set<Id>();
        for(Territory__c t : newRecords){
            zipCodes.add(t.Name);
            owners.add(t.OwnerId);            
            if(t.Id != null){
                updatedRecordsIds.add(t.Id);
            }
        }
        List<Territory__c> duplicateTerritories = [select name, OwnerId from Territory__c 
                                                   where Id not in :updatedRecordsIds
                                               	   and(Name in :zipCodes or OwnerId In :owners)];
        
        if(duplicateTerritories.size() > 0){
            Set<String> duplicateZIP = new Set<String>();
            Set<Id> duplicateOwner = new Set<Id>();
            for(Territory__c t : duplicateTerritories){
                duplicateZIP.add(t.Name);
                duplicateOwner.add(t.OwnerId);
            }

            for(Integer i = filteredRecords.size()-1 ; i >= 0; i--){
                if(duplicateZIP.contains(filteredRecords.get(i).Name) 
                   || duplicateOwner.contains(filteredRecords.get(i).OwnerId)){
                    filteredRecords.remove(i);
                }
            }
            if(filteredRecords.size() > 0){
                upsert filteredRecords;
            }      
            newRecords.get(0).addError('Duplicate Records Found. They Won\'t be inserted');
        }
    }
   
    // method to change account owner according to the changes made in Territory object. | Created by Rishabh Sharma | 19-04-2022
    public static void afterUpdate(List<Territory__c> newTerritories){
        Map<String, Id> zipMap = new Map<String, Id>();
        for(Territory__c t : newTerritories){
            zipMap.put(t.Name, t.OwnerId);
        }
        
        List<Account> relatedAccounts = [select BillingPostalCode, OwnerId from Account where BillingPostalCode in :zipMap.keySet()];
        
        for(Account acc : relatedAccounts){
            acc.OwnerId = zipMap.get(acc.BillingPostalCode);
        }
        update relatedAccounts;
    }
}