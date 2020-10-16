/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import {
  FontIcon,
  FocusZone,
  FocusZoneDirection,
  List,
  Image,
  ImageFit,
  ITheme,
  mergeStyleSets,
  getTheme,
  getFocusStyle,
} from '@fluentui/react'
import { createListItems, IExampleItem } from '@uifabric/example-data'
import { useConst } from '@uifabric/react-hooks'
import classNames from 'classnames'
import { useQuery } from 'react-query'
import styles from './token-list.module.css'
import GetTokens, { TokenItemInterface } from './token'
import './token-list.css'

const theme: ITheme = getTheme()
const { palette, semanticColors, fonts } = theme
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
const onRenderCell = (item: TokenItemInterface, index: number, isScrolling: boolean): JSX.Element => {
  return (
    <div className={classNamesList.itemCell} data-is-focusable>
      <div className={classNames(`imgContainer ${styles.imgContainer}`)}>
        <Image
          className={classNamesList.itemImage}
          src="https://picsum.photos/200"
          width={36}
          height={36}
          imageFit={ImageFit.cover}
        />
        <div className={styles.containerIcon}>
          <FontIcon iconName="SkypeCircleCheck" />
        </div>
      </div>
      <div className={classNamesList.itemContent} style={{ display: 'flex', alignItems: 'center' }}>
        <div className={classNamesList.itemName}>{item.name}</div>
      </div>
    </div>
  )
}
export const ListGhostingExample: React.FunctionComponent = () => {
  const items = useConst(() => createListItems(5000))
  const { data, status } = useQuery('token', GetTokens)
  if (status === 'success') {
    return (
      <FocusZone direction={FocusZoneDirection.vertical}>
        <div className={classNamesList.container} data-is-scrollable>
          <List items={data} onRenderCell={onRenderCell} />
        </div>
      </FocusZone>
    )
  }
  return <h1>Loading...</h1>
}
