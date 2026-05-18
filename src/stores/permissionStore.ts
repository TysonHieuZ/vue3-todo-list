import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export type PermissionKey = 'admin' | 'editor' | 'viewer';

interface PermissionRule {
  label: string;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewDetail: boolean;
}

const permissionRules: Record<PermissionKey, PermissionRule> = {
  admin: {
    label: 'Admin',
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canViewDetail: true
  },
  editor: {
    label: 'Editor',
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canViewDetail: true
  },
  viewer: {
    label: 'Viewer',
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canViewDetail: true
  }
};

export const usePermissionStore = defineStore('permission', () => {
  const currentKey = ref<PermissionKey>('admin');

  const currentPermission = computed(() => permissionRules[currentKey.value]);
  const permissionOptions = computed(() =>
    Object.entries(permissionRules).map(([key, rule]) => ({
      key: key as PermissionKey,
      label: rule.label
    }))
  );

  const setPermission = (key: PermissionKey) => {
    currentKey.value = key;
  };

  return {
    currentKey,
    currentPermission,
    permissionOptions,
    setPermission
  };
});
