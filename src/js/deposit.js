import { Transaction } from '@mysten/sui/transactions';

//keypair->签名
export async function deposit(keypair) {
    let tx = new Transaction();
    tx.moveCall({
        target: Package+"::bridge::deposit",//方法
        arguments: [tx.object([]),//所有币种，先传过去，或者加起来要大于输入的金额
            tx.object("0x899606692894cbfd5c2966ff846ff5da39b5dd49351c18d87746fe840eca99b5"),//池子
            tx.pure(amount),//转账金额数目
            tx.object("0x6")//时间
        ],
        typeArguments: []// type arguments
    })
    tx.setGasBudget(3000000);
    const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
    console.log("result",result)
}