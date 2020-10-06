import { createRPCChannel } from '../utils/channel'

export const walletServices = createRPCChannel({
  name: 'walletServices',
  events: {
    createWallet: async (payload: { walletName: string; password: string }) => {
      return payload
    },
  },
})
