import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchImages = async (param) => {
    const images = await api.get("/api/images", {
      params: {
        after: param.pageParam
      }
    });
  
    return images.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    fetchImages,
    {
      getNextPageParam: (lastPage) => lastPage.after,
    }
  );

  const formattedData = useMemo(() => {
    return data?.pages.map(p=>p.data).flat();
  }, [data]);

  if ( isLoading ) {
    return (
      <Loading />
    );
  };

  if ( isError ) {
    return (
      <Error />
    );
  };

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20} >
        <CardList cards={formattedData} />
        { hasNextPage && (
          <Button
            mt='6'
            alignSelf='start'
            onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? "Carregando..." : "Carregar mais" }
          </Button>
        )}
      </Box>
    </>
  );
}
