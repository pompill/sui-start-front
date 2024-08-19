import { Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { bcs } from "@mysten/sui/bcs";

//keypair->签名
async function deposit(keypair) {
  const Package =
    "0xa6d4af9d11dbf08375ce071f99be5d08f3ac0f4e5968fae1bccf84cfe4ee50e9";
  const amount = 10000000; //这里是mist为单位 1sui = 100,000,000mist
  let tx = new Transaction();

  const rpcUrl = getFullnodeUrl("testnet");

  // create a client connected to devnet
  const client = new SuiClient({ url: rpcUrl });
  tx.moveCall({
    target: Package + "::bridge::deposit", //方法
    arguments: [
      //   tx.object(
      //     JSON.stringify([
      //       "0x2824f62511e421c4ec439896579d7ffee97e90945f4aeb630061aa5fb755e910",
      //     ])
      //   ), //转账金额数目
      //   tx.pure(
      //     bcs.String.serialize(
      //       "[0x2824f62511e421c4ec439896579d7ffee97e90945f4aeb630061aa5fb755e910]"
      //     )
      //   ), //转账金额数目
      //   tx.pure.vector("address", [
      //     "0x4ff5dedc6e00d408fc76a708d8adf3dd16f4ff9b9d02949ec8285b908cf7cb23",
      //   ]),
      //   tx.pure([
      //     "0x4ff5dedc6e00d408fc76a708d8adf3dd16f4ff9b9d02949ec8285b908cf7cb23"
      //   ]), //所有币种，先传过去，或者加起来要大于输入的金额,账户里的sui object
      //   tx.pure.vector("address", [
      //     "0x4ff5dedc6e00d408fc76a708d8adf3dd16f4ff9b9d02949ec8285b908cf7cb23",
      //   ]),
      //   tx.pure(
      //     bcs
      //       .vector(bcs.Address)
      //       .serialize([
      //         "0x3f7b57442a817cbf4f06a88bff3a0cf0ff21ed4384d909f77452f64be2dab138",
      //       ])
      //   ),
      //   tx.pure("vector<address>", [
      //     "0x3f7b57442a817cbf4f06a88bff3a0cf0ff21ed4384d909f77452f64be2dab138",
      //   ]),
      //   tx.object([
      //     tx.object(
      //       "0x44088c0f6e9d8eef8ec9807163d991915b601158a41bf4d10c660e592d83df45"
      //     ),
      //   ]),
      //   tx.object(
      //     "[0x2824f62511e421c4ec439896579d7ffee97e90945f4aeb630061aa5fb755e910]"
      //   ),
      //   tx.object([
      //   ]),
      //   tx.pure("vector<string>", [
      //     "0x2824f62511e421c4ec439896579d7ffee97e90945f4aeb630061aa5fb755e910",
      //   ]),
      // tx.object("0x2824f62511e421c4ec439896579d7ffee97e90945f4aeb630061aa5fb755e910"),
      tx.makeMoveVec({
        elements: [
          "0x2824f62511e421c4ec439896579d7ffee97e90945f4aeb630061aa5fb755e910",
        ],
        type: "object",
      }),
      // tx.pure.address("0x2824f62511e421c4ec439896579d7ffee97e90945f4aeb630061aa5fb755e910"),
      tx.object(
        "0x82e98c8dbdcb788d57c69bb179ee51b664b75ded7c6f79323853a2f0ad2322e8"
      ), //池子
      tx.pure(bcs.U64.serialize(amount)), //转账金额数目
      tx.object("0x6"), //时间
    ],
    typeArguments: [], // type arguments
  });
  tx.setGasBudget(3000000);
  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });
  console.log("result", result);
}

function run() {
  const mnemonic =
    "express embody limb banana praise bundle jaguar option acid caught ordinary village"; //助记词
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
  const address = keypair.getPublicKey().toSuiAddress();
  console.log("address", address);
  deposit(keypair);
}

run();
