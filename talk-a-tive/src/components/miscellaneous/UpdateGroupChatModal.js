import { ViewIcon } from '@chakra-ui/icons';
import {

    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, useDisclosure, IconButton, Button, useToast, Box, FormControl, Input, Spinner
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState();
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const handleDelete = () => { }

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put('api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            toast({
                title: "Group Chat Name Updated!",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: "top"
            });

        } catch (error) {
            toast({
                title: "Error Occurred!",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    }
    
    const handleSearch = async (query) => {
        setLoading(true);
        setSearch(query)
        if (!query) {
            setLoading(false);
            return;
        }
        try {

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);

        } catch (error) {

        }
    }
    const handleRemove = async(user1) => {
        if(selectedChat.groupAdmin._id !==user._id && user1._id !== user._id){
            toast({
                title: "Only Admin can perform this action!",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.put('/api/chat/groupremove',
            {
                chatId: selectedChat._id,
                userId: user1._id,
            },config);

            user1._id === user._id ? setSelectedChat() :setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            setLoading(false)
        }

    }
    const handleAddUser = async(user1) => {
         if(selectedChat.users.find((u) => u._id === user1.id)){
            toast({
                title: "User Already Exist!",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return;
         }

         try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.put('/api/chat/groupadd',{
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            toast({
                title: "User Added To Group Chat!",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: "top"
            });

         } catch (error) {
            toast({
                title: "User Already Exist!",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            setLoading(false);
         }
    }

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3} >
                            {selectedChat.users.map((u) => {
                                return <UserBadgeItem
                                    key={user._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            })}
                        </Box>
                        <FormControl display={"flex"} >
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant={"solid"}
                                backgroundColor={"teal"}
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        {selectedChat.groupAdmin._id === user._id && <FormControl>
                            <Input
                                placeholder='Add User to Group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>}
                        { 
                            loading ? (
                                <Spinner size={"lg"} />
                            ) : (
                                searchResult?.map((user)=>{
                                    return <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                    >
                                    </UserListItem>
                                })
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme='red' >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
