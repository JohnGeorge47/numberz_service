This is a simple reminder service </br>
The db schema is in /db </br>
You can go into the service and do an npm run start and the server will start on localhost:3000
I have added comments in each model and function to make it easier to understand the flow

The api's available are
**{POST}/api/reminder**
This is a bulk create api can be only used to do a create operation
```
  reqBodyformat
  {
   invoice_id:"123"
   due_date:"20-12-2020"
   reminder_type:"automated|manual|all"
   "reminder_method":"sms|email|all"
  "template_id":1
   reminders:[
     {
        "reminder_day":"2",
        "reminder_type:"automated|manual|all",
        "reminder_method":"sms|email|all"
        template_id":1
     },
      {
        "reminder_day":"3",
        "reminder_type:"automated|manual|all",
        "reminder_method":"sms|email|all"
     }
  ]
  }
```
**{POST}/api/reminder/:transaction_id**
This is a create and update api this can be used to create as well as update a single resource
if the reminder_day=0 it will create a new due date reminder and change the due_date for all the related transaction_id's
```
{
	"due_date":"2019-03-24",
	"reminder_type":"manual",
	"reminder_method":"all",
	"template_id":1,
	"reminder_day":2
}
```