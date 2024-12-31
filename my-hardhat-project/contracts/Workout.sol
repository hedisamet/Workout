// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract WorkoutPlanManager {
    enum PlanStatus { Pending, Approved, Rejected }
    enum PlanType { Workout, Meal }

    struct Plan {
        address clientAddress;
        string ipfsHash;
        PlanStatus status;
        PlanType planType;
        uint256 timestamp;
    }

    mapping(bytes32 => Plan) public plans;
    event PlanStatusChanged(bytes32 indexed planId, PlanStatus status);
    event PlanCreated(bytes32 indexed planId, address indexed clientAddress, string ipfsHash);

    function createPlan(bytes32 planId, string memory ipfsHash, PlanType planType) public {
        require(plans[planId].timestamp == 0, "Plan already exists");
        
        plans[planId] = Plan({
            clientAddress: msg.sender,
            ipfsHash: ipfsHash,
            status: PlanStatus.Pending,
            planType: planType,
            timestamp: block.timestamp
        });

        emit PlanCreated(planId, msg.sender, ipfsHash);
    }

    function updatePlanStatus(bytes32 planId, PlanStatus newStatus) public {
        require(plans[planId].timestamp != 0, "Plan does not exist");
        require(plans[planId].status == PlanStatus.Pending, "Plan is not in pending status");
        
        plans[planId].status = newStatus;
        emit PlanStatusChanged(planId, newStatus);
    }

    function getPlan(bytes32 planId) public view returns (
        address clientAddress,
        string memory ipfsHash,
        PlanStatus status,
        PlanType planType,
        uint256 timestamp
    ) {
        Plan memory plan = plans[planId];
        return (
            plan.clientAddress,
            plan.ipfsHash,
            plan.status,
            plan.planType,
            plan.timestamp
        );
    }
}
