import { Box, Button, FormControl, FormLabel, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserListItem from '../UserAvatar/UserListItem'
import ChatLoading from '../ChatLoading';
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import { ModeState } from '../../Context/ModeProvider'

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUser, setSelectedUser] = useState([]);
    const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState(false);

    const toast = useToast()
    const {mode} = ModeState();

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

    const handleGroup = async (userToAdd) => {
        if (selectedUser.includes(userToAdd)) {
            toast({
                title: "User already added!",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        setSelectedUser([...selectedUser, userToAdd]);
        console.log(selectedUser)

    }

    const handleDelete = (deletedUser) => {
        setSelectedUser(
            selectedUser.filter((sel) => sel._id !== deletedUser._id)
        );
    };

    const handleSubmit = async() => {
        if (!groupChatName || !selectedUser) {
            toast({
                title: "Please fill all the feilds!",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post('/api/chat/group',
            {
                name: groupChatName,
                users: JSON.stringify(selectedUser.map((u) => u._id))
            },
            config
            );
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
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
        }
    }


    return (
        <div>
            <Button onClick={onOpen}> {children} </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                backgroundColor={mode === "light" ? "white" : "#3f3f3f"}
                color={mode === "light" ? "black" : "white"}
                >
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                onChange={(e)=>setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel></FormLabel>
                            <Input
                                placeholder='Add Users eg: John, Bhanu, Jane'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w={"100%"} display={"flex"} flexWrap={"wrap"} >
                            {selectedUser && selectedUser.map((u) => {
                                return <UserBadgeItem
                                    key={user._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            })}
                        </Box>

                        {loading ? <Spinner ml="auto" /> :
                            (
                                searchResult?.slice(0, 4).map((user) => {
                                    return <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                })
                            )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default GroupChatModal
