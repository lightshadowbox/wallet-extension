/* eslint-disable react/button-has-type */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './token-list.css'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react'

import classNames from 'classnames'
import { FocusZone, FocusZoneDirection, FontIcon, getFocusStyle, getTheme, Image, ImageFit, ITheme, List, mergeStyleSets } from '@fluentui/react'

import { useGetAccount } from 'queries/account.queries'
import { useFetchToken } from 'queries/token.queries'

import { SpinnerWallet } from 'popup/components/spinner/spinner-wallet'
import { useAddToken, useRemoveToken } from 'queries/create-account.mutation'
import { TokenItemInterface } from './token'
import styles from './token-list.module.css'

const theme: ITheme = getTheme()
const { palette, semanticColors, fonts } = theme
interface Props {
  valueInput: string
  showPanelTokenDetail: (value) => void
  dismissPanel: () => void
}
const classNamesList = mergeStyleSets({
  container: {
    overflow: 'auto',
    maxHeight: 483,
  },
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 16,
      boxSizing: 'border-box',
      display: 'flex',
      selectors: {
        '&:hover': { background: '#EFF3FE' },
      },
    },
  ],
  itemImage: {
    flexShrink: 0,
    borderRadius: '50%',
  },
  itemContent: {
    marginLeft: 15,
    overflow: 'hidden',
    flexGrow: 1,
  },
  itemName: [
    fonts.xLarge,
    {
      fontSize: 16,
      whiteSpace: 'Google Sans',
      overflow: 'scroll',
      textOverflow: 'ellipsis',
    },
  ],
  itemIndex: {
    fontSize: fonts.small.fontSize,
    color: palette.neutralTertiary,
    marginBottom: 10,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: 10,
    color: palette.neutralTertiary,
    fontSize: fonts.large.fontSize,
    flexShrink: 0,
  },
})

export const TokenCell: React.FC<{ item: TokenItemInterface; showPanel: (value) => void; dismissPanel: () => void }> = ({ item, showPanel, dismissPanel }) => {
  const [addToken, addTokenStatus] = useAddToken()
  const [removeToken, removeTokenStatus] = useRemoveToken()
  const { data: account } = useGetAccount()
  const onLoadImageFail = (e) => {
    e.target.src = 'https://picsum.photos/200'
  }
  return (
    <div className={`${classNamesList.itemCell} token-list-container justify-between`} data-is-focusable>
      <div onClick={() => showPanel(item.tokenId)} className={classNames('flex flex-row cursor-pointer')}>
        <div className={classNames(`imgContainer ${styles.imgContainer}`)}>
          <img onError={onLoadImageFail} className={classNamesList.itemImage} src={item.icon} />
          {item.verified ? (
            <div className={styles.containerIcon}>
              <FontIcon iconName="SkypeCircleCheck" />
            </div>
          ) : null}
        </div>
        <div className={classNamesList.itemContent} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={classNamesList.itemName}>{item.name}</div>
        </div>
      </div>
      <div className={classNames('flex flex-row items-center justify-center btn-token')}>
        {account?.followingTokens?.indexOf(item.tokenId) !== -1 ? (
          <button
            onClick={() => {
              setTimeout(() => {
                dismissPanel()
              }, 0.00000001)
              removeToken(item.tokenId)
            }}
            className={styles.btnRemove}
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() => {
              setTimeout(() => {
                dismissPanel()
              }, 0.000001)
              addToken(item.tokenId)
            }}
            className={styles.btnAdd}
          >
            Add
          </button>
        )}
      </div>
    </div>
  )
}
const useGetTokenSequence = () => {
  const { data: tokens } = useFetchToken()
  const { data: account } = useGetAccount()
  const pToken = Object.values(tokens).filter((token) => token.tokenType === 'TOKEN' && !account?.followingTokens?.includes(token.tokenId))
  const pCustom = Object.values(tokens).filter((token) => token.tokenType === 'CUSTOM' && !account?.followingTokens?.includes(token.tokenId))
  const TokenListFollowing = Object.values(tokens).filter((token) => account?.followingTokens?.includes(token.tokenId))
  return {
    data: [...TokenListFollowing, ...pToken, ...pCustom],
  }
}

export const ListGhostingExample: React.FunctionComponent<Props> = ({ valueInput, showPanelTokenDetail, dismissPanel }) => {
  const { data } = useGetTokenSequence()
  const onRenderCell = React.useCallback(
    (item: TokenItemInterface, showPanel: (value) => void): JSX.Element => <TokenCell showPanel={showPanel} item={item} dismissPanel={dismissPanel} />,
    [data],
  )
  const [listToken, setListToken] = React.useState(Object.values(data))
  React.useEffect(() => {
    if (valueInput === '') {
      setListToken(data)
    } else {
      const consumeToken = data.filter((token) => token.name.indexOf(valueInput) !== -1)
      setListToken(consumeToken)
    }
  }, [valueInput])
  if (data) {
    return (
      <FocusZone direction={FocusZoneDirection.vertical}>
        <div className={classNames(`${classNamesList.container} list-token`)} data-is-scrollable>
          <List items={listToken} onRenderCell={(item: TokenItemInterface) => onRenderCell(item, showPanelTokenDetail)} />
        </div>
      </FocusZone>
    )
  }
  return <SpinnerWallet />
}
