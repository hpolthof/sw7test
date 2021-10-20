# Demo Case
This repo consists of two parts:
- Contracts
- Frontend

## Contracts
There is one simple contract ```NameStore.sol``` which allows the user to store a string value and request it.

**Note:** This contract only allows the storage of a single value in a single storage slot. There are no permissions, meaning everybody can read the value.

## Frontend
The frontend allows the user to connect to the smart contract, read its content and modify it.

The following external packages were used:
- Ethers
- VueJS
- BootstrapVue

This frontend is deploy at: https://sw7test.netlify.app/