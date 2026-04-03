import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FashionDesignSubmission, SubmissionStatus } from "../backend";
import { useActor } from "./useActor";

export function useGetAllSubmissions() {
  const { actor, isFetching } = useActor();
  return useQuery<FashionDesignSubmission[]>({
    queryKey: ["submissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminGetAllSubmissions() {
  const { actor, isFetching } = useActor();
  return useQuery<FashionDesignSubmission[]>({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUnpaidSelected() {
  const { actor, isFetching } = useActor();
  return useQuery<FashionDesignSubmission[]>({
    queryKey: ["unpaid-selected"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUnpaidSelectedDesigns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["is-admin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSubmissionCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["submission-count"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getSubmissionCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitDesign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (submission: FashionDesignSubmission) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitDesign(submission);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submission-count"] });
    },
  });
}

export function useUpdateSubmissionStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: string; status: SubmissionStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSubmissionStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["unpaid-selected"] });
    },
  });
}

export function useMarkDesignAsPaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markDesignAsPaid(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["unpaid-selected"] });
    },
  });
}
