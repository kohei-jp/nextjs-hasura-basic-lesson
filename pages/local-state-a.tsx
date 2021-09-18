import { VFC } from 'react'
import { LocalStateA } from '../components/LocalStateA'
import { Layout } from '../components/Layout'

import React from 'react'

const LocalStatePageA: VFC = () => {
  return (
    <Layout title="Local State A">
      <LocalStateA />
    </Layout>
  )
}

export default LocalStatePageA
