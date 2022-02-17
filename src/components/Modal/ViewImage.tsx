import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="pGray.900" >
        <ModalBody display='flex' alignItems='cente' justifyContent='center' padding={0}>
          <Image
            src={imgUrl}
            minW={448}
          />
        </ModalBody>
        <ModalFooter flex='1' display='flex' justifyContent='flex-start'>
          <Link target='_blank' href={imgUrl}>
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
