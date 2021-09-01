import React from 'react'
import { Header, Label } from 'semantic-ui-react'
import { PageAboutWrap } from './style'
import avatar from '../../assets/author.jpg'

function PageAbout (props) {
  return (
    <PageAboutWrap>
      <Header as='h1'>Wilson Lab Database.</Header>
      <Header as='h3'>Building...</Header>
      <Label as='a' size='large' image>
        <img src={avatar} alt='author avatar' />Yohohoho
      </Label>
    </PageAboutWrap>
  )
}

export default React.memo(PageAbout)