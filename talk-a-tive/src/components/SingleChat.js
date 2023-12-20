import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from '../components/miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import './style.css'

import animationData from "../animation/typing.json"
import io from 'socket.io-client'
import Lottie from 'react-lottie'

const PORT = process.env.PORT;
const ENDPOINT = `https://talk-a-tive-ihk6.onrender.com:${PORT}`;
var socket, selectedChatCompare;



const SingleChat = ({ fetchAgain, setFetchAgain }) => {
   

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRation: "XMidYMid slice",
        },
    };

    const toast = useToast();

    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", ()=> setIsTyping(true));
        socket.on("stop typing", ()=> setIsTyping(false));
    },[])

    useEffect(()=>{
        fetchMessages();
        selectedChatCompare = selectedChat;
    },[selectedChat])


    useEffect(()=>{
        socket.on('message recieved', (newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                if(!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })

    const sendMessage = async(event) => {
        if(event.key === "Enter" && newMessage){
            socket.emit("stop typing", selectedChat._id);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setNewMessage("")
            const { data } = await axios.post('/api/message', 
            {
                content: newMessage,
                chatId: selectedChat._id,
            },config)

            

            socket.emit("new message", data);
            setMessages([...messages, data])
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description:"Failed to send the Messages",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        }
    }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        //Typing indicator logic
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);

    }

    const fetchMessages = async() => {
        if(!selectedChat) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/message/${selectedChat._id}`,config);
            
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description:"Failed to Load the Messages",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            setLoading(false);
        }
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        display={"flex"}
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w={"100%"}
                        fontFamily={"Work sans"}
                        justifyContent={{ base: "space-between" }}
                        alignItems={"center"}
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat(null)}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>{getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>{selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal 
                             fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                            </>
                        )}
                    </Text>
                    <Box
                        display={"flex"}
                        flexDir={"column"}
                        justifyContent={"flex-end"}
                        p={3}
                        bg={"#E8E8E8"}
                        w={"100%"}
                        h={"100%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                    >
                        {loading ? 
                        (<Spinner size={"xl"} w={20} h={20} alignSelf={"center"} margin={"auto"}  />)
                        : 
                        (<div className='messages' >
                             <ScrollableChat messages={messages} />
                        </div>)}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? <div>
                                <Lottie
                                options={defaultOptions}
                                width={70}
                                height={40}
                                style={{marginBottom: 15, marginLeft: 0}}
                                />
                            </div>: (<></>)}
                        <Input
                        variant={"filled"}
                        placeholder='Enter Your Message'
                        background={"#E0E0E0"}
                        onChange={typingHandler}
                        value={newMessage}
                        />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} height={"100%"} >
                    <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat
