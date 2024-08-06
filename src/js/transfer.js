import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const mnemonic = ''//助记词
const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
const address = keypair.getPublicKey().toSuiAddress();
console.log("address",address)

const amount = 1 //这里是mist为单位 1sui = 100,000,000mist
let dOrderId = ""//要约定订单id规则，链上生成
let tx = new Transaction();
tx.moveCall({
    target: Package+"::bridge::transferCoin",//方法
    arguments: [tx.object("0x7aa1a356af39bbc448db9ccb1ace4165553eb1b56b5ecb0dbe03724cef8fd6cf"),//管理员权限
        tx.object("0x899606692894cbfd5c2966ff846ff5da39b5dd49351c18d87746fe840eca99b5"),//池子
        tx.pure(amount),//转账金额数目
        tx.object("0x66518bb6067107b8c19c548204e61f1803865269336ad5876ef4f227e9c7bb6b"),//转账地址
        tx.pure(dOrderId),//订单id
        tx.object("0x6")//时间
    ],
    typeArguments: []// type arguments
})
tx.setGasBudget(3000000);
const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
console.log("result",result)