import React from 'react'
import { Divider, Label } from 'semantic-ui-react'
import { FooterWrap } from './style'

function Footer(props){
    const {author, copyright} = props.data

    return(
        <FooterWrap>
            <Divider />
            <div className='row-bottom'>
                <span style={{marginRight: '4px'}} >Design By</span>
                <Label as='a' size='mini' image>
                    <img src={ author.avatar } alt='author avatar' />
                    { author.name }
                </Label>
                <p>{ copyright }</p>
            </div>    
        </FooterWrap>
    )
}

export default React.memo(Footer)