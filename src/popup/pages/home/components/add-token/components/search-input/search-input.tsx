import classNames from 'classnames'
import React from 'react'
import { debounce } from 'lodash'
import { FontIcon } from '@fluentui/react'
import './search-input.css'
import { useAddToken } from 'queries/create-account.mutation'
import { useFetchToken } from 'queries/token.queries'
import styles from './search-input.module.css'

const debounceInput = 500 // ms

export const SearchInput: React.FC<{ placeholder: string; setValueInput: (value) => void; setShowCustom: (value) => void; valueInput: string }> = ({
  placeholder,
  setValueInput,
  setShowCustom,
  valueInput,
}) => {
  const { data: allTokens } = useFetchToken()
  const [addToken] = useAddToken()
  const onHandleKeyDown = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      const nodes = document.querySelectorAll('.list-token .ms-Persona-primaryText .ms-TooltipHost')
      console.log(nodes)
      for (const key in allTokens) {
        if (allTokens[key].TokenID === valueInput) {
          return addToken(valueInput)
        }
        if (allTokens[key].Name === valueInput) {
          return addToken(allTokens[key].TokenID)
        }
      }
      if (nodes.length !== 0) {
        let nameToken = ''
        for (let i = 0; i < nodes[0].innerHTML.length; i++) {
          if (nodes[0].innerHTML[i] === '<') {
            break
          }
          nameToken += nodes[0].innerHTML[i]
        }
        for (const key in allTokens) {
          if (allTokens[key].Name === nameToken) {
            addToken(allTokens[key].TokenID)
          }
        }
      }
    }
  }
  return (
    <div className={classNames('w-full relative search')}>
      <input
        onKeyDown={onHandleKeyDown}
        type="text"
        className={styles.input}
        placeholder={placeholder}
        onChange={debounce((e) => setValueInput(e.target.value), debounceInput)}
      />
      <div className={styles.icon}>
        <FontIcon iconName="Search" />
      </div>
      <div className={styles.verifyContainer}>
        <input type="checkbox" onChange={(e) => setShowCustom(e.target.checked)} className="check-verify" id="verify" />
        <label htmlFor="verify">Verified</label>
      </div>
    </div>
  )
}
