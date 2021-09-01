import React, { useState } from 'react'
import { Dropdown, Menu } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'

function Nav (props) {
    const { titleIcon, titleText, textColor, activeColor, leftMenu, rightMenu } = props.data

    const getActiveItemByPath = (menus, pathname) => {
        for (let item of menus){
            if(item.subitems && item.subitems.length > 0){
                for(let i of item.subitems){
                    if(i.href === pathname){
                        return i.key
                    }
                }
            }
            if(item.href === pathname){
                return item.key
            }
        }
        return ''
    }

    const selectActiveItem = () => {
        const pathname = props.location.pathname
        const val = getActiveItemByPath(leftMenu, pathname)
        return val === '' ? getActiveItemByPath(leftMenu, pathname) : val
    }

    const [activeItem, setActiveItem] = useState(selectActiveItem())

    const handleMenuClick = (menu) => {
        if(menu.externalLink){
            window.open(menu.href)
        }else{
            setActiveItem(menu.key)
            props.history.push(menu.href)
        }
    }

    const menuView = (menus) => {
        return menus.map((item) => {
            return item.subitems && item.subitems.length ?
            (
                <Dropdown key={item.key} item text={item.title} style={{ color: textColor }}>
                    <Dropdown.Menu>
                        {
                            item.subitems.map((i) => {
                                return(
                                    <Dropdown.Item onClick={() => handleMenuClick(i)} key={i.key} >
                                        {i.title}
                                    </Dropdown.Item>
                                )
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            ) :
            (
                <Menu.Item key={item.key}
                    active={activeItem === item.key}
                    style={{ color: textColor }}
                    onClick={() => handleMenuClick(item)}
                >
                    {item.title}
                </Menu.Item>
            )
        })
    }

    return (
        <Menu size='huge' style={{ padding: '0 4$%', background: 'black'}}
            color={ activeColor } pointing secondary
        >
            <Menu.Item header>
                <img style={{ height: '18px', width: '18px' }} src={titleIcon} alt='icon' />
                <span style={{ color: 'white', marginLeft: '10px'}} >
                    {titleText}
                </span>
            </Menu.Item>
            <Menu.Menu position='left' >
                {menuView(leftMenu)}
            </Menu.Menu>
            <Menu.Menu position='right'>
                {menuView(rightMenu)}
            </Menu.Menu>
        </Menu>
    )
}

export default withRouter(React.memo(Nav))