const NameStore = artifacts.require("NameStore");

module.exports = async function (deployer) {
  await deployer.deploy(NameStore);
};
