import React, { useEffect } from 'react'
import { Container, Box, Text, TabPanels, Tab, Tabs, TabList, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Singup from '../components/Authentication/Singup'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  let history = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
       
        if (!userInfo) {
            history("/chats")
        }
    }, [history])


  return (
    <div>
      <Container maxW='xl' centerContent>
        <Box
          d="flex"
          p={3}
          bg={"white"}
          justifyContent="center"
          w="100%"
          m="40px 0 15px 0"
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Text fontSize={"4xl"} fontFamily={"Work sans"} color={"black"} >Talk-A-Tive</Text>
        </Box>
        <Box  bg={"white"} w="100%" p={4} borderRadius={"lg"} color={"black"}  >
          <Tabs variant='soft-rounded'>
            <TabList mb="1em">
              <Tab w="50%" >Login</Tab>
              <Tab w="50%" >Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel><Login/></TabPanel>
              <TabPanel><Singup/></TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  )
}

export default Home
