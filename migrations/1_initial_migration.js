const TimeLockedFund = artifacts.require("TimeLockedFund");

const beneficiary = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
const delay = 120
const value = 10000000

module.exports = function (deployer) {
  deployer.deploy(TimeLockedFund, beneficiary, delay, { value });
};

// p = await TimeLockedFund.deployed()