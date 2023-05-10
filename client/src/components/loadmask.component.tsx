import { FC, ReactElement } from 'react';

import { LOADING_MESSAGE } from '~/api/api.constants';

interface Props {
  message?: string;
}

export const Loadmask: FC<Props> = ({ message }): ReactElement => (
  <div className="flex h-full w-full items-center justify-center bg-black p-8 opacity-50">
    <h1>{message ?? LOADING_MESSAGE}</h1>
  </div>
);
