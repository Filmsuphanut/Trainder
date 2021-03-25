class node {
    constructor(data,next= null){
        this.data = data;
        this.next = next;

    }
}

class LinkedList {
    constructor(firstData =null){
         if(firstData==null){
             this.head = null
             this.tail = null
             this.cur = null
         }
         else {
             let newNode = new node(firstData)
             this.head  = newNode
             this.tail = newNode 
             this.cur = null

         }

    }
    isEmpty(){
        return this.head ==null;
    }
    size(){
       var  cnt = 0
        
        if (this.isEmpty() ){
            cnt = 0
        }
        else {
            this.cur = this.head
            cnt =1 
            while(this.cur.next != null){
                cnt+=1 
                this.cur = this.cur.next
            }
        }
        this.cur = null
        return cnt 
    }
    append(data){
        let newNode = new node(data)
        if(this.isEmpty()){
            this.head  = newNode
            this.tail = newNode
        }
        else {
            this.tail.next = newNode
            this.tail = newNode
        }
    }
    pophead(){
        if(this.isEmpty()){
            console.log('Queue is already Empty Can not pop head')
            return null
        }
        else {
            var temp = this.head
            if(this.head != this.tail){
                this.head = this.head.next
            }
            return temp.data  

        }
            

    }
    poptail(){
       this.cur =this.head
       if(this.isEmpty()){
           console.log('Queue is already Empty can not pop tail')
           return null
       }
       else {
           while(this.cur.next != this.tail){
               this.cur = this.cur.next
           }
           var temp = this.cur.data
           this.tail = this.cur
           this.tail.next = null
           return temp
           
       }


    }
    pTail(){
        console.log('tail = ' + this.tail.data)
    }
    searchby_ID(Id){
        this.cur =this.head
        
        while(this.cur.data.Id != Id){
            if(this.cur.next == null ){
                ss = 'Not found in this ID : ' + Id +'in Queue '
                console.log(ss)
                return null

            }
            

        }
        var temp =this.cur.data
        this.cur = null
        return temp
        
    }
    searchby_Paired_ID(Id){
        this.cur =this.head
        
        while(this.cur.data.Id != Id){
            if(this.cur.next == null ){
                ss = 'Not found in this PairID : ' + Id +'in Queue '
                console.log(ss)
                return null

            }
            

        }
        var temp =this.cur.data
        this.cur = null
        return temp
        
    }
    removebyId(Id){
        this.cur =this.head
        
        while(this.cur.data.Id != Id){
            if(this.cur.next == null ){
                ss = 'Not found in this ID : ' + Id +'in Queue '
                console.log(ss)
                return null

            }
            

        }
        var temp =this.cur.data
        this.cur.next = this.cur.next.next
        this.cur = null
        return temp
    }
    printList(){
        let str = ''
        this.cur = this.head
        while(this.cur != this.tail){
            str+=this.cur.data +' '
            this.cur = this.cur.next            
        }
        str+= this.cur.data
        console.log(str)
        
    }
    readAll_Id(){
        var arr = []
        this.cur = this.head
        while(this.cur !=this.tail){
            arr.push(this.cur.data)
        }
        arr.push(this.cur.data)
        this.cur = null
        return arr 
    }
    max_score(){
        // use for only score list 
        var maxx =  0 
        this.cur  = this.head 
        while(this.cur != this.tail.next){
            if(this.cur.data.score> maxx){
                maxx = this.cur.data.score
            }
        }
        this.cur =this.head()
        while(this.cur != this.tail.next){
            if(this.cur.data.score  == maxx){
                return this.cur.data.Id
            }
        }
        //this will return Id of whose max score is
    }
}
var lastPair_Id = 0
class Paired {
    
    constructor(ref_Id,chosen_Id){
        lastPair_Id += 1
        this.Id = lastPair_Id
        this.ref_Id = ref_Id
        this.chosen_Id = chosen_Id

    }
}
class SID {
     // Score and Id
     constructor(Id,score){
         this.Id = Id
         this.score = score
     }
}


let Q  = new LinkedList()

/*function cal_score(ref_Id,temp_Id){
    score = 0 
    dif_age  = Math.abs(ref.age-temp.age)
    //use these id search more datafield from database get out the object
    if(ref.genre == temp.genre){
        score +=0.75
    }
    if(ref.purpose == temp.purpose){
        score+=0.75
    }
    if(dif_age <=3){
        score+0.75
    }else if(dif_age >3 && dif_age <=5){
        score +=0.5
    }
    else if(dif_age >5 && dif_age<= 7){
        score +=0.25
    }
    


    return new SID(temp.Id,score)
}*/
function matching(Queue) {
    ref = Q.pophead()
    var lis = Q.readAll_Id()
    ref_Id  = ref.Id
    /*  
    var  scorelist   = new LinkedList()
    for temp of list{
        var chosen
        score_Id = cal_score(red_Id,temp)
        scorelist.append(score_Id)
        
    }
    chosen = scorelist.max_score()
    var p = new Paired(ref_Id,chosen.Id)
    return p
    */

}
/* 
    var  All_paired = new LinkedList()
    when click 
    Q.append(id)
    when leave 
    Q.removebyId(Id)
    paired = matching(Q)  >> paired is obj
    All_paired.append(paired)
    
    then get pair to use Vdo call 
    to use it for vdo call 
    paired = All_paired.searchby_Paired_ID(Id)

    
*/





