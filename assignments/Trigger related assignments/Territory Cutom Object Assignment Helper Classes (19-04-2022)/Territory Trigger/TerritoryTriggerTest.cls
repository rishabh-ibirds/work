/*
	Test Class for TerritoryTrigger
	Author     : Rishabh Sharma
	Created    : 19-04-2022
	Description: Covers code in TerritoryTrigger, TerritoryTriggerHandler, TerritoryTriggerHelper
*/
@isTest
public class TerritoryTriggerTest {
    
    //method to cover code inside TerritoryTrigger, TerritoryTriggerHandler, TerritoryTriggerHelper | Created by Rishabh Sharma | 19-04-2022
	@isTest static void triggerTest(){
        try{
            Territory__c t = new Territory__c(Name = '301001');
            insert t;
            t.Name = '305001';
            update t;
            Territory__c tCopy = new Territory__c(Name = t.Name);
            insert tCopy;
        }catch(Exception e){
            Boolean expectedExceptionThrown =  (e.getMessage().contains('Duplicate Records Found. They Won\'t be inserted')) ? true : false;
			System.AssertEquals(expectedExceptionThrown, true);
        }
    }
}