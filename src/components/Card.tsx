import {
  Box,
  Heading,
  Text,
  Image,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { useState } from 'react';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
}

interface CardProps {
  data: Card;
  viewImage: (url: string) => void;
}

export function Card({ data, viewImage }: CardProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Box w='300px' key={data.ts} borderRadius="md" bgColor="pGray.800">
      <Skeleton isLoaded={!isLoading}>
        <Image
          src={data.url}
          alt={data.title}
          w="300px"
          h="180px"
          objectFit='cover'
          borderTopRadius="md"
          onClick={() => viewImage("https://github.com/George-b1t.png")}
          onLoad={() => setIsLoading(false)}
          cursor="pointer"
        />
      </Skeleton>

      <Box pt={5} pb={4} px={6}>
        {isLoading ? (
          <>
            <SkeletonText fontSize="2xl" mt={2.5} noOfLines={1} />
            <SkeletonText fontSize="md" mt={8} mb={1} noOfLines={1} />
          </>
        ) : (
          <>
            <Heading fontSize="2xl">{data.title}</Heading>
            <Text mt={2.5} fontSize="md">
              {data.description}
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
}
