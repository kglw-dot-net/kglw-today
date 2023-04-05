import React from 'react';

export const Head = ({pageContext: {redirectTo}}) =>
  <meta httpEquiv="refresh" content={`0; URL=${redirectTo}`}/>

export default function ShowRedirect({pageContext: {redirectTo}}) {
  return <>
    <p>Redirecting to <a href={redirectTo}>{redirectTo}</a></p>
  </>
}
