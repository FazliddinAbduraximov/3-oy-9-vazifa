export const globalErrorHandle=(error, _req, res, _next)=>{
    console.log(error);
    const statusCode=error.statusCode || 500
    const message=error.message || 'Internal server error'
    return res.status(error.statusCode).json({
        statusCode,
        message
    })
}