
/**
 * Helper method for catching any error for async functions
 */

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}