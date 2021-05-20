import { Avatar } from '@material-ui/core'
import React from 'react'
import "./SidebarChar.css"

function SidebarChar() {
    return (
        <div className="sidebarChat">
            <Avatar />
            <div className="sidebarChat__info">
                <h2>Room Name</h2>
                <p>This is last message</p>
            </div>
        </div>
    )
}

export default SidebarChar
