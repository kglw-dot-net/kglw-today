import * as React from "react"
import {Link} from 'gatsby'

const pageStyles = {
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
}

export const Head = () => <title>Home Page</title>

const IndexPage = () => {
  return (
    <main style={pageStyles}>
      <p><Link to="/jul-16" >Jul 16</Link></p>
    </main>
  )
}

export default IndexPage
