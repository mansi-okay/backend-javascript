// creating error format so that all API errors look the same

class ApiError extends Error{
    constructor (statusCode,  // HTTP status (400, 401, 500, etc.)
        message="Something went wrong",
        errors=[],   
        stack=""    // stack trace
    ){
        super(message)
        this.statusCode = statusCode,
        this.data= null,
        this.errors= errors,
        this.message= message,
        this.success= false

        if(stack){
            this.stack = stack     //If stack manually provided use it
        } else{                     // Else automatically capture correct stack trace
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export {ApiError}