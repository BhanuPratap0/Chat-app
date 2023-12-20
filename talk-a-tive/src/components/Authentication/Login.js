import React, { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    let history = useNavigate();
    const toast = useToast()
    const handleClick = () => { setShow(!show) }

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Please Fill all the Feilds',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            };
            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config
            );
            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history("/chats");
        } catch (error) {
            toast({
                title: 'Password Do Not Match',
                description: error.response.data.message,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    };

    return (
        <div>
            <VStack
                spacing={'5px'}
            >
                <FormControl id='email' isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        value={email}
                        placeholder='Enter Your Email'
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                </FormControl>
                <FormControl id='password' isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            value={password}
                            type={show ? 'text' : 'password'}
                            placeholder='Enter Your Password'
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        <InputRightElement>
                            <Button size="sm" h={"1.75rem"} onClick={handleClick} >
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <Button
                    colorScheme='blue'
                    width={"100%"}
                    style={{ marginTop: 15 }}
                    onClick={submitHandler}
                    isLoading={loading}
                >
                    Login</Button>
                <Button
                    colorScheme='red'
                    width={"100%"}
                    style={{ marginTop: 15 }}
                    onClick={() => {
                        setEmail("guest@example.com");
                        setPassword("123456");
                    }}
                >
                    Get Guest User Credentials</Button>
            </VStack>
        </div>
    )
}

export default Login
