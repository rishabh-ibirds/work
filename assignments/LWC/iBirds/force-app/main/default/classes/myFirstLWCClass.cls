public class myFirstLWCClass {
    @AuraEnabled(cacheable=true)
    public static List<Contact> fetchCon(){
        return [select id, Name, firstname, lastname, Email, (SELECT Id, Subject, status FROM Tasks) from contact limit 50];
    }
    
    @AuraEnabled
    public static void insertCon(Contact con){
        if(con != null){
            insert con;
        }
    }
    
    @AuraEnabled
    public static void insertTask(Task t){
        if(t != null){
            insert t;
        }
    }
    
    @AuraEnabled
    public static void updateTask(List<Id> taskIds){
        List<Task> toUpdateTasks = new List<Task>();
        system.debug('taskIds ==> ' + taskIds);
        if(taskIds.size()>0){
            for(Id i : taskIds){
                Task t = new Task(Id = i, Status = 'Completed');
                toUpdateTasks.add(t);
            }
            update toUpdateTasks;
        }
    }
}