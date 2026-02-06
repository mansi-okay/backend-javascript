// middleware-based approach for error handling
const asyncHandler = (requestHandler) => {
    return (req,res,next) =>{
        // Promise.resolve() makes sure: -> if it’s already a Promise -> use it
        //                               -> if it’s not -> wrap it into a Promise
        Promise.resolve(requestHandler(req,res,next))
        .catch((error) => next(error))  
         //next() -> move to next normal middleware / route handler
         // next(error) -> Next error handling middleware
    }
}

export {asyncHandler}


/*
// try catch async handler
// used asyncHandler to handle errors of async functions automatically
// const function = () => () => {}  //OR
// const function = () => (() => {})  //OR
// const fn = () => {
//   return () => {}
// }

// fn(req, res, next) is your async task
// async (req, res, next) is the wrapper that runs fn safely
const asyncHandler = (fn) => async (err,req,res,next) => {
    try {
        await fn(request,response,next)
    } catch (error){
        res.status(error.code || 500)
        .json({
            success: false,
            message: error.message
        })
    }
}
*/