/*
	Utility Class for AccountTriggerTest
	Author     : Rishabh Sharma
	Created    : 19-04-2022
	Description: Covers code in AccountTriggerHelper
*/
public class AccountTriggerTerritoryTestUtility {
    //method to cover code inside AccountTriggerHelper. | Created by Rishabh Sharma | 19-04-2022
    public static void setupUtility(){
        Territory__c t = new Territory__c(Name = '305001');
        insert t;
        Account acc = new Account(Name = 'ABC', BillingPostalCode = t.Name);
        insert acc;
        delete t;
        Contact con = new Contact(LastName = 'Bapu' , AccountId = acc.Id);
        Opportunity opp = new Opportunity(Name = 'Khan' , AccountId = acc.Id, StageName = 'Prospecting', CloseDate = Date.today());
        t = new Territory__c(Name = '301001');
        insert t;
        acc.BillingPostalCode = t.Name;
        update acc;
    }
}