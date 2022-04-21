/*
	Controller Class for bankReport LWC
	Author : Rishabh Sharma
	Created: 14-04-2022
*/
public class BankReportLWCController {
    
    static Map <Date, Map<String, Bank__c>> dateMap = new Map <Date, Map<String, Bank__c>>();
	static Map<String, Map<String, Bank__c>> bankMap = new Map<String, Map<String, Bank__c>>();
    
    //method to return present date of org | Created by Rishabh Sharma | 15-04-2022
    @AuraEnabled(cacheable=true)
    public static Date getToday(){
        return System.today();
    }
    
    // method to return a map with labelled info for each bank | Created By Rishabh Sharma | 14-04-2022
    @AuraEnabled(cacheable=true)
    public static Map<String, Map<String, Bank__c>> getBankRecords(Date curDate){
        Date beginDate = curDate - 95;
        Boolean foundAmount = false; 
            
        List<Bank__c> rawBankList = [select Bank_Name__c, Collection_Date__c, Amount__c from Bank__c 
                                     where Collection_Date__c <= :curDate and Collection_Date__c >= :beginDate 
                                     and Amount__c != 0];
        
        for(Bank__c b : rawBankList){
            Map<String, Bank__c> bankRecords = dateMap.get(b.Collection_Date__c);
            if(bankRecords == null){
                bankRecords = new Map<String, Bank__c>();
            }
            bankRecords.put(b.Bank_Name__c, b);
            dateMap.put(b.Collection_Date__c, bankRecords);
        }
        
        Date today = getDate(curDate);
        Date yesterday = getDate(today-1);
        Date week = getDate(today-7);
        Date month = getDate(System.today().toStartOfMonth());
        Date threeMonths= getDate(today-90);
        Map<String, Bank__c> high = getHighest(rawBankList);
        Map<String, Bank__c> low = getLowest(rawBankList);
        
       	fillMap(today, 'today');
        fillMap(yesterday, 'yesterday');
        fillMap(week, 'week');
        fillMap(month, 'month');
        fillMap(threeMonths, 'threeMonths');
        
        for(String str : bankMap.keySet()){
            Map<String, Bank__c> bankMap = bankMap.get(str);
            if(high.get(str)==null){
                bankMap.put('highest', new Bank__c(Amount__c = 0));
            }else{
            	bankMap.put('highest', high.get(str));
            }
            if(low.get(str)==null){
                bankMap.put('lowest', new Bank__c(Amount__c = 0));
            }else{
            	bankMap.put('lowest', low.get(str));
            }            
        }
        
        return bankMap;
    }
    
    // method to fill date in bankMap with label | Created By Rishabh Sharma | 14-04-2022
    public static void fillMap(Date today, String todayStr){
        List<String> banks = getPickListValuesIntoList();
        Map<String, Map<String, Bank__c>> bankDateMap = new Map<String, Map<String, Bank__c>>();
        for(String bank : banks){
            Map<String, Bank__c> filteredRecords = bankMap.get(bank);
            if(filteredRecords == null){
                filteredRecords = new Map<String, Bank__c>();
            }
            Map<String, Bank__c> banksToday = dateMap.get(today);
            Bank__c currentBank = new Bank__c();
            if(banksToday == null){
                currentBank = new Bank__c(Bank_Name__c = bank , Amount__c = 0, Collection_Date__c = today);
            }else{
                currentBank = banksToday.get(bank);
            }
            if(currentBank == null){
                currentBank = new Bank__c(Bank_Name__c = bank , Amount__c = 0, Collection_Date__c = today); 
            }
            filteredRecords.put(todayStr, currentBank);
            bankDateMap.put(bank, filteredRecords);
            bankMap.putAll(bankDateMap);
        }
    }
    
    //method to return picklist values as a list of string | Created By Rishabh Sharma | 14-04-2022
    public static List<String> getPickListValuesIntoList(){
       List<String> pickListValuesList= new List<String>();
		Schema.DescribeFieldResult fieldResult = Bank__c.Bank_Name__c.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		for( Schema.PicklistEntry pickListVal : ple){
			pickListValuesList.add(pickListVal.getValue());
		}     
		return pickListValuesList;
    }
    
    //method to return a map with objects containing highest amount for each bank | Created By Rishabh Sharma | 14-04-2022
    static Map<String, Bank__c> getHighest(List<Bank__c> bankRecs){
        Map<String, Bank__c> highest = new Map<String, Bank__c>();
        for(Bank__c b : bankRecs){
            Bank__c max =  highest.get(b.Bank_Name__c);
            if(max == null){
                max = b;
                highest.put(b.Bank_Name__c, max);
            }else if (max.Amount__c < b.Amount__c){
                highest.put(b.Bank_Name__c, b);
            }
        }
        return highest;
    }
    
    //method to return a map with objects containing lowest amount for each bank | Created By Rishabh Sharma | 14-04-2022
    static Map<String, Bank__c> getLowest(List<Bank__c> bankRecs){
        Map<String, Bank__c> lowest = new Map<String, Bank__c>();
        for(Bank__c b : bankRecs){
            Bank__c min =  lowest.get(b.Bank_Name__c);
            if(min == null){
                min = b;
                lowest.put(b.Bank_Name__c, min);
            }else if (min.Amount__c > b.Amount__c){
                lowest.put(b.Bank_Name__c, b);
            }
        }
        return lowest;
    }
    
    //method to get date where last collection was made in any of the banks in 5 days from given date | Created By Rishabh Sharma | 14-04-2022
    static Date getDate(Date currentDate){
        Date lastWorkingDate = currentDate;
        Datetime lastWorkingDateConvert = lastWorkingDate;
        for(Integer i = 0; i < 5; i++){
            lastWorkingDate = currentDate-i;
            lastWorkingDateConvert = lastWorkingDate;
            String weekDay = lastWorkingDateConvert.format('EEE');
            
            if(dateMap.containsKey(lastWorkingDate) 
               && weekDay != 'Sun' && weekDay != 'Sat'){
                return lastWorkingDate;
            }			
        }
        String weekDay = lastWorkingDateConvert.format('EEE');
        if(weekDay == 'Sun'){
            lastWorkingDate += 1;
        }
        if(weekDay == 'Sat'){
            lastWorkingDate += 2;
        }
        return lastWorkingDate;
    }
}