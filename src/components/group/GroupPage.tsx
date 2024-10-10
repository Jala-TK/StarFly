'use client'
import { useState, useEffect } from 'react';
import { useGroups } from '@/hooks/useGroups';
import { Group } from '@prisma/client';
import ChatClient from '@/components/chat/ChatClient';
import Header from '@/components/group/Header';
import Sidebar from '@/components/group/Sidebar';

const GroupPageComponent: React.FC = () => {
  const { groups, userGroups, joinGroupById, loading, error } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedTab, setSelectedTab] = useState<'all' | 'user' | 'create'>('user');

  useEffect(() => {
    if (userGroups.length > 0 && !selectedGroup) {
      setSelectedGroup(userGroups[0]);
    }
  }, [userGroups, selectedGroup]);

  const handleJoinGroup = async (groupId: string) => {
    await joinGroupById(groupId);
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
  };

  return (
    <div className="drawer h-full">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-full">
        <Header selectedGroup={selectedGroup?.name || null} />
        <div className="flex-grow p-4">
          {selectedGroup ? <ChatClient groupId={selectedGroup.id} /> : <p>Selecione um grupo.</p>}
        </div>
      </div>
      <Sidebar
        groups={groups}
        userGroups={userGroups}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        handleJoinGroup={handleJoinGroup}
        handleSelectGroup={handleSelectGroup}
        error={error}
        loading={loading}
        checkDate={(date) => (date ? new Date(date).toLocaleDateString() : '')}
      />
    </div>
  );
};

export default GroupPageComponent;
