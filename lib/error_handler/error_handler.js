class Reminder_Service extends Error {
    constructor(message, id, status) {
        super()
        this.name = this.constructor.name
        this.code = status
        this.message = message
        Error.captureStackTrace(this, this.constructor)
    }

}

class HttpErr extends Reminder_Service {
    constructor(message, id, status) {
        super(message, id, status)
    }
}

class MySQLErr extends Reminder_Service {
    constructor(message, id, status) {
        super(message, id, 500)
    }
}

module.exports={
    Reminder_Service,
    HttpErr,
    MySQLErr
}