import { Group } from '@prisma/client';
import { GroupWithMessage, JoinGroupResponse } from '@/utils/types';

const API_URL = '/api/groups';

export const createGroup = async (groupName: string): Promise<Group> => {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: groupName }),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar grupo');
    }
    const userData = await response.json();
    const newGroup = userData.group;

    return newGroup;
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
    throw error;
  }
};

export const getAllGroups = async (): Promise<Group[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Erro ao buscar grupos');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    throw error;
  }
};

export const getUserGroups = async (): Promise<GroupWithMessage[]> => {
  try {
    const response = await fetch(`${API_URL}/user`);
    if (!response.ok) {
      throw new Error('Erro ao buscar grupos do usuario');
    }
    const userData = await response.json();
    const groupsUser = userData.groups;
    return groupsUser;
  } catch (error) {
    console.error('Erro ao buscar grupos do usuario:', error);
    throw error;
  }
};

export const joinGroup = async (
  groupId: string
): Promise<JoinGroupResponse> => {
  try {
    const response = await fetch(`${API_URL}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao entrar no grupo');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao entrar no grupo:', error);
    throw error;
  }
};
