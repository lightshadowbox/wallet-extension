/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { getTheme, mergeStyleSets, FontWeights, ContextualMenu, Modal, IDragOptions, IconButton, IIconProps } from '@fluentui/react'
import { useId, useBoolean } from '@uifabric/react-hooks'
import { SecondaryButton } from 'popup/components/button'
import { useAddAccount } from 'queries/create-account.mutation'
import './modal.css'
import classNames from 'classnames'

interface Props {
  isModalOpen: boolean
  showModal: () => void
  hideModal: () => void
}
const dragOptions: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
}
const cancelIcon: IIconProps = { iconName: 'Cancel' }

export const ModalAddAccount: React.FunctionComponent<Props> = ({ showModal, hideModal, isModalOpen }) => {
  const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(true)
  const [addAccount, addAccountStatus] = useAddAccount(hideModal)
  // Use useId() to ensure that the IDs are unique on the page.
  // (It's also okay to use plain strings and manually ensure uniqueness.)
  const titleId = useId('title')
  const [name, setName] = React.useState('')
  const clickAddAccount = () => {
    addAccount(name)
    setName('')
  }

  return (
    <div>
      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
        containerClassName={contentStyles.container}
        dragOptions={isDraggable ? dragOptions : undefined}
      >
        <div className={contentStyles.header}>
          <span id={titleId}>Add Account</span>
          <IconButton styles={iconButtonStyles} iconProps={cancelIcon} ariaLabel="Close popup modal" onClick={hideModal} />
        </div>
        <div className={contentStyles.body}>
          <form>
            <label htmlFor="name">Name</label>
            <input autoComplete="off" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </form>
          <div className={classNames('flex align-middle justify-center w-full mt-6')}>
            <SecondaryButton iconProps={{ iconName: 'Add' }} onClick={clickAddAccount}>
              Add
            </SecondaryButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const theme = getTheme()
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
})
const toggleStyles = { root: { marginBottom: '20px' } }
const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
}
