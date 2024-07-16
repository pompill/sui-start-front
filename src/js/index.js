import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
 

async function run() {
    // use getFullnodeUrl to define Devnet RPC location
    const rpcUrl = getFullnodeUrl('testnet');
    
    // create a client connected to devnet
    const client = new SuiClient({ url: rpcUrl });
    const tx = new Transaction();


    const Package = '0x869d0f51fb8e0947a6e1726e1cb589c1fdb9bbe8ed9a99a62df5de93ae09eee1';
    const FinishOrderEventType = Package+'::bridge::FinishOrderEvent';//出金事件
    const DepositEventType = Package+'::bridge::BridgeEvent';//入金事件

    let depositEvents = await client.queryEvents({
        query: {MoveEventType: DepositEventType}
    })
    console.log("\n ====DepositEvent",depositEvents.data)

    let FinishOrderEvents = await client.queryEvents({
        query: {MoveEventType: FinishOrderEventType}
    })
    console.log("\n ====FinishOrderEvents",FinishOrderEvents.data)

    let fList = [];
    for (let j in FinishOrderEvents.data){
        let fOrderId = depositEvents.data[j].parsedJson.orderId
        fList.push(fOrderId);
    }
    console.log("\n ====FinishOrderEvents",FinishOrderEvents.data)

    //todo 根据这里生成的订单id，去eth上查还没处理转移代币的事件
    for (let i in depositEvents.data){
        let dOrderId = depositEvents.data[i].parsedJson.orderId
        if (fList.includes(dOrderId)){
            continue
        }
        //金额
        let amount = depositEvents.data[i].parsedJson.amount
        console.log("\n\n===not finish orderId:",dOrderId)
        console.log("\n\n===amount:",amount)
        
        // todo
    }
}


run()