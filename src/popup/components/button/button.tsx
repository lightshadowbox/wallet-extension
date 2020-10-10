import styled from 'styled-components'
import { PrimaryButton, IconButton } from '@fluentui/react'
import { fade } from 'popup/services/utils'

export interface ButtonProps {
  /**
   * Whether button expands full-width (only contained within flex)
   */
  full?: boolean
  /**
   * What text color to use
   */
  textColor?: string
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the button be?
   */
  coverSize?: 'small' | 'medium'
  /**
   * Whether button corner is rounded
   */
  rounded?: boolean
}

export interface FabProps {
  /**
   * What icon color is being used
   */
  iconColor?: string
  /**
   * Which size is being displayed
   */
  iconSize?: 'small' | 'medium'
}

export const Button = styled(PrimaryButton)<ButtonProps>`
  flex-grow: ${(props) => (props.full ? 1 : 0)};
  min-width: ${(props) => (props.coverSize === 'small' ? '100px' : '142px')};
  border-radius: ${(props) => props.rounded && '9999px'};
  min-height: 48px;
  border: none;

  .ms-Button-flexContainer {
    font-size: 1rem;
    font-weight: 600;
  }

  &:hover {
    border: none;
  }

  &:hover {
    border: none;
  }
`

export const SecondaryButton = styled(PrimaryButton)<ButtonProps>`
  flex-grow: ${(props) => (props.full ? 1 : 0)};
  min-width: ${(props) => (props.coverSize === 'small' ? '100px' : '142px')};
  min-height: ${(props) => (props.coverSize === 'small' ? '32px' : '48px')};
  border-radius: ${(props) => props.rounded && '9999px'};
  border: none;
  background-color: ${(props) => props.backgroundColor || props.theme.palette.themeLighterAlt};
  color: ${(props) => props.textColor || props.theme.palette?.themePrimary};

  .ms-Button-flexContainer {
    font-size: 1rem;
    font-weight: 600;
  }

  &:hover {
    color: ${(props) => props.textColor || props.theme.palette?.themePrimary};
    border: none;
    background-color: ${(props) => props.theme.palette?.themeLighter};
  }

  &:active {
    color: ${(props) => props.textColor || props.theme.palette?.themePrimary};
    border: none;
    background-color: ${(props) => props.theme.palette?.themeLight};
  }
`

export const FaButton = styled(IconButton)<FabProps>`
  &.ms-Button {
    color: ${(props) => props.iconColor};
    background-color: transparent;
    border-radius: 9999px;

    &:hover {
      color: ${(props) => props.iconColor};
      background-color: ${(props) => (props.iconColor ? fade(props.iconColor, 0.15) : null)};
    }

    &:active {
      color: ${(props) => props.iconColor};
      background-color: ${(props) => (props.iconColor ? fade(props.iconColor, 0.3) : null)};
    }
  }

  .ms-Icon {
    font-size: ${(props) => (props.iconSize === 'small' ? '1rem' : '1.25rem')};
  }
`
