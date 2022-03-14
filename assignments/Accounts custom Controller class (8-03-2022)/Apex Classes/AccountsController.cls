/*
Author : Najab Maghribi
Description : In this controller we are showing account records in tabel and Creating a new record.
Date : 07-March-2022
Methods Name: createAccountRecord(), getAccounts(),
*/

public class AccountsController{

    public Account accountRecord {get;set;}
    public List<Account> accountRecords {get;set;}
    public Integer rowIndex {get; set;}
    public List<Account> accRecords {get;set;}
    // Constructor
    public AccountsController(){
        accountRecord = new Account();
        accountRecords = new List<Account>();
        fetchAccounts();
    }
    
    
    // Added by: Najab Maghribi 07-March-2022 : Fetching Account Records.
    public void fetchAccounts(){
        accRecords = new List<Account>();
        accRecords = [SELECT Id, Name, Type, AccountNumber, Site FROM Account];
        accRecords.add(new Account());
    }
    
    //Added by: Rishabh :adding blank row
    public void addBlankRow(){
        accRecords.add(new Account());
    }
    
    // Added By : Rishabh Sharma 08-March-2022 : passing row index
    public void modifiedRecord(){
        system.debug(rowIndex);
        accountRecord = accRecords.get(rowIndex);
    }
    
    // Added By : Najab Maghribi 07-March-2022 : In this method we are inserting a account record.
    public void createAccountRecord(){
        //accountRecords.add(accountRecord);
        
        if(accRecords.size()>0){
            UPSERT accRecords;
        }
        accountRecords = new List<Account>();
    }
    
    // Added By : Rishabh Sharma 08-March-2022 : Method to delete records.
    public void deleteAccountRecord(){
        if(rowIndex==null){
            return;
        }
        
        if(accRecords.get(rowIndex).id==null){
            accRecords.remove(rowIndex);
            return;
        }
          
        accountRecords.add(accRecords.get(rowIndex));
        if(accountRecords.size()>0){
            Delete accountRecords;
        }
        accRecords.remove(rowIndex);
        accountRecords = new List<Account>();
    }
}