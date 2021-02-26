# Nokuex Crypto API 

> [API ](https://nokuex-crypto-api.herokuapp.com)

> [API Docs](https://bit.ly/nokuex-crypto-api-docs)


https://api.blockcypher.com/v1/eth/main/txs/new?token=YOURTOKEN

https://api.blockcypher.com/v1/eth/main/txs/send?token=YOURTOKEN



# Features
- Customer signup 
- Customer login
- Get Customers Details by Token
- Toggle customers/admin role - anyone
- Toggle customers/agent role - admin
- List all customers by Admin
- Allow customers to create wallet
- Allow agent to see his customers transactions
- Allow users to see his transactions
- Delete customers/?id=<Customer._id> by Admin

> TODO
- Customer can initialize transaction
- Agent can view transaction, if it concerns him

# Notes
- Agents will be identified by their email address which can be a custom adrress like agent1@nokuex.com. this is needed to maintain referencial integrity