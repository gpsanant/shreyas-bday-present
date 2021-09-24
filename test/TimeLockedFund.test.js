const { expect } = require('chai');
const { expectRevert, time, BN } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

const TimeLockedFund = artifacts.require('TimeLockedFund');

const value = new BN(10000000)
const delay = new BN(60*60*24*365*10)

contract('TimeLockedFund', function ([owner, beneficiary, otherBeneficary, outsider]) {
  beforeEach(async function () {
    // Deploy a new Box contract for each test
    this.tlf = await TimeLockedFund.new(beneficiary, delay, { from: owner, value });
  });

  it('cannot change beneficiary if non beneficiary', async function () {
    await expectRevert(
        this.tlf.changeBeneficiary(otherBeneficary, { from: owner }),
        "Only beneficiary can change beneficiary",
      );
  });

  it('cannot withdraw funds before timelock', async function () {
    await expectRevert(
        this.tlf.withdraw({ from: outsider }),
        "The locktime must have passed",
      );
  });

  it('can set new beneficiary if current beneficiary', async function () {
    await this.tlf.changeBeneficiary(otherBeneficary, { from: beneficiary })
    expect(await this.tlf.beneficiary()).to.equal(otherBeneficary)
  });

  it('can withdraw after timelock', async function () {
    var prevBalance = new BN(await web3.eth.getBalance(beneficiary))
    await time.increase(delay+ 10)
    await this.tlf.withdraw({ from: outsider })
    expect(await web3.eth.getBalance(beneficiary)).to.equal(prevBalance.add(value).toString())

  });

  it('can withdraw after timelock with changed beneficiary', async function () {
    await this.tlf.changeBeneficiary(otherBeneficary, { from: beneficiary })
    var prevBalance = new BN(await web3.eth.getBalance(otherBeneficary))
    await time.increase(delay + 10)
    await this.tlf.withdraw({ from: outsider })
    expect(await web3.eth.getBalance(otherBeneficary)).to.equal(prevBalance.add(value).toString())  
  });
});