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
import { useFetchToken, useSearchableTokenList } from 'queries/token.queries'

import { SpinnerWallet } from 'popup/components/spinner/spinner-wallet'
import { useAddToken, useRemoveToken } from 'queries/create-account.mutation'
import { orderBy } from 'lodash'
import { TokenItemInterface } from './token'
import styles from './token-list.module.css'

const theme: ITheme = getTheme()
const { palette, semanticColors, fonts } = theme
interface Props {
  valueInput: string
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

export const TokenCell: React.FC<{ item: TokenItemInterface }> = ({ item }) => {
  const [addToken, addTokenStatus] = useAddToken()
  const [removeToken, removeTokenStatus] = useRemoveToken()
  const { data: account } = useGetAccount()
  const isFollowingToken = React.useMemo(() => {
    return account?.followingTokens?.includes(item.tokenId)
  }, [account?.followingTokens, item.tokenId])

  const onLoadImageFail = (e) => {
    e.target.src = 'https://picsum.photos/200'
  }
  return (
    <div className={`${classNamesList.itemCell} token-list-container justify-between`} data-is-focusable>
      <div className={classNames('flex flex-row cursor-pointer')}>
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
        {isFollowingToken ? (
          <button
            onClick={() => {
              removeToken(item.tokenId)
            }}
            className={styles.btnRemove}
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() => {
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
interface Item {
  item: TokenItemInterface
}

export const ListGhostingExample: React.FunctionComponent<Props> = ({ valueInput }) => {
  const { data: allTokens } = useFetchToken()
  const { data: account } = useGetAccount()
  const { data: searchIndex } = useSearchableTokenList('name', 'symbol', 'pSymbol')
  const sortArrayByFollowing = React.useCallback(
    (tokenList: any[]) => {
      const listFollowing = []
      const listWithoutFollowing = []
      for (let i = 0; i < tokenList.length; i++) {
        if (account.followingTokens.includes(tokenList[i].tokenId)) {
          listFollowing.push(tokenList[i])
        } else {
          listWithoutFollowing.push(tokenList[i])
        }
      }
      return listFollowing.concat(listWithoutFollowing)
    },
    [allTokens, valueInput],
  )
  const tokenList = React.useMemo(() => {
    if (!allTokens) {
      return []
    }
    const list = orderBy(allTokens, ['tokenType', 'verified'], 'desc')
    if (`${valueInput}`.trim() !== '') {
      const searchedList = list.filter((item) => item.name.trim().toLowerCase().indexOf(valueInput.trim().toLowerCase()) !== -1)
      return searchedList
    }
    return list
  }, [allTokens, valueInput, searchIndex])

  const onRenderCell = React.useCallback((item: TokenItemInterface): JSX.Element => <TokenCell item={item} />, [allTokens])

  if (tokenList) {
    return (
      <FocusZone direction={FocusZoneDirection.vertical}>
        <div className={classNames(`${classNamesList.container} list-token`)} data-is-scrollable>
          <List items={sortArrayByFollowing(tokenList)} onRenderCell={onRenderCell} />
        </div>
      </FocusZone>
    )
  }
  return <SpinnerWallet />
}
