import { useState } from 'react'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, FormControl, FormLabel, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Switch, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge, { Effect } from 'react-notification-badge';
import { ModeState } from '../../Context/ModeProvider';

const SideDrawer = () => {

  const [search, setSearch] = useState();
  // const [test, setTest] = useState();
  const [searchResult, setSearchResult] = useState([

  ]);
  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState(false);

  let history = useNavigate();
  const { user, setSelectedChat, selectedChat, chats, setChats, notification, setNotification } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()


  const { mode, handleMode } = ModeState();


  const logouthandler = () => {
    localStorage.removeItem("userInfo")
    history("/")
  }
  const accessChat = async (userId) => {
    try {

      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Fetching the Chat!",
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top-left"
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something to search',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: "top-left"
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      console.log(data);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: 'Failed to load the search results',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: "top-left"
      });
      setLoading(false);
    }
  }

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        backgroundColor={mode === "light" ? "white" : "#3f3f3f"}
        color={mode === "light" ? "black" : "white"}
        w={"100%"}
        p="5px 10px 5px 10px"
        borderColor={mode === "light" ? "white" : "#3f3f3f"}
        borderWidth={"5px"}
      >
        <Tooltip label="Seach Users To Chat" hasArrow placement='bottom-end'>
          <Button onClick={onOpen} variant={"ghost"} >
            <i className="fa-solid fa-magnifying-glass" style={{ color: "#ff643d" }}></i>
            <Text display={{ base: "none", md: "flex" }} px="4" color={mode === "light" ? "black" : "white"} >Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"} > Talk-A-Tive </Text>
        <div>
          <Menu >
            <MenuButton p={"1"}>
              <NotificationBadge
                count={notification.length}
                effect={Effect}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList backgroundColor={mode === "light" ? "white" : "#3f3f3f"}
              color={mode === "light" ? "black" : "white"} pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem key={notif._id} onClick={() => {
                  setSelectedChat(notif.chat)
                  setNotification(notification.filter((n) => n !== notif));
                }} >
                  {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu
            backgroundColor={mode === "light" ? "white" : "#3f3f3f"}
            color={mode === "light" ? "black" : "white"}
          >
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
              <Avatar
                size='sm'
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList backgroundColor={mode === "light" ? "white" : "#3f3f3f"}
              color={mode === "light" ? "black" : "white"}>
              <ProfileModal user={user}>
                <MenuItem
                  backgroundColor={mode === "light" ? "white" : "#3f3f3f"}
                  color={mode === "light" ? "black" : "white"}
                >My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider ></MenuDivider>
              <MenuItem backgroundColor={mode === "light" ? "white" : "#3f3f3f"}
                color={mode === "light" ? "black" : "white"} onClick={logouthandler} >Logout</MenuItem>
                <MenuDivider ></MenuDivider>
              <MenuItem backgroundColor={mode === "light" ? "white" : "#3f3f3f"}
                color={mode === "light" ? "black" : "white"}>

                <FormControl display='flex' alignItems='center'>
                  <FormLabel htmlFor='email-alerts' mb='0'>
                    Dark Mode
                  </FormLabel>
                  <Switch onChange={handleMode} />
                </FormControl>

              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* Users Drawer */}

      <Drawer  placement='left' onClose={onClose} isOpen={isOpen}  >
        <DrawerOverlay />
        <DrawerContent bg={mode==="light"?"white":"#575757"} color={mode === "light" ? "black" : "white"}>
          <DrawerHeader borderBottomWidth={"1px"} >Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"}>
              <Input
                background={"#E0E0E0"}
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onClick={handleSearch}
              >Go</Button>
            </Box>
            {loading ? (<ChatLoading />) :
              (
                searchResult?.map((user) => {
                  return <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                })
              )}
            {loadingChat && <Spinner ml="auto" display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
