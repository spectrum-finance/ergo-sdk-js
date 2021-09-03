# Ergo SDK

[![npm module](https://badge.fury.io/js/ergo-sdk.svg)](https://www.npmjs.org/package/ergo-sdk)

This SDK includes:
* Ergo protocol data model
* Ergo wallet
* Ergo Blockchain Explorer API wrapper

## Usage

This SDK heavily relies on `ergo-rust` via WASM. So you have to load `RustModule` before using this SDK:
```typescript jsx
import React, { useEffect, useState } from 'react';
import { GeistProvider } from '@geist-ui/react';
import { RustModule } from 'ergo-sdk';

export const App: React.FC = () => {
  const [isRustModuleLoaded, setIsRustModuleLoaded] = useState(false);

  useEffect(() => {
    RustModule.load().then(() => setIsRustModuleLoaded(true));
  }, []);

  if (!isRustModuleLoaded) {
    return null;
  }

  return (<GeistProvider>...</GeistProvider>)
}
```

### Ergo data model

* `Address`
* `ErgoTree`
* `ErgoTreeTemplate`
* `ErgoBox`
* `ErgoBoxCandidate`
* `Input`
* `DataInput`
* `UnsignedInput`
* `ErgoTx`
* `UnsignedErgoTx`
* `AssetAmount`
* `AssetInfo`
* `TokenAmount`
* `Constant`
* `ContextExtension`
* `NetworkContext`
* `ProverResult`
* `PublicKey`
* `Registers`
* `SigmaType`

### Ergo Wallet

* BoxSelector - Selects inputs satisfying a given target balance and tokens.
* Prover - An interface of an abstract prover capable of signing transactions. Should be implemented using wallet integration (e.g. Yoroi).
* TxAssembler - A service for simplified TX assembly.

### Ergo Explorer API

Explorer API methods also rely on the Ergo data model, but most of them return enriched versions of Ergo models marked with `Aug*` prefix.

Implemented methods:

* `getTx(id: TxId): Promise<AugErgoTx | undefined>` - Get confirmed transaction by `id`.
* `getOutput(id: BoxId): Promise<AugErgoBox | undefined>` - Get confirmed output by `id`.
* `getTxsByAddress(address: Address, paging: Paging): Promise<[AugErgoTx[], number]>` - Get transactions by `address`.
* `getUTxsByAddress(address: Address, paging: Paging): Promise<[AugErgoTx[], number]>` - Get unconfirmed transactions by `address`.
* `getUnspentByErgoTree(tree: ErgoTree, paging: Paging): Promise<[AugErgoBox[], number]>` - Get unspent boxes with a given `ergoTree`.
* `getUnspentByErgoTreeTemplate(hash: HexString, paging: Paging): Promise<AugErgoBox[]>` - Get unspent boxes with scripts matching a given `hash` of ErgoTree template.
* `getUnspentByTokenId(tokenId: TokenId, paging: Paging, sort?: Sorting): Promise<AugErgoBox[]>` - Get unspent boxes containing a token with a given `id`.
* `getByTokenId(tokenId: TokenId, paging: Paging, sort?: Sorting): Promise<AugErgoBox[]>` - Get boxes containing a token with a given `id`.
* `getUnspentByErgoTreeTemplateHash(hash: HexString, paging: Paging): Promise<[AugErgoBox[], number]>` - Get unspent boxes by a given `hash` of ErgoTree template.
* `searchUnspentBoxes(req: BoxSearch, paging: Paging): Promise<[AugErgoBox[], number]>` - Detailed search among unspent boxes.
* `searchUnspentBoxesByTokensUnion(req: BoxAssetsSearch, paging: Paging): Promise<[AugErgoBox[], number]>` - Search among unspent boxes by ergoTreeTemplateHash and tokens.
* `getFullTokenInfo(tokenId: TokenId): Promise<AugAssetInfo | undefined>` - Get a token info by `id`.
* `getTokens(paging: Paging): Promise<[AugAssetInfo[], number]>` - Get all available tokens.
* `getNetworkContext(): Promise<NetworkContext>` - Get current network context.

```typescript
import {Explorer} from "ergo-sdk";
const explorer = new Explorer("https://api.ergoplatform.com");
const txId = "18b30e9b40ed7061d2f87590c555d24a712df9c848a8db9dfd4affcc92d3cb02";
explorer.getTx(txId).then(tx => console.log(tx));
```
