import { cookies } from 'next/headers';

export async function getUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) return null;

  return {
    id: 'usr_1',
    email: 'demo@example.com',
    name: 'Demo User',
    avatar_url: 'https://picsum.photos/seed/demo/200/200',
    refresh_token: 'mock_token'
  };
}

export async function getWorkspace(userId: string) {
  return { id: 'ws_1', user_id: userId, name: 'Demo Workspace' };
}

export async function getProperties(workspaceId: string) {
  return [
    { id: 'prop_1', workspace_id: workspaceId, ga4_property_id: '111', name: 'Acme Corp', url: 'acme.com', is_active: 1 },
    { id: 'prop_2', workspace_id: workspaceId, ga4_property_id: '222', name: 'SaaS Platform', url: 'app.saas.com', is_active: 1 },
    { id: 'prop_3', workspace_id: workspaceId, ga4_property_id: '333', name: 'Marketing Site', url: 'marketing.io', is_active: 1 },
  ];
}
