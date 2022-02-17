import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
    getValues
  } = useForm();
  const { errors } = formState;

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: v =>
        v[0].size < 10485760 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: v =>
        /image\/(jpeg|png|gif)/.test(v[0].type) ||
        'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    () => api.post('/api/images', {
      url: imageUrl,
      title: getValues().title,
      description: getValues().description
    }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('images');
      }
    }
  );

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if ( !imageUrl ) {
        toast({
          position: 'top-left',
          title: 'Imagem inválida',
          description: 'É necessário passar uma imagem para continuar!',
          status: 'error',
          isClosable: true,
          duration: 3000
        });

        return;
      };
        
      await mutation.mutateAsync();

      toast({
        position: 'top-left',
        title: 'Sucesso',
        description: 'Imagem cadastrada com sucesso!',
        status: 'success',
        isClosable: true,
        duration: 3000
      });
    } catch {
      toast({
        position: 'top-left',
        title: 'Erro no cadastro',
        description: 'Erro ao tentar cadastrar a imagem',
        status: 'error',
        isClosable: true,
        duration: 3000
      });
    } finally {
      reset();
      setLocalImageUrl("");
      setImageUrl("");
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
