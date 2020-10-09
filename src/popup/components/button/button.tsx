import styled from 'styled-components'
import { PrimaryButton } from '@fluentui/react'

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
   * How large should the button be?
   */
  widthSize?: 'small' | 'medium'
}

export const BaseButton = styled(PrimaryButton)<ButtonProps>`
  flex-grow: ${(props) => (props.full ? 1 : 0)};
  min-width: ${(props) => (props.widthSize === 'small' ? '100px' : '142px')};
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
  min-width: ${(props) => (props.widthSize === 'small' ? '100px' : '142px')};
  min-height: 48px;
  border: none;
  background-color: ${(props) => props.theme.palette.themeLighterAlt};
  color: ${(props) => props.textColor || props.theme.palette.themePrimary};

  .ms-Button-flexContainer {
    font-size: 1rem;
    font-weight: 600;
  }

  &:hover {
    color: ${(props) => props.textColor || props.theme.palette.themePrimary};
    border: none;
    background-color: ${(props) => props.theme.palette.themeLighter};
  }

  &:active {
    color: ${(props) => props.textColor || props.theme.palette.themePrimary};
    border: none;
    background-color: ${(props) => props.theme.palette.themeLight};
  }
`
