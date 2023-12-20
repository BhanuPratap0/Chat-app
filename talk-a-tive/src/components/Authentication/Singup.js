import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Singup = () => {
    const toast = useToast()
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    let history = useNavigate();

    const handleClick = () => { setShow(!show) }

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "talk-a-tive");
            data.append("cloud_name", "dns2pagvz")
            
            axios.post("https://api.cloudinary.com/v1_1/dns2pagvz/image/upload", data)
                .then((response) => {
                    console.log("Cloudinary response:", response);
                    setPic(response.data.url.toString());
                    setLoading(false);
                    toast({
                        title: "Image uploaded successfully!",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                })
                .catch((error) => {
                    console.log("Cloudinary error:", error);
                    setLoading(false);
                });


        } else {
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    };

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: 'Please Fill all the Fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: 'Password Do Not Match',
                status: 'warning',
                duration: 5000,
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
            const { data } = await axios.post("api/user", 
            { name, email, password, pic }, 
            config
            );
            toast({
                title: 'Registration Successful!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            localStorage.setItem('userInfo',JSON.stringify(data) );
            setLoading(false);
            history("/chats")

        } catch (error) {
            toast({
                title: 'Password Do Not Match',
                description: error.response.data.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    }

    return (
        <div>
            <VStack
                spacing={'5px'}
            >
                <FormControl id='first-name' isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                        placeholder='Enter Your Name'
                        onChange={(e) => { setName(e.target.value) }}
                    />
                </FormControl>
                <FormControl id='email' isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type='email'
                        placeholder='Enter Your Email'
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                </FormControl>
                <FormControl id='password' isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
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
                <FormControl id='password' isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder='Enter Confirm Password'
                            onChange={(e) => { setConfirmpassword(e.target.value) }}
                        />
                        <InputRightElement>
                            <Button size="sm" h={"1.75rem"} onClick={handleClick} >
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl id='pic'>
                    <FormLabel>Upload Your Picture</FormLabel>
                    <Input
                        type="file"
                        p={.5}
                        accept='image/*'
                        onChange={(e) => postDetails(e.target.files[0])}
                    />
                </FormControl>
                <Button
                    colorScheme='blue'
                    width={"100%"}
                    style={{ marginTop: 15 }}
                    onClick={submitHandler}
                    isLoading={loading}
                >
                    Singup</Button>
            </VStack>
        </div>
    )
}

export default Singup
