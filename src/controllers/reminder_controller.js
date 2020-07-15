import ReminderModel from "../models/reminder_model"
let reminder_controller = {}

/**
 * reqBodyformat
 * {
 *  invoice_id:"123"
 *  due_date:"20-12-2020"
 *  reminder_type:"automated|manual|all"
 *  "reminder_method":"sms|email|all"
 * "template_id":1
 *  reminders:[
 *    {
 *       "reminder_day":"2",
 *       "reminder_type:"automated|manual|all",
 *       "reminder_method":"sms|email|all"
 *       template_id":1
 *    },
 *     {
 *       "reminder_day":"3",
 *       "reminder_type:"automated|manual|all",
 *       "reminder_method":"sms|email|all"
 *    }
 * ]
 * }
 */
/**
 * This function is used to do a bulk post request using it you can create a reminder for
 * a due date(The root level of the json) as well as multiple reminders which for other dates
 * It only allows POST/CREATE also you can use it to create a single due date reminder. 
 */
reminder_controller.post = async (req, res) => {
    if (!ValidateReminder(req.body)) {
        console.log("error here")
    }
    console.log(req.body)
    let to_insert = []
    let due_date = new Date(req.body.due_date).toISOString().slice(0, 19).replace('T', ' ')
    let invoice_id = req.body.invoice_id
    let reminder_type = req.body.reminder_type
    let reminder_method = req.body.reminder_method
    let reminder_status = "not_sent"
    to_insert.push([invoice_id, due_date, req.body.template_id, reminder_type, reminder_method, reminder_status, 0,due_date])
    if (req.body.reminders.length != 0) {
        req.body.reminders.forEach(element => {
            let rem_type = element.reminder_type
            let rem_method = element.reminder_method
            let currDate = new Date(req.body.due_date)
            currDate.setDate(currDate.getDate() - element.reminder_day);
            let mysqldate = currDate.toISOString().slice(0, 19).replace('T', ' ')
            to_insert.push(
                [
                    invoice_id,
                    mysqldate,
                    element.template_id,
                    rem_type,
                    rem_method,
                    reminder_status,
                    element.reminder_day,
                    due_date
                ]
            )
        });
    }
    let rem = new ReminderModel()
    try {
        let resp = await rem.BulkCreateReminders(to_insert)
        console.log(resp)
    } catch (err) {
        console.log(err)
    }
}

/**
 * Here only the update of the due dateis allowed
 * but it also changes the reminder_date for all other reminders of that transaction_id
 * accordingly.
 */
reminder_controller.put=async(req,res)=>{
    let transaction_id=req.params.transaction_id
    let new_date=req.body.due_date
    let due_date=new Date(new_date).toISOString().slice(0, 19).replace('T', ' ')
    try {
        let rem = new ReminderModel()
        let resp=await rem.UpdateReminder(transaction_id,due_date)
        console.log(resp)
        return res.json({
            "success":true
        })
    } catch (error) {
        console.log(error)
    }
}


reminder_controller.upsert=async(req,res)=>{
    let invoice_id = req.body.invoice_id
    let reminder_type = req.body.reminder_type
    let reminder_method = req.body.reminder_method
}

/**
 * Upsert is to both update or create selectively 
 */
reminder_controller.upsert=async(req,res)=>{
    let invoice_id=req.params.transaction_id
    let reminder_day=req.body.reminder_day
    let reminder_type = req.body.reminder_type
    let reminder_method = req.body.reminder_method
    let template_id=req.body.template_id
    try {
        let rem = new ReminderModel()
        let resp=await rem.AddSingleReminder(
            invoice_id,
            reminder_day,
            template_id,
            reminder_type,
            reminder_method,
            req.body.due_date
        )
        console.log(resp)
        return res.json({
            "success":true
        })
    } catch (error) {
         res.status(500).send({
             "error":error.message
         })
    }
    
}

export default reminder_controller




let ValidateReminder = (reqbody) => {
    if (reqbody.invoice_id == null) {
        return false
    }
    if (reqbody.due_date == null) {
        return false
    }
    return true
}