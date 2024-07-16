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
    arguments: [tx.object("0xf9e2f328443891e0677d30eea9be8fa7913c028703b9ba6aef1cc9f300438fda"),//管理员权限
        tx.object("0x128b14c11f36e4cff559b8dfea3a2a0cc862199835e79491e59c91c9c76d83f0"),//池子
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