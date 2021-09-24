pragma solidity ^0.8.7;

contract TimeLockedFund {

	address payable public beneficiary;
	uint public lockTime;

    // initialize the contract with a beneficiary and a delay in seconds after 
    // which the beneficiary can withdraw the balance of the contract
	constructor(address payable _beneficiary, uint _delay) payable {
        beneficiary = _beneficiary;
        lockTime = block.timestamp + _delay;
    }

    // In case any one feels more generous and want to add more funds
    receive() external payable {
    }
    
    // In case the beneficiary changes addresses or something
    function changeBeneficiary(address payable _beneficiary) external {
        require(msg.sender == beneficiary, "Only beneficiary can change beneficiary");
        beneficiary = _beneficiary;
    }

    // make sure lock time has passed, anyone can call this function and withdraw the funds to the beneficiary
    // no chance of meaningful reentrancy because the entire balance is transferred to the beneficiary
    function withdraw() external {
        require(block.timestamp > lockTime, "The locktime must have passed");
        beneficiary.transfer(address(this).balance);
    }
}