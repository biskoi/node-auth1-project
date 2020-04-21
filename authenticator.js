module.exports = (req, res, next) => {
   if (req.session.login === true) {
      next();
   } else {
      res.status(400).json({
         message: `You must be logged in to view this data.`
      });
   };
};