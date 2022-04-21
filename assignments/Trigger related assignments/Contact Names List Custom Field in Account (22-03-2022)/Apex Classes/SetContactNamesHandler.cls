/*
------------------------------------------------------
	Handler  class for SetContactNames Trigger
	Author		: Rishabh Sharma
	Created		: 22/03/2022
------------------------------------------------------
*/
public class SetContactNamesHandler {
    //simple method to handle data after insert event by calling helper methods | Created by Rishabh Sharma | 22/03/2022
    public static void afterInsert(List<Contact> currentContacts){
        SetContactNamesHelper.setContactNames(currentContacts);
    }
}