/* eslint no-dupe-keys: 0 */

const { dispatch } = require(`${root}/utils`);
const { schedule } = require(`../../utils`);

module.exports = {
  // calculateBills: dispatch('calculateBills', null, { repeat: { cron: schedule.everyMondayAt('1:59') } }),
  // recalculateBills: dispatch('recalculateBills', null, { repeat: { cron: schedule.everyWednesdayAt('1:59') } }),
  calculateBills: dispatch('calculateBills', null, { repeat: { cron: schedule.everyFifteenSeconds } }),
  recalculateBills: dispatch('recalculateBills', null, { repeat: { cron: schedule.everyFifteenSeconds } }),
};
