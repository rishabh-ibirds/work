/* Handler class for PromoteContactDesignation trigger
   Author	: Rishabh Sharma
   Dated	: 23/03/2022
*/
public class PromoteContactDesignationHandler {
    public static void promote(List<Contact> currentContacts){
        PromoteContactDesignationHelper.checkAndPromote(currentContacts);
    }
}