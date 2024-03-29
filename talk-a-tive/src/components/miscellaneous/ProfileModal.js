import React from 'react'
import {
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    Image,
    Text,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ModeState } from '../../Context/ModeProvider';
const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {mode} =ModeState();
    return (
        <>
            {
                children ? <span onClick={onOpen} >{children}</span> : (
                    <IconButton
                        display={{ base: "flex" }}
                        icon={<ViewIcon />}
                        onClick={onOpen} 
                    ></IconButton>
                )
            }
            <Modal  size={"lg"}  isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent backgroundColor={mode === "light" ? "white" : "#3f3f3f"}
        color={mode === "light" ? "black" : "white"} height={"410px"} >
                    <ModalHeader 
                        fontSize={"40px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody 
                    display={"flex"}
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    >
                        <Image
                        borderRadius={"full"}
                        boxSize={"150px"}
                        objectFit='cover'
                        src={user.pic}
                        alt={user.name}
                        >
                        </Image>
                        <Text
                            fontSize={{base:"28px", md:"30px"}}
                            fontFamily={"Work sans"}
                        >
                            {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default ProfileModal
