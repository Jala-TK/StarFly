import { useState, useEffect } from 'react';
import {
  createGroup,
  getAllGroups,
  joinGroup,
  getUserGroups,
} from '@/services/groupService';
import { Group } from '@prisma/client';
import { GroupWithMessage, UseGroupsReturn } from '@/utils/types';

export const useGroups = (): UseGroupsReturn => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<GroupWithMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const groupsData = await getAllGroups();
      const userGroupsData = await getUserGroups();
      setGroups(groupsData);
      setUserGroups(userGroupsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewGroup = async (groupName: string) => {
    try {
      const newGroup = await createGroup(groupName);
      setGroups((prevGroups) => [...prevGroups, newGroup]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const joinGroupById = async (groupId: string) => {
    try {
      await joinGroup(groupId);
      fetchGroups(); // Atualiza as salas após o usuário entrar em uma nova sala
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, userGroups, createNewGroup, joinGroupById, loading, error };
};
