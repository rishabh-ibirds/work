/* 
 * Test Class for Account Trigger
 * Author: Rishabh Sharma
 * Created: 29/03/2022
 */
@isTest 
public class AccountTriggerTest {
    @testSetup static void setup(){
        Test.startTest();
        	AccountTriggerTerritoryTestUtility.setupUtility();
        	//AccOppTriggerTestUtility.setupUtility();
        Test.stopTest();
    }
    @isTest static void triggerTest(){
        
    }
}