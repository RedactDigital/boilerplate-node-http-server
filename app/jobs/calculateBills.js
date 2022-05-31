module.exports = {
  name: 'calculateBills',
  /**
   * Calculates each bill by summing the amount of each timelog
   * @param {Object} job - The job object
   * @callback done - Callback function
   * @returns
   */
  handle: async (job, done) => {
    try {
      // ----------------------- make bellow a function to call and do the same on calculate bills -------------------
      // Load Jobs with timelogs, company with payment methods, freelancer with discounts
      // ! important make sure timelogs where created before monday this week

      // Loop through each job
      // Loop through each timelog
      // --------------------------------------------------------------------------------------------------------------

      // create a new bill
      // loop through each timelog and change status to approved

      await done();
    } catch (err) {
      log.error(err);
      await done('Calculate bills failed');
    }
  },
};
