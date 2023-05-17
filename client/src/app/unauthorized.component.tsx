import { FC, ReactElement } from 'react';

import { useNavigate } from 'react-router-dom';

export const Unauthorized: FC = (): ReactElement => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <section>
      <h1>Unauthorized</h1>

      <br />

      <p>You do not have access to the requested page.</p>

      <div className="grow p-4">
        <button className="cursor-pointer rounded-md border-2 border-white bg-green-500 p-2" onClick={goBack}>
          Go Back
        </button>
      </div>
    </section>
  );
};
