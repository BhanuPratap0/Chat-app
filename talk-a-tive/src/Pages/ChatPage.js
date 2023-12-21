import React, { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer'
import ChatBox from '../components/ChatBox'
import MyChats from '../components/MyChats'
import { ModeState } from '../Context/ModeProvider';

const ChatPage = () => {

    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState();
    const {mode} = ModeState();

    return (
        <div style={{width:"100%",}} >
            {user && <SideDrawer/>}
            <Box
                display={"flex"}
                width={"100%"}
                height={"91.5vh"}
                padding={"10px"}
                justifyContent={"space-between"}
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage;
