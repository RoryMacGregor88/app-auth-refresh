import { ServerError } from '~/types';

interface Props {
  error: ServerError;
}

export const ErrorWell = ({ error }: Props) => (
  <div
    style={{
      padding: '5rem',
      borderRadius: '5px',
      color: 'green',
    }}
  >
    <p>{error.message}</p>
  </div>
);
