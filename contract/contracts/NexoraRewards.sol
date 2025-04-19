//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract NexoraRewards {
    address public owner;

    // Mapping to store user reward count for transparency (not essential)
    mapping(address => uint256) public smallRewards;
    mapping(address => uint256) public bigRewards;

    event SmallRewardRequested(address indexed player, string reason);
    event BigRewardRequested(address indexed player, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Called from frontend after player collects 5, 10, or 15 coins in one run
    function requestSmallReward(uint8 coinMilestone) external {
        require(coinMilestone == 5 || coinMilestone == 10 || coinMilestone == 15, "Invalid milestone");
        smallRewards[msg.sender]++;
        emit SmallRewardRequested(msg.sender, string(abi.encodePacked("Reached ", uint2str(coinMilestone), " coins")));
    }

    // For small time-based achievements
    function requestTimeBasedSmallReward(uint256 completionTime, uint256 formattedTime) external {
        if (completionTime < 30) {
            smallRewards[msg.sender]++;
            emit SmallRewardRequested(msg.sender, "Completed all coins in under 30 seconds");
        }

        if (formattedTime >= 60) {
            smallRewards[msg.sender]++;
            emit SmallRewardRequested(msg.sender, "No coins collected in 1 minute!");
        }
    }

    // For big achievements
    function requestBigReward(uint8 coinCount, uint256 completionTime) external {
        require(coinCount == 20, "Level not completed");

        bigRewards[msg.sender]++;
        emit BigRewardRequested(msg.sender, "Completed level");

        if (completionTime < 15) {
            bigRewards[msg.sender]++;
            emit BigRewardRequested(msg.sender, "Completed level under 15 seconds");
        }
    }

    // Helper: convert uint to string (basic)
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }

    // Returns a list of achievement IDs for the player
    function getPlayerAchievements(address player) public view returns (string[] memory) {
        uint256 count = 0;
        string[5] memory allAchievements = ["coinCollector", "speedDemon", "chillPacer", "nexoFlash", "levelComplete"];
        bool[5] memory achieved;
        if (smallRewards[player] > 0) achieved[0] = true; // coinCollector
        if (smallRewards[player] > 0) achieved[2] = true; // chillPacer (simplified)
        if (bigRewards[player] > 0) achieved[4] = true; // levelComplete
        if (smallRewards[player] > 2) achieved[1] = true; // speedDemon (example: 3+ small rewards)
        if (bigRewards[player] > 1) achieved[3] = true; // nexoFlash (example: 2+ big rewards)
        for (uint256 i = 0; i < 5; i++) {
            if (achieved[i]) count++;
        }
        string[] memory unlocked = new string[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < 5; i++) {
            if (achieved[i]) {
                unlocked[idx] = allAchievements[i];
                idx++;
            }
        }
        return unlocked;
    }

    // Unlocks a specific achievement for the player
    function unlockAchievement(string memory achievementId) public {
        // Example logic: increment smallRewards or bigRewards based on achievementId
        if (keccak256(bytes(achievementId)) == keccak256(bytes("coinCollector"))) {
            smallRewards[msg.sender]++;
        } else if (keccak256(bytes(achievementId)) == keccak256(bytes("speedDemon"))) {
            smallRewards[msg.sender]++;
        } else if (keccak256(bytes(achievementId)) == keccak256(bytes("chillPacer"))) {
            smallRewards[msg.sender]++;
        } else if (keccak256(bytes(achievementId)) == keccak256(bytes("nexoFlash"))) {
            bigRewards[msg.sender]++;
        } else if (keccak256(bytes(achievementId)) == keccak256(bytes("levelComplete"))) {
            bigRewards[msg.sender]++;
        }
        // Optionally emit an event for achievement unlock
    }
}
