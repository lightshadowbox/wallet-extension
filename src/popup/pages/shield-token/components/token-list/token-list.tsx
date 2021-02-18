/* eslint-disable react/button-has-type */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './token-list.css'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react'

import classNames from 'classnames'
import {
  FocusZone,
  FocusZoneDirection,
  getFocusStyle,
  getTheme,
  ITheme,
  List,
  mergeStyleSets,
  IPersonaSharedProps,
  Persona,
  PersonaPresence,
} from '@fluentui/react'

import { useGetAccount } from 'queries/account.queries'
import { TokenItemInterface, useFetchToken, useSearchableOnlyVerifiedToken, useSearchableTokenList } from 'queries/token.queries'

import { SpinnerWallet } from 'popup/components'
import { orderBy } from 'lodash'

const theme: ITheme = getTheme()
const PRV_TOKEN_ID = '0000000000000000000000000000000000000000000000000000000000000004'
const { palette, semanticColors, fonts } = theme
interface Props {
  valueInput: string
  showCustom: boolean
  showPanelReceive: () => void
  setTokenId: (value) => void
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

export const TokenCell: React.FC<{ item: TokenItemInterface; onClickHandle: () => void; setTokenId: (value) => void }> = ({
  item,
  onClickHandle,
  setTokenId,
}) => {
  const examplePersona: IPersonaSharedProps = {
    imageUrl: item.Icon,
    imageInitials: item.Name[0] + item.Name[1],
    text: item.Name,
    secondaryText: item.PSymbol || item.Symbol,
  }
  return (
    <div
      onClick={() => {
        if (item.TokenID !== PRV_TOKEN_ID) {
          onClickHandle()
          setTokenId(item.TokenID)
        }
      }}
      className={`${classNamesList.itemCell} cursor-pointer token-list-container justify-between`}
      data-is-focusable
    >
      <Persona {...examplePersona} presence={item.Verified ? PersonaPresence.online : PersonaPresence.offline} imageAlt="Image" />
    </div>
  )
}

export const ListGhostingExample: React.FunctionComponent<Props> = ({ valueInput, showCustom, showPanelReceive, setTokenId }) => {
  const { data: allTokens } = useFetchToken()
  const { data: account } = useGetAccount()
  const { data: searchIndex } = useSearchableTokenList('PSymbol', 'Name')
  const { data: searchOnlyVerifiedIndex } = useSearchableOnlyVerifiedToken('PSymbol', 'Name')
  const sortArrayByFollowing = (tokenList: any[]) => {
    const listVerified = []
    for (let i = 0; i < tokenList.length; i++) {
      if (tokenList[i].Verified) {
        listVerified.push(tokenList[i])
      }
    }
    return listVerified
  }
  const tokenList = React.useMemo(() => {
    if (!allTokens) {
      return []
    }
    if (showCustom && `${valueInput}`.trim() !== '') {
      return searchOnlyVerifiedIndex.search<TokenItemInterface>(valueInput).map((i) => {
        return i.item
      })
    }
    if (`${valueInput}`.trim() !== '') {
      return searchIndex.search<TokenItemInterface>(valueInput).map((i) => {
        return i.item
      })
    }

    return orderBy(allTokens, ['Verified', 'PSymbol', 'IsCustom'], ['desc', 'asc', 'desc'])
  }, [searchOnlyVerifiedIndex, showCustom, allTokens, searchIndex, valueInput])

  const onRenderCell = (item: TokenItemInterface, showPanelReceive: () => void, setTokenId: (value) => void): JSX.Element => (
    <TokenCell setTokenId={setTokenId} item={item} onClickHandle={showPanelReceive} />
  )

  if (tokenList) {
    return (
      <FocusZone direction={FocusZoneDirection.vertical}>
        <div className={classNames(`${classNamesList.container} list-token`)} data-is-scrollable>
          <List items={sortArrayByFollowing(tokenList)} onRenderCell={(item) => onRenderCell(item, showPanelReceive, setTokenId)} />
        </div>
      </FocusZone>
    )
  }
  return <SpinnerWallet />
}
