import { useState, useEffect, useCallback, useRef } from 'react';
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

  const cache = useRef({
    groups: [] as Group[],
    userGroups: [] as GroupWithMessage[],
  });

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [groupsData, userGroupsData] = await Promise.all([
        getAllGroups(),
        getUserGroups(),
      ]);

      setGroups(groupsData);
      setUserGroups(userGroupsData);

      cache.current.groups = groupsData;
      cache.current.userGroups = userGroupsData;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar grupos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewGroup = useCallback(async (groupName: string) => {
    try {
      const newGroup = await createGroup(groupName);
      setGroups((prevGroups) => [...prevGroups, newGroup]);

      cache.current.groups = [...cache.current.groups, newGroup];
    } catch (err: any) {
      setError(err.message || 'Erro ao criar grupo');
    }
  }, []);

  const joinGroupById = useCallback(async (groupId: string) => {
    try {
      await joinGroup(groupId);

      const updatedUserGroups = await getUserGroups();
      setUserGroups(updatedUserGroups);

      cache.current.userGroups = updatedUserGroups;
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar no grupo');
    }
  }, []);

  useEffect(() => {
    if (
      cache.current.groups.length === 0 ||
      cache.current.userGroups.length === 0
    ) {
      fetchGroups();
    } else {
      setGroups(cache.current.groups);
      setUserGroups(cache.current.userGroups);
    }
  }, [fetchGroups]);

  return { groups, userGroups, createNewGroup, joinGroupById, loading, error };
};
