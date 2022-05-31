module.exports = {
  name: 'recalculateBills',
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

      // update the bill
      // Load all companies with jobs in filled status and with payment methods
      // Loop through each company and load bills with status Created
      // If there is at least one bill, determine the wheher to dispatch to stripe or paypal and then dispatch to the appropriate method
      log.error('no');

      await done();
    } catch (err) {
      log.error(err);
      await done('Calculate bills failed');
    }
  },
};
