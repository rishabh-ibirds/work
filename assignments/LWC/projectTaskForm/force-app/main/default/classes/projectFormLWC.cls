/* 
    Apex Class to query and perform dml for lwc Project form
    Author : Rishabh Sharma
    Created: 08/04/2022 
*/
public with sharing class projectFormLWC {
    @AuraEnabled (cacheable = true)
    public static List<Project_Task__c> getProjectTasks(){
        return [select Id, Name, Completion_Date__c, Hours__c, Description__c, Task_Type__c, Project__c from Project_Task__c];
    }

    @AuraEnabled
    public static void updateProjectTasks(List<Project_Task__c> toUpdateRecs){
        if(toUpdateRecs.size()>0){
            upsert toUpdateRecs;
        }
    }

    @AuraEnabled(cacheable=true)
    public static Date getToday(){
        return System.today();
    }
}
