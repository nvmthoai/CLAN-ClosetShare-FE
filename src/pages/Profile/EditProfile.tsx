import Layout from "@/components/layout/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi, type UpdateMePayload } from "@/apis/user.api";
import type { User } from "@/models/User";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function EditProfile() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getMe(),
    select: (res) => res.data as User,
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateMePayload) => userApi.updateMe(payload),
    onSuccess: () => {
      toast.success("Updated profile");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => toast.error("Update failed"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload: UpdateMePayload = {
      name: (form.elements.namedItem("name") as HTMLInputElement)?.value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value,
      avatarUrl: (form.elements.namedItem("avatarUrl") as HTMLInputElement)
        ?.value,
    };
    mutation.mutate(payload);
  };

  return (
    <Layout>
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <Input name="name" defaultValue={data?.name || ""} />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <Input name="phone" defaultValue={data?.phone || ""} />
          </div>
          <div>
            <label className="block text-sm mb-1">Avatar URL</label>
            <Input name="avatarUrl" defaultValue={data?.avatarUrl || ""} />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
