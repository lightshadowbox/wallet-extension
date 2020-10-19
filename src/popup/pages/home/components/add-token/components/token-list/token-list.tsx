/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './token-list.css'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { walletRuntime } from 'services/wallet'

import classNames from 'classnames'
import { useQuery } from 'react-query'
import { useGetTokenList } from 'queries/use-get-token-list'
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
  Spinner,
  SpinnerSize,
  IStackProps,
  Stack,
} from '@fluentui/react'

import GetTokens, { TokenItemInterface } from './token'
import styles from './token-list.module.css'

const theme: ITheme = getTheme()
const { palette, semanticColors, fonts } = theme
interface Props {
  accountName: string
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
      cursor: 'pointer',
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
const followToken = async (tokenId) => {
  const account = await walletRuntime.masterAccount.getAccounts()[0]
  if (account) {
    account.followTokenById(tokenId)
    console.log('list tokens ', account.privacyTokenIds)
  }
}
const onRenderCell = (item: TokenItemInterface, index: number, isScrolling: boolean): JSX.Element => {
  const clickAddToken = () => {
    followToken(item.tokenId)
  }
  return (
    <div onClick={clickAddToken} className={classNamesList.itemCell} data-is-focusable>
      <div className={classNames(`imgContainer ${styles.imgContainer}`)}>
        <Image className={classNamesList.itemImage} src={item.icon} width={36} height={36} imageFit={ImageFit.cover} />
        {item.isFollowing ? (
          <div className={styles.containerIcon}>
            <FontIcon iconName="SkypeCircleCheck" />
          </div>
        ) : null}
      </div>
      <div className={classNamesList.itemContent} style={{ display: 'flex', alignItems: 'center' }}>
        <div className={classNamesList.itemName}>{item.name}</div>
      </div>
    </div>
  )
}

export const ListGhostingExample: React.FunctionComponent<Props> = (accountName) => {
  const { data, status } = useQuery('token', GetTokens)
  const [listTokens, setListTokens] = React.useState([])
  const tokens = useGetTokenList('Account 0')
  const rowProps: IStackProps = { horizontal: true, verticalAlign: 'center' }

  const token = {
    sectionStack: {
      childrenGap: 10,
    },
    spinnerStack: {
      childrenGap: 20,
    },
  }
  React.useEffect(() => {
    if (data) {
      data.forEach((a) => {
        for (let i = 0; i < tokens.length; i++) {
          if (a.tokenId === tokens[i]) {
            a.isFollowing = true
          }
        }
      })
      setListTokens(data)
    }
  }, [data])
  if (status === 'success') {
    return (
      <FocusZone direction={FocusZoneDirection.vertical}>
        <div className={classNamesList.container} data-is-scrollable>
          <List items={listTokens} onRenderCell={onRenderCell} />
        </div>
      </FocusZone>
    )
  }
  return (
    <div className={classNames('w-full h-full flex flex-col align-middle justify-center')}>
      <Stack {...rowProps} tokens={token.spinnerStack}>
        <Spinner size={SpinnerSize.large} />
      </Stack>
    </div>
  )
}
