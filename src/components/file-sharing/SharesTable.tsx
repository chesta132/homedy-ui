import { MoreHorizontal, Pencil, Trash2, EyeOff, Eye, Lock, Unlock, FolderX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Share, Shares } from "@/models/samba";

interface SharesTableProps {
  shares: Shares;
  onEdit: (name: string, share: Share) => void;
  onDelete: (name: string) => void;
}

/**
 * Desktop table listing all configured SMB shares.
 */
export function SharesTable({ shares, onEdit, onDelete }: SharesTableProps) {
  const entries = Object.entries(shares);

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-12 text-center flex flex-col justify-center items-center">
        <FolderX className="text-muted-strong size-15" />
        <p className="text-sm text-muted">No shares configured yet</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Path</TableHead>
          <TableHead>Flags</TableHead>
          <TableHead>Valid Users</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map(([name, share]) => (
          <TableRow key={name}>
            <TableCell className="font-medium text-fg">{name}</TableCell>
            <TableCell className="font-mono text-xs text-[#666666]">{share.path}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {share.readOnly === "yes" ? (
                  <Badge variant="outline" className="gap-1 text-2xs">
                    <Lock className="h-2.5 w-2.5" /> Read-only
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-2xs">
                    <Unlock className="h-2.5 w-2.5" /> Writable
                  </Badge>
                )}
                {share.browsable === "yes" ? (
                  <Badge variant="outline" className="gap-1 text-2xs">
                    <Eye className="h-2.5 w-2.5" /> Browsable
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-2xs opacity-50">
                    <EyeOff className="h-2.5 w-2.5" /> Hidden
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-xs text-[#666666]">
              {share.validUsers?.length > 0 ? share.validUsers.join(", ") : <span className="text-muted-strong">—</span>}
            </TableCell>
            <TableCell className="font-mono text-xs text-dim">{share.permissions?.join("") ?? "—"}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(name, share)}>
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(name)} className="text-red-400 focus:bg-red-950/30 focus:text-red-400">
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * Mobile card list — shown below md breakpoint.
 */
export function SharesCardList({ shares, onEdit, onDelete }: SharesTableProps) {
  const entries = Object.entries(shares);

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-10 text-center">
        <p className="text-sm text-muted">No shares configured yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map(([name, share]) => (
        <div key={name} className="rounded-lg border border-border bg-[#0f0f0f] p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-fg">{name}</p>
              <p className="mt-0.5 font-mono text-xs text-dim truncate">{share.path}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(name, share)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(name)} className="text-red-400 focus:bg-red-950/30 focus:text-red-400">
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {share.readOnly === "yes" ? (
              <Badge variant="outline" className="text-2xs">
                Read-only
              </Badge>
            ) : (
              <Badge variant="outline" className="text-2xs">
                Writable
              </Badge>
            )}
            {share.browsable === "yes" && (
              <Badge variant="outline" className="text-2xs">
                Browsable
              </Badge>
            )}
          </div>

          {share.validUsers?.length > 0 && <p className="mt-2 text-xs text-dim">Users: {share.validUsers.join(", ")}</p>}
          {share.permissions && <p className="mt-1 font-mono text-xs text-muted">Permissions: {share.permissions.join("")}</p>}
        </div>
      ))}
    </div>
  );
}
