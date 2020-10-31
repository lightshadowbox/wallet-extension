import { Dictionary } from 'lodash'

import { AccountModelType } from './account-model'

export type WalletModelType = {
  name?: string
  accounts?: Dictionary<AccountModelType>
}
