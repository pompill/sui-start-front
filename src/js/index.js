import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
 
// use getFullnodeUrl to define Devnet RPC location
const rpcUrl = getFullnodeUrl('testnet');
 
// create a client connected to devnet
const client = new SuiClient({ url: rpcUrl });
 
// get coins owned by an address
// replace <OWNER_ADDRESS> with actual address in the form of 0x123...
// let result = await client.getCoins({
// 	owner: '0x66518bb6067107b8c19c548204e61f1803865269336ad5876ef4f227e9c7bb6b',
// });
// console.log("result",result)
const Package = '0x869d0f51fb8e0947a6e1726e1cb589c1fdb9bbe8ed9a99a62df5de93ae09eee1';

const FinishOrderEventType = Package+'::bridge::FinishOrderEvent';
const DepositEventType = Package+'::bridge::BridgeEvent';


// console.log(
// 	await client.getObject({
// 		id: Package,
// 		options: { showPreviousTransaction: true },
// 	}),
// );

let depositEvents = await client.queryEvents({
    // query: {MoveModule: {module: "bridge", package:"0xf0a311c2f653005a059e270e93f348a230950c5045a980b95089c191107fb50d"}}
    query: {MoveEventType: DepositEventType}
})

console.log("\n ====DepositEvent",depositEvents.data)

let FinishOrderEvents = await client.queryEvents({
    // query: {MoveModule: {module: "bridge", package:"0xf0a311c2f653005a059e270e93f348a230950c5045a980b95089c191107fb50d"}}
    query: {MoveEventType: FinishOrderEventType}
})

let fList = [];
for (let j in FinishOrderEvents.data){
    let fOrderId = depositEvents.data[j].parsedJson.orderId
    fList.push(fOrderId);
}

console.log("\n ====FinishOrderEvents",FinishOrderEvents.data)

for (let i in depositEvents.data){
    let dOrderId = depositEvents.data[i].parsedJson.orderId
    if (fList.includes(dOrderId)){
        continue
    }
    console.log("\n\n===not finish orderId:",dOrderId)
}

