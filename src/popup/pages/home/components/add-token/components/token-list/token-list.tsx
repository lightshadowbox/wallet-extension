/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react'

import classNames from 'classnames'
import {
  FocusZone,
  FocusZoneDirection,
  FontIcon,
  getFocusStyle,
  getTheme,
  Image,
  ImageFit,
  ITheme,
  List,
  mergeStyleSets,
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
} from '@fluentui/react'

import { useGetAccount } from 'queries/account.queries'
import { TokenItemInterface, useFetchToken, useSearchableOnlyVerifiedToken, useSearchableTokenList } from 'queries/token.queries'

import { SpinnerWallet } from 'popup/components/spinner/spinner-wallet'
import { useAddToken, useRemoveToken } from 'queries/create-account.mutation'
import { orderBy, filter } from 'lodash'
import styles from './token-list.module.css'
import './token-list.css'

const theme: ITheme = getTheme()
const { palette, semanticColors, fonts } = theme
interface Props {
  valueInput: string
  showCustom: boolean
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
  const {
    data: { followingTokens },
  } = useGetAccount()

  const examplePersona: IPersonaSharedProps = {
    imageUrl: item?.Icon,
    imageInitials: item?.Name[0] + item?.Name[1],
    text: item?.Name,
    secondaryText: item?.PSymbol || item?.Symbol,
  }
  const isFollowingToken = React.useMemo(() => {
    return followingTokens?.indexOf(item.TokenID) !== -1
  }, [followingTokens, item.TokenID])
  return (
    <div className={`${classNamesList.itemCell} token-list-container justify-between`} data-is-focusable>
      <Persona {...examplePersona} presence={item.Verified ? PersonaPresence.online : PersonaPresence.offline} imageAlt="Image" />
      <div className={classNames('flex flex-row items-center justify-center btn-token')}>
        {isFollowingToken ? (
          <button
            onClick={() => {
              removeToken(item.TokenID)
            }}
            className={styles.btnRemove}
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() => {
              addToken(item.TokenID)
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

export const ListGhostingExample: React.FunctionComponent<Props> = ({ valueInput, showCustom }) => {
  const { data: allTokens } = useFetchToken()
  const { data: account } = useGetAccount()
  const { data: searchIndex } = useSearchableTokenList('Symbol', 'PSymbol', 'Name')
  const { data: searchOnlyVerifiedIndex } = useSearchableOnlyVerifiedToken('Symbol', 'PSymbol', 'Name')
  const sortArrayByFollowing = (tokenList: any[]) => {
    const listFollowing = []
    const listWithoutFollowing = []
    for (let i = 0; i < tokenList.length; i++) {
      if (account.followingTokens.includes(tokenList[i].TokenID)) {
        listFollowing.push(tokenList[i])
      } else {
        listWithoutFollowing.push(tokenList[i])
      }
    }
    return listFollowing.concat(listWithoutFollowing)
  }

  const tokenList = React.useMemo(() => {
    if (!allTokens) {
      return []
    }

    if (`${valueInput}`.trim() !== '') {
      const baseSearch = showCustom ? searchOnlyVerifiedIndex : searchIndex
      return baseSearch.search<TokenItemInterface>(`^${valueInput}`).map((i) => i.item)
    }

    return orderBy(filter(allTokens, { Verified: showCustom }), ['Verified', 'Symbol', 'PSymbol', 'IsCustom'], ['desc', 'asc', 'asc', 'desc'])
  }, [searchOnlyVerifiedIndex, showCustom, allTokens, valueInput, searchIndex])

  const onRenderCell = (item: TokenItemInterface): JSX.Element => <TokenCell item={item} />

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
