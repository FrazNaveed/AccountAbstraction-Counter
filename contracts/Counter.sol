// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.13;

contract Counter {
    uint256 counter;

    function increaseCounter() external {
        counter++;
    }

    function getCounter() external view returns (uint256 res) {
        res = counter;
    }
}
