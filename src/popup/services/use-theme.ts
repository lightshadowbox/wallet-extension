/* eslint-disable import/no-extraneous-dependencies */
/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

import React from 'react'

import {
  Customizations,
  CustomizerContext,
  ICustomizerContext,
  ITheme
} from '@fluentui/react'
import { useForceUpdate } from '@uifabric/react-hooks'

/**
 * A hook that provides the currently accessible Office Fabric Theme instance.
 * This hook handles both global theming, as well as local Customizer contexts.
 */
export function useTheme(): ITheme {
  // We need the ability to force a re-render if the global Customizations
  // pushes a change, as it lives outside of the React life-cycle
  const forceUpdate = useForceUpdate()

  // Well actually, we only care about changes to global Customizations
  // if we're not within a local CustomizerContext
  const inCustomizerContext = React.useRef(false)

  React.useEffect(() => {
    if (!inCustomizerContext.current) {
      Customizations.observe(forceUpdate)
    }

    return () => {
      if (!inCustomizerContext.current) {
        Customizations.unobserve(forceUpdate)
      }
    }
  }, [forceUpdate, inCustomizerContext])

  // Check if we are in a local CustomizerContext
  const customizerContext: ICustomizerContext = React.useContext(CustomizerContext)
  inCustomizerContext.current = !!customizerContext.customizations.inCustomizerContext

  // Customizations.getSettings will get the global theme by default,
  // or get the locally-scoped theme if present
  const customizationSettings = Customizations.getSettings(['theme'], '', customizerContext.customizations)

  return customizationSettings.theme
}
