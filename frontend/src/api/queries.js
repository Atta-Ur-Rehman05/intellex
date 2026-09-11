import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../../api/services.js';
import { chatApi } from '../../api/services.js';
import { dashboardApi } from '../../api/services.js';

/* ============ QUERY KEYS ============ */
export const documentKeys = {
  all: ['documents'],
  list: () => [...documentKeys.all, 'list'],
  detail: (id) => [...documentKeys.all, 'detail', id],
};

export const conversationKeys = {
  all: ['conversations'],
  list: () => [...conversationKeys.all, 'list'],
  detail: (id) => [...conversationKeys.all, 'detail', id],
};

export const dashboardKeys = {
  all: ['dashboard'],
  detail: () => [...dashboardKeys.all, 'detail'],
};

/* ============ DOCUMENTS ============ */
export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.list(),
    queryFn: documentsApi.list,
    staleTime: 30_000,
  });
}

export function useDocument(id) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentsApi.get(id),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export function useUploadDocument(onSuccess) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }) => documentsApi.upload(file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      onSuccess?.();
    },
  });
}

export function useRenameDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }) => documentsApi.rename(id, name),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(updated.id) });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => documentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
}

/* ============ CONVERSATIONS ============ */
export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: chatApi.listConversations,
    staleTime: 30_000,
  });
}

export function useConversation(id) {
  return useQuery({
    queryKey: conversationKeys.detail(id),
    queryFn: () => chatApi.getConversation(id),
    enabled: !!id,
    staleTime: 10_000,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, documentIds }) => chatApi.createConversation(title, documentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
    },
  });
}

export function useSendMessage(conversationId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content) => chatApi.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => chatApi.removeConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
    },
  });
}

/* ============ DASHBOARD ============ */
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.detail(),
    queryFn: dashboardApi.get,
    staleTime: 60_000,
  });
}
