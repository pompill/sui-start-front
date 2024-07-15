import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
 

async function run() {
    // use getFullnodeUrl to define Devnet RPC location
    const rpcUrl = getFullnodeUrl('testnet');
    
    // create a client connected to devnet
    const client = new SuiClient({ url: rpcUrl });
    const tx = new Transaction();
    
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

    const mnemonic = ''
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
    const address = keypair.getPublicKey().toSuiAddress();
    console.log("address",address)

    for (let i in depositEvents.data){
        let dOrderId = depositEvents.data[i].parsedJson.orderId
        if (fList.includes(dOrderId)){
            continue
        }
        let amount = depositEvents.data[i].parsedJson.amount
        console.log("\n\n===not finish orderId:",dOrderId)
        console.log("\n\n===amount:",amount)
        
        let tx = new Transaction();
        tx.moveCall({
            target: Package+"::bridge::transferCoin",
            arguments: [tx.object("0xf9e2f328443891e0677d30eea9be8fa7913c028703b9ba6aef1cc9f300438fda"),
                tx.object("0x128b14c11f36e4cff559b8dfea3a2a0cc862199835e79491e59c91c9c76d83f0"),
                tx.pure(amount),
                tx.object("0x66518bb6067107b8c19c548204e61f1803865269336ad5876ef4f227e9c7bb6b"),
                tx.pure(dOrderId),
                tx.object("0x6")
            ],
            typeArguments: []// type arguments
        })
        tx.setGasBudget(3000000);
        const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
        console.log("result",result)
    }
}


run()