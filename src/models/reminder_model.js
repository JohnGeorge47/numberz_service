import mysql from "mysql2/promise"
import MySQL from "../../lib/mysql/mysql"
import errorhandler from "../../lib/error_handler/error_handler"

class ReminderModel extends MySQL {
    constructor() {
        super()
    }
    //Bulk create api
    async BulkCreateReminders(data) {
        let exists_query="SELECT 1 as result from reminders WHERE EXISTS(SELECT * FROM reminders WHERE invoice_id=? AND days_to_due=0) limit 1"
        let query = `INSERT INTO reminders
                  (invoice_id,
                    reminder_date,
                    template_id,
                    reminder_type,
                    reminder_method,
                    status,
                    days_to_due,
                    due_date) 
                   VALUES ?`

        try {
            let exists_resp=await this.connection.query(exists_query,[data[0][0]])
            console.log(exists_resp)
            let res=Object.values(JSON.parse(JSON.stringify(exists_resp[0])))
            console.log(res)
            if (res.length!==0){
                throw "The particular invoice exists"
            }
            let resp=await this.connection.query(query, [data])
            return resp

        } catch (error) {
            return error
        }
    }

    async UpdateDueDate(invoice_id,due_date){
        let update_query=`UPDATE reminders 
                          SET reminder_date=date_sub(?,interval days_to_due DAY),
                          due_date=?
                          where invoice_id=?`
        try {
            console.log(due_date)
            due_date=new Date(due_date).toISOString().slice(0, 19).replace('T', ' ')
            console.log(due_date)
            let response=await this.connection.query(update_query,[due_date,due_date,invoice_id])
            return response
        } catch (error) {
            return error
        }
    }

    async UpdateReminderSingleReminder(invoice_id,reminder_date,template_id,reminder_type,reminder_method){
        let update_query=``
    }
/**
 * 
 * @param  invoice_id 
 * @param  days_to_due 
 * @param  template_id 
 * @param  reminder_type 
 * @param reminder_method 
 * @param due_date
 * You selectively create or update a resource here based on weather its already present
 * or not 
 */
    async AddSingleReminder(
        invoice_id,
        days_to_due,
        template_id,
        reminder_type,
        reminder_method,
        due_date
        ){
        /**
         * This can be optimised better if we have a unique column which takes in a hash 
         * or a combination of due_date+days_to_due+invoice_id assuming that we have one
         * reminder on a single day
          */
         let update_query=`UPDATE reminders SET
                           reminder_date=date_sub(due_date,interval ? DAY),
                           template_id=?,
                           reminder_type=?,
                           reminder_method=?
                           where invoice_id=? AND days_to_due=?`
         
                           
         let  create_query=`INSERT INTO reminders 
                            (invoice_id,
                                reminder_date,
                                template_id,
                                reminder_type,
                                reminder_method,
                                status,
                                days_to_due,
                                due_date
                                )VALUES(?,?,?,?,?,?,?,?)`        
         try {
             let response
             /**
              * We can optimise this but currently I'm checking wether the particular reminder 
              * exists for that day if it does do an update otherwise an insert
              */
             let exists=await this.CheckExistence(invoice_id,days_to_due)
             console.log(exists)
             if (exists){
                response=await this.connection.query(update_query,[
                    days_to_due,
                    template_id,
                    reminder_type,
                    reminder_method,
                    invoice_id,
                    days_to_due
                ])
             }else{
                let currDate = new Date(due_date)  
                currDate.setDate(currDate.getDate() - days_to_due);
                let mysqldate = currDate.toISOString().slice(0, 19).replace('T', ' ')
                response=await this.connection.query(create_query,[
                    invoice_id,
                    mysqldate,
                    template_id,
                    reminder_type,
                    reminder_method,
                    "not_sent",
                    days_to_due,
                    due_date
                ])
             }
          if (days_to_due==0){
                /**
                 * Here if the days_to_due=0 it means this is the due date for the reminder
                 * Due to this we need to update all reminders which have been stored 
                 * for that particular user with the correct reminder date since 
                 * reminderdate=due_date-days_to_due
                 */
                await this.UpdateDueDate(invoice_id,due_date)
          }
          console.log(response)
          return response
         } catch (error) {
           let newerr=new errorhandler.MySQLErr(error.message,3,500) 
           throw newerr
         }
    }


    async CheckExistence(invoice_id,days_to_due){
        let exists_query="SELECT 1 as result from reminders WHERE EXISTS(SELECT * FROM reminders WHERE invoice_id=? AND days_to_due=?) limit 1"
        try {
            let exists_resp=await this.connection.query(exists_query,[invoice_id,days_to_due])
            let res=Object.values(JSON.parse(JSON.stringify(exists_resp[0])))
            if(res.length!==0){
               return true 
            }
            return false
        } catch (error) {
            let newerr = new errorhandler.MySQLErr(error.message,3,500)
            throw newerr
        }

    }

}

export default  ReminderModel