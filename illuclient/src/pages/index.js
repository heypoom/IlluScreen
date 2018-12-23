import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import DrawingBoard from '../components/DrawingBoard'

const IndexPage = () => (
  <Layout>
    <div>
      <DrawingBoard />
    </div>
  </Layout>
)

export default IndexPage
