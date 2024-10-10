'use client';
import { useState } from 'react';
import { useGroups } from '@/hooks/useGroups';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');

  const { createNewGroup, loading, error } = useGroups();

  const handleSubmit = async () => {
    if (groupName && groupName.length > 0) {
      await createNewGroup(groupName);
      setGroupName('');
    }
  };

  return (
    <ul className='p-2'>
      <li>
        <div className='flex justify-between flex-col'>
          <span className="text-3xl"
          >Crie seu grupo</span>
          <input
            type="text"
            placeholder="Digite o nome do grupo"
            className="input input-bordered w-full"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || groupName.length == 0}>
            {loading ? 'Carregando...' : 'Criar Grupo'}
          </button>
        </div>
      </li>
    </ul>
  );
};

export default CreateGroup;
