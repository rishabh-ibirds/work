public class ContactPagination {
    public String search{get;set;}
    public List<ContactPaginationWrapper> contactList {get;set;}
    public String type{get; set;}
    List<string> conditions = new List<string>();
    private String sortDirection = 'ASC';
    private integer totalRecs = 0;
    private integer offsetSize = 0;
    public integer limitSize{get; set;}
    private String sortExp = 'name';  
    public String sortExpression
    {
     get
     {
        return sortExp;
     }
     set
     {
       //if the column is clicked on then switch between Ascending and Descending modes
       if (value == sortExp)
         sortDirection = (sortDirection == 'ASC')? 'DESC' : 'ASC';
       else
         sortDirection = 'ASC';
       sortExp = value;
     }
    }
    
    public ContactPagination(){
         limitSize = 10;
         contactList  = new List<ContactPaginationWrapper>();      
    }
    
    public String getSortDirection(){
        //if not column is selected 
        if (sortExpression == null || sortExpression == '')
          return 'ASC';
        else
         return sortDirection;
    }
    
    public void searchCon(){
        totalRecs = 0;
        offsetSize = 0;
        if(contactList !=null && contactList.size()>0){
             contactList=new List<ContactPaginationWrapper>();
        }
        searchContacts();
        conditions.clear();
    }
    
    public Void searchContacts(){
    
        System.debug('Total Records is ==>'+totalRecs);
        System.debug('offsetSize is ==>'+offsetSize);
        
        if(contactList != null && !contactList.isEmpty()){
              contactList.clear();
        }
        String strQuery ='SELECT Id, Name, Email, Phone, Type__c From Contact';
        
        if(search !=null && search !=''){
              conditions.add('Name Like \'%' + search +'%\' ');
        }
        if(search !=null && search !=''){
              conditions.add('Email Like\'%' + search +'%\' ');
        }
        
        if (conditions.size() > 0) {
              strQuery += '  WHERE ' + conditions[0];
              for (Integer i = 1; i < conditions.size(); i++)
              strQuery += '  OR ' + conditions[i];
        }
        if(totalRecs !=null && totalRecs ==0){
              List<Contact> conTemp = Database.query(strQuery);
              totalRecs = (conTemp !=null &&conTemp.size()>0)?conTemp.size():0;
        }
        
        system.debug('strQuery ==>'+strQuery );
             // add sort and limits at the end  
        strQuery += ' ORDER BY ' + sortExpression +' ' + sortDirection + ' LIMIT ' + limitSize + ' OFFSET ' + offsetSize;
          
        List<Contact>conList=Database.query(strQuery);
        
        for(Contact c : conList){
            contactList.add(new ContactPaginationWrapper(c));
        }
    }
    
    public void FirstPage(){
        offsetSize = 0;
        searchContacts();
    }
    public void previous(){
        offsetSize = (offsetSize-limitSize);
        searchContacts();
    }
    public void next(){
        offsetSize = offsetSize + limitSize;
        searchContacts();
    }
    public void LastPage(){
        offsetSize = totalrecs - math.mod(totalRecs,limitSize);
        searchContacts();
    }
    public boolean getprev(){    
        if(offsetSize == 0){    
            return true;
        }
        else {    
            return false;
        }
    }
    
    public boolean getnxt(){
        if((offsetSize + limitSize) > totalRecs){
            return true;
        }
        else {        
            return false;
        }
    }
    
    public void updateContacts(){
        List<Contact> toUpdate = new List<Contact>();
        for(ContactPaginationWrapper c : contactList){
            if(c.selected){
                c.conRec.Type__c=type;
                toUpdate.add(c.conRec);
                c.selected=false;
            }
        }
        if(toUpdate.size()>0){
            update toUpdate;
        }
        type=null;
        searchContacts();
    }
    
    public class ContactPaginationWrapper{
        public boolean selected {get; set;}
        public Contact conRec {get; set;}
        
        public ContactPaginationWrapper(Contact c){
            this.selected = false;
            this.conRec = c;
        }
    }
}