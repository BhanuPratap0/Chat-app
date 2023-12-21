import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
import { ModeState } from '../Context/ModeProvider';

const ChatBox = ({ fetchAgain, setFetchAgain}) => {

   const { selectedChat } = ChatState();
   const {mode} =ModeState();

  return (
    <Box
    display={{ base: selectedChat ? "flex" : "none", md:"flex"}}
    alignItems={"center"}
    flexDir={"column"}
    p={3}
    bg={mode==="light"?"white":"#575757"}
    color={mode === "light" ? "black" : "white"}
    w={{base: "100%", md: "68%"}}
    borderRadius={"lg"}
    borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} ></SingleChat>
    </Box>
  )
}

export default ChatBox
