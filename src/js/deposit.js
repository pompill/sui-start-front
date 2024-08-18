import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { bcs } from '@mysten/sui/bcs';

//keypair->签名
async function deposit(keypair) {
    const Package = '0x869d0f51fb8e0947a6e1726e1cb589c1fdb9bbe8ed9a99a62df5de93ae09eee1';
    const amount = 1 //这里是mist为单位 1sui = 100,000,000mist
    let tx = new Transaction();

    const rpcUrl = getFullnodeUrl('testnet');
    
    // create a client connected to devnet
    const client = new SuiClient({ url: rpcUrl });
    tx.moveCall({
        target: Package+"::bridge::deposit",//方法
        arguments: [tx.object([""]),//所有币种，先传过去，或者加起来要大于输入的金额,账户里的sui object
            tx.object("0x899606692894cbfd5c2966ff846ff5da39b5dd49351c18d87746fe840eca99b5"),//池子
            tx.pure(bcs.option(bcs.U8).serialize(amount)),//转账金额数目
            tx.object("0x6")//时间
        ],
        typeArguments: []// type arguments
    })
    tx.setGasBudget(3000000);
    const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
    console.log("result",result)
}

function run(){
    const mnemonic = ''//助记词
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
    deposit(keypair)
}

run()