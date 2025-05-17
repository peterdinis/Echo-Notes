import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner"; 
import { createWorkspaceSchema } from "@/app/api/workspace/start/route";

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: CreateWorkspaceInput) => {
      const res = await fetch("/api/workspace/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.formErrors?.[0] || result.error || "Neznáma chyba");
      }

      return result.workspace;
    },

    onSuccess: (workspace) => {
      toast.success(`Workspace "${workspace.name}" bol vytvorený`);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};