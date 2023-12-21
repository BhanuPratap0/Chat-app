import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import { Avatar, Box, Text, Tooltip } from '@chakra-ui/react'
import { ModeState } from '../Context/ModeProvider'

const ScrollableChat = ({selectedChat, messages}) => {
    const { user } = ChatState();
    const {mode} =ModeState();
  return (
    <ScrollableFeed>
      {messages && 
      messages.map((m,i) => {
        return <><div style={{display: "flex"}} key={m._id}>
                {
                    (isSameSender(messages, m, i, user._id)
                    || isLastMessage(messages, i, user._id))
                    && (<Tooltip
                    label ={m.sender.name}
                    placement='bottom-start'
                    hasArrow >
                        <Avatar
                        mt={"7px"}
                        mr={1}
                        size={"sm"}
                        cursor={"pointer"}
                        name={m.sender.name}
                        src={m.sender.pic}
                        />
                    </Tooltip>)
                }
                <span style={{
                  // backgroundColor : `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                  backgroundColor : `${m.sender._id === user._id ? mode=='light'?"#BEE3F8":"#647E68" :mode=='light'?"#B9F5D0":"#1F6E8C"}`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 :10,
                }} >{m.content}</span>
        </div>
        {(isSameSender(messages, m, i, user._id)
          || isLastMessage(messages, i, user._id))
          && selectedChat.isGroupChat && <Text
          fontSize={"0.7rem"}
          >{m.sender.name.split(" ")[0]}</Text>}
          </>
      })}
    </ScrollableFeed>
  )
}

export default ScrollableChat
