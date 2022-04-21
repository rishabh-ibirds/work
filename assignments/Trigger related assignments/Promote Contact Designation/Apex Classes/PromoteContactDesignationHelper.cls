/*
	Helper class for PromoteContactDesignationHandler
	Author	: Rishabh Sharma
	Created : 23/03/2022
*/
public class PromoteContactDesignationHelper {
    public static void checkAndPromote(List<Contact> currentContacts){
        List<String> desPicklist= new List<String>();
		Schema.DescribeFieldResult fieldResult = Contact.Designation__c.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		for( Schema.PicklistEntry pickListVal : ple){
			desPicklist.add(pickListVal.getLabel());
		}
        for(Contact con : currentContacts){
            if(con.DesignationCompleted__c){
                con.DesignationCompleted__c=false;
                Integer index = desPicklist.indexOf(con.Designation__c);
                if(index!=-1 || index!=0){
                    con.DesignationCompleted__c = false;
                    index--;
                    con.Designation__c=desPicklist.get(index);
                }
            }
        }
    }
}