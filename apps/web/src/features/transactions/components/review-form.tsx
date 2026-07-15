'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { Button, Select, Textarea } from '../../../shared/components';
import { reviewsClient } from '../../reviews/api/reviews-client';
import {
  reviewFormSchema,
  type ParsedReviewFormValues,
  type ReviewFormValues,
} from '../../reviews/model/review-schemas';
import type { TransactionSummary, TransactionUser } from '../model/transaction-types';

type ReviewFormProps = {
  accessToken: string;
  reviewee: TransactionUser;
  transaction: TransactionSummary;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo enviar la valoracion.';
}

export function ReviewForm({ accessToken, reviewee, transaction }: ReviewFormProps) {
  const queryClient = useQueryClient();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ReviewFormValues>({
    defaultValues: {
      comment: '',
      rating: 5,
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (values: ParsedReviewFormValues) =>
      reviewsClient.create(
        {
          comment: values.comment || null,
          rating: values.rating,
          transactionId: transaction.id,
        },
        accessToken,
      ),
    onSuccess: async (review) => {
      reset({ comment: '', rating: 5 });
      await queryClient.invalidateQueries({ queryKey: ['reviews'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      await queryClient.invalidateQueries({
        queryKey: ['users', 'profile', review.reviewee.username],
      });
    },
  });

  return (
    <form
      className="review-form"
      onSubmit={(event) => {
        void handleSubmit((values) => {
          const parsed = reviewFormSchema.safeParse(values);

          if (!parsed.success) {
            parsed.error.issues.forEach((issue) => {
              const fieldName = issue.path[0];

              if (fieldName === 'rating' || fieldName === 'comment') {
                setError(fieldName, { message: issue.message, type: 'manual' });
              }
            });

            return Promise.resolve();
          }

          return reviewMutation.mutateAsync(parsed.data);
        })(event);
      }}
    >
      <Select
        error={errors.rating?.message}
        id={`review-rating-${transaction.id}`}
        label={`Puntuacion para ${reviewee.displayName}`}
        {...register('rating')}
      >
        <option value="5">5 estrellas</option>
        <option value="4">4 estrellas</option>
        <option value="3">3 estrellas</option>
        <option value="2">2 estrellas</option>
        <option value="1">1 estrella</option>
      </Select>
      <Textarea
        error={errors.comment?.message}
        hint="Opcional. Maximo 600 caracteres."
        id={`review-comment-${transaction.id}`}
        label="Comentario"
        rows={3}
        {...register('comment')}
      />

      {reviewMutation.isError ? (
        <p className="auth-error" role="alert">
          {getErrorMessage(reviewMutation.error)}
        </p>
      ) : null}

      {reviewMutation.data ? (
        <p className="listing-form-success" aria-live="polite">
          Valoracion enviada a {reviewMutation.data.reviewee.displayName}.
        </p>
      ) : null}

      <Button disabled={isSubmitting || reviewMutation.isPending} size="sm" type="submit">
        {reviewMutation.isPending ? 'Enviando valoracion' : 'Enviar valoracion'}
      </Button>
    </form>
  );
}
