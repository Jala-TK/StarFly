import { Group } from '@prisma/client';
import CreateGroup from '@/components/group/CreateGroup';
import { GroupWithMessage } from '@/utils/types';

interface SidebarProps {
  groups: Group[];
  userGroups: GroupWithMessage[];
  selectedTab: 'all' | 'user' | 'create';
  setSelectedTab: (tab: 'all' | 'user' | 'create') => void;
  handleJoinGroup: (groupId: string) => Promise<void>;
  handleSelectGroup: (group: Group) => void;
  error: string | null;
  loading: boolean;
  checkDate: (date: Date | null) => string;
}

const Sidebar: React.FC<SidebarProps> = ({ groups, userGroups, selectedTab, setSelectedTab, handleJoinGroup, handleSelectGroup, error, loading, checkDate }) => {
  return (
    <div className="drawer-side z-10">
      <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
      <ul className="menu bg-base-200 min-h-full w-200 p-4">
        <div className="tabs tabs-boxed">
          <a className={`tab ${selectedTab === 'all' ? 'tab-active' : ''}`} onClick={() => setSelectedTab('all')}>Todos os Grupos</a>
          <a className={`tab ${selectedTab === 'user' ? 'tab-active' : ''}`} onClick={() => setSelectedTab('user')}>Meus Grupos</a>
          <a className={`tab ${selectedTab === 'create' ? 'tab-active' : ''}`} onClick={() => setSelectedTab('create')}>Criar Grupo</a>
        </div>
        {selectedTab === 'all' && (
          <div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {loading ? <p>Carregando salas...</p> : (
              <ul className='p-2'>
                {groups.map(group => (
                  <li key={group.id}>
                    <div className='flex justify-between' onClick={() => handleJoinGroup(group.id)}>
                      <div className='flex flex-col'>
                        <span className="font-semibold">{group.name}</span>
                      </div>
                      <div className='flex flex-col items-end'>
                        <span className="text-xs p-1">{checkDate(group.updatedAt)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {selectedTab === 'user' && (
          <div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {loading ? <p>Carregando salas...</p> : (
              <ul className='p-2'>
                {userGroups.map(group => (
                  <li key={group.id}>
                    <div className='flex justify-between' onClick={() => handleSelectGroup(group)}>
                      <div className='flex flex-col'>
                        <span className="font-semibold">{group.name}</span>
                        <span className="text-xs">{group.lastMessage?.content || ''}</span>
                      </div>
                      <div className='flex flex-col items-end'>
                        <span className="text-xs p-1">{checkDate(group.lastMessage?.createdAt || '')}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {selectedTab === 'create' && (
          <div>
            <CreateGroup />
          </div>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
