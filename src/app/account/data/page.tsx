import { DeleteAccount } from "@/components/account/data/delete-account";
  
  export default function DataPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-semibold tracking-tight">Data</h2>
                <p className="text-muted-foreground">
                    Manage your account data.
                </p>
            </div>
            <DeleteAccount />
        </div>
    );
  } 