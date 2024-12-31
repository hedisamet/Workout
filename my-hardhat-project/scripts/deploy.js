const hre = require("hardhat");

async function main() {
  const WorkoutPlanManager = await hre.ethers.getContractFactory("WorkoutPlanManager");
  const workoutPlanManager = await WorkoutPlanManager.deploy();

  await workoutPlanManager.deployed();

  console.log("WorkoutPlanManager contract deployed to:", workoutPlanManager.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
