import { FC, ReactElement } from 'react';

type Status = 'error' | 'success';

interface Props {
  message: string;
  status?: Status;
}

export const Well: FC<Props> = ({ message, status = 'error' }): ReactElement => {
  const backgroundColor = `bg-${status}`;
  return (
    <div className={`${backgroundColor} border-r-4 p-5`}>
      <p>{message}</p>
    </div>
  );
};
