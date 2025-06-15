export default (myErrorfunc) => (req, res, next) => {
    Promise.resolve(myErrorfunc(req, res, next)).catch((error) => {
        next(error);
    });
}