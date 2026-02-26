// middleware-based approach for error handling
const asyncHandler = (requestHandler) => {
    return (req,res,next) =>{
        // Promise.resolve() makes sure: -> if it’s already a Promise -> use it
        //                               -> if it’s not -> wrap it into a Promise
        Promise.resolve(requestHandler(req,res,next))
        .catch((error) => next(error))  
         //next() -> move to next normal middleware / route handler
         // next(error) -> Next error handling middleware whose signature is (err, req, res, next)
    }
}

export {asyncHandler}


/*
// try catch async handler
// Do not write (err, req, res, next) for controllers or async handlers
// used asyncHandler to handle errors of async functions automatically
// const function = () => () => {}  //OR
// const function = () => (() => {})  //OR
// const fn = () => {
//   return () => {}
// }

// fn(req, res, next) is your async task
// Ends the response -> no next() needed in fn
// Passes control onward -> must call next() in fn

// async (req, res, next) is the wrapper that runs fn safely
const asyncHandler = (fn) => async (req,res,next) => {
    try {
        await fn(req,res,next)
    } catch (error){
        res.status(error.code || 500)
        .json({
            success: false,
            message: error.message
        })
    }
}
*/