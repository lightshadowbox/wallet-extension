## Code guideline

1. Stylesheet: 
  + CSS Module: `example-box.module.css` => import styles from './example-box.module.css'
  + Complex Controls: Microsoft's FluentUI

vscode plugins: `Tailwind CSS IntelliSense`, `CSS Modules`

  ```CSS
  /* Example file: 'component-name.module.css' */

  .borderBoxContainer { /* camelCase name */
    @apply bg-primary; /* reuse from tailwindcss */
    max-width: 100px;
  }
  ```

  ```JSX
  import styles from './component-name.module.css'
  
  const ComponentName = () => {
    const [highlighted, setHighlighted] = React.useState(false)

    return (
      <div className={`container mx-auto max-width ${highlighted && styles.borderBoxContainer}`}>
        CONTENT
      </div>
    )
  }
  ```

  

2. Components, scenes, hooks are implemented using Storybooks before integrate to application

```TSX
// example: queries.stories.tsx

import React from 'react'

import {
  Meta,
  Story
} from '@storybook/react'

import { useGetTokenList } from './use-get-token-list'
import { useGetWallet } from './use-get-wallet'

const HookGetWalletExample = () => {
  const wallet = useGetWallet()

  if (wallet.isLoading) {
    return <div>Loading</div>
  }
  if (wallet.error) {
    return <div>{JSON.stringify(wallet.error)}</div>
  }

  return <div>{JSON.stringify(wallet.data, null, 2)}</div>
}

const Template = (args) => <HookGetWalletExample {...args} />
export const useGetWalletHook: Story = Template.bind({})

const HookGetTokenListExample = () => {
  const tokens = useGetTokenList('Account 0')
  return <div>{JSON.stringify(tokens, null, 2)}</div>
}

export const useGetTokenListExample: Story = (args) => <HookGetTokenListExample {...args} />

export default {
  title: 'Queries',
  component: HookGetWalletExample,
} as Meta

```

3. Asynchronous tasks like: retrieve data from API, call wallet sdk, get account balance, etc must be implemented using React Query. Example at: `./src/queries`

```TS
import { useQuery } from 'react-query'
import { getWalletSerialized } from 'services/wallet'

export const useGetWallet = () => {
  const hook = useQuery(['getWalletSerialized'], getWalletSerialized)
  return hook
}


// Example for child hooks
import { useGetWallet } from './use-get-wallet'

export const useGetTokenList = (accountName: string) => {
  const wallet = useGetWallet()
  if (!wallet.data) {
    return []
  }
  const account = wallet.data.accounts[accountName]
  return account.followingTokens
}

```

4. Global state like (remember state): Selected Account, UI State, User remember state, bla bla must be implemented using Redux. Example at: `./src/stores/implements`

```TS
import { createSelectorForSlice } from 'stores/utils'

import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'

interface WalletState {
	selectAccountName?: string
}

const walletInitialState: WalletState = {}

export const walletSlices = createSlice({
	name: 'wallets',
	initialState: walletInitialState,
  reducers: {
    selectAccount: (state, action: PayloadAction<{accountName: string}>) => {
      state.selectAccountName = action.payload.accountName
    },
  },
})

export const useWalletState = createSelectorForSlice(walletSlices)

```

```TSX
// Example usage: component.tsx
export const ComponentWithRedux = () => {
  const dispatch = useDispatch()
  const selectedAccount = useWalletState((s) => s.selectAccountName)

  React.useEffect(() => {
    dispatch(walletSlices.actions.selectAccount({accountName: '123' }))
  }, [dispatch])
  
  return (
    <div>
    accountName: {selectedAccount}
    </div>
  )
}
```
