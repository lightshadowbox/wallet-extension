import {api2, api1} from './http'
import { ADDRESS_TYPE } from '../constants/common'

export const apiGetEstimateFeeFromChain = (
  data = {
    Prv: 0,
    TokenID: null,
  },
) => api2.post('chain/estimatefee', data)

export const genCentralizedWithdrawAddress = ({
  originalAmount,
  requestedAmount,
  paymentAddress,
  walletAddress,
  tokenId,
  currencyType,
  memo = {},
}) => {
  if (!paymentAddress) throw new Error('Missing paymentAddress');
  if (!walletAddress) throw new Error('Missing walletAddress');
  if (!tokenId) throw new Error('Missing tokenId');
  if (!Number.isFinite(originalAmount) || originalAmount === 0) {
    throw new Error('Invalid amount');
  }
  const data = {
    CurrencyType: currencyType,
    AddressType: ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: String(requestedAmount),
    IncognitoAmount: String(originalAmount),
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress,
    PrivacyTokenAddress: tokenId,
    ...(memo ? { Memo: memo } : {}),
  };

  return api1.post('ota/generate', data).then((res) => res);
};

export const estimateUserFees = (data) => {
  const {
    paymentAddress,
    tokenId,
    originalAmount,
    requestedAmount,
    tokenContractID,
    walletAddress,
    currencyType,
    isErc20Token,
  } = data;
  if (isErc20Token && !tokenContractID) {
    throw new Error("Missing tokenContractID");
  }
  if (!paymentAddress) throw new Error("Missing payment address");
  if (!tokenId) throw new Error("Missing token id");
  const parseOriginalAmount = Number(originalAmount);
  if (!Number.isFinite(parseOriginalAmount) || parseOriginalAmount === 0) {
    throw new Error("Invalid amount");
  }
  const payload = {
    TokenID: tokenId,
    RequestedAmount: String(requestedAmount),
    CurrencyType: currencyType,
    AddressType: ADDRESS_TYPE.WITHDRAW,
    IncognitoAmount: String(originalAmount),
    PaymentAddress: paymentAddress,
    Erc20TokenAddress: tokenContractID,
    PrivacyTokenAddress: tokenId,
    WalletAddress: walletAddress,
    IncognitoTx: "",
  };
  return api1.post("eta/estimate-fees", payload);
};