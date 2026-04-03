import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileImage,
  RefreshCw,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type FashionDesignSubmission, SubmissionStatus } from "../backend";
import {
  useAdminGetAllSubmissions,
  useGetUnpaidSelected,
  useMarkDesignAsPaid,
  useUpdateSubmissionStatus,
} from "../hooks/useQueries";

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const map = {
    [SubmissionStatus.selected]: {
      label: "Selected",
      className: "bg-accent/20 text-accent-foreground border-accent/40",
    },
    [SubmissionStatus.pending]: {
      label: "Pending",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    [SubmissionStatus.rejected]: {
      label: "Rejected",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };
  const c = map[status];
  return (
    <Badge
      variant="outline"
      className={`text-[10px] tracking-widest uppercase ${c.className}`}
    >
      {c.label}
    </Badge>
  );
}

function SubmissionRow({
  submission,
  index,
  onUpdateStatus,
  onMarkPaid,
  isUpdating,
}: {
  submission: FashionDesignSubmission & { _id?: string };
  index: number;
  onUpdateStatus: (id: string, status: SubmissionStatus) => void;
  onMarkPaid: (id: string) => void;
  isUpdating: boolean;
}) {
  const id = (submission as any)._id || String(index);
  const imageUrl = submission.image?.getDirectURL();
  const date = new Date(
    Number(submission.timestamp) / 1_000_000,
  ).toLocaleDateString();

  return (
    <TableRow data-ocid={`admin.row.${index + 1}`}>
      <TableCell className="py-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={submission.title}
            className="w-12 h-14 object-cover"
          />
        ) : (
          <div className="w-12 h-14 bg-muted flex items-center justify-center">
            <FileImage className="w-4 h-4 text-muted-foreground/30" />
          </div>
        )}
      </TableCell>
      <TableCell className="py-3">
        <div className="font-display font-semibold text-sm text-foreground">
          {submission.title}
        </div>
        <div className="text-xs text-muted-foreground font-body">
          {submission.artistName}
        </div>
        <div className="text-xs text-muted-foreground/60 font-body">
          {submission.email}
        </div>
      </TableCell>
      <TableCell className="py-3">
        <p className="text-xs text-muted-foreground font-body line-clamp-2 max-w-xs">
          {submission.description}
        </p>
      </TableCell>
      <TableCell className="py-3">
        <StatusBadge status={submission.status} />
        {submission.status === SubmissionStatus.selected && (
          <div className="mt-1">
            <Badge
              variant="outline"
              className={`text-[10px] tracking-widest uppercase ${
                submission.isPaid
                  ? "bg-accent/20 text-accent-foreground border-accent/40"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {submission.isPaid ? "Paid" : "Unpaid"}
            </Badge>
          </div>
        )}
      </TableCell>
      <TableCell className="py-3 text-xs text-muted-foreground font-body">
        {date}
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-1 flex-wrap">
          {submission.status !== SubmissionStatus.selected && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  className="h-7 text-[10px] tracking-widest uppercase rounded-none border-accent/30 text-accent-foreground hover:bg-accent/10"
                  data-ocid={`admin.edit_button.${index + 1}`}
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Select
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border rounded-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">
                    Select this design?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-body text-sm">
                    &ldquo;{submission.title}&rdquo; by {submission.artistName}{" "}
                    will be marked as selected for the BASSET collection.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="rounded-none font-body text-xs tracking-widest uppercase"
                    data-ocid="admin.cancel_button"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      onUpdateStatus(id, SubmissionStatus.selected)
                    }
                    className="rounded-none font-body text-xs tracking-widest uppercase bg-primary text-primary-foreground"
                    data-ocid="admin.confirm_button"
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {submission.status !== SubmissionStatus.rejected && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  className="h-7 text-[10px] tracking-widest uppercase rounded-none border-destructive/30 text-destructive hover:bg-destructive/10"
                  data-ocid={`admin.delete_button.${index + 1}`}
                >
                  <XCircle className="w-3 h-3 mr-1" /> Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border rounded-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">
                    Reject this design?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-body text-sm">
                    &ldquo;{submission.title}&rdquo; will be marked as not
                    selected.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="rounded-none font-body text-xs tracking-widest uppercase"
                    data-ocid="admin.cancel_button"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      onUpdateStatus(id, SubmissionStatus.rejected)
                    }
                    className="rounded-none font-body text-xs tracking-widest uppercase bg-destructive text-destructive-foreground"
                    data-ocid="admin.confirm_button"
                  >
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {submission.status === SubmissionStatus.selected &&
            !submission.isPaid && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkPaid(id)}
                disabled={isUpdating}
                className="h-7 text-[10px] tracking-widest uppercase rounded-none border-primary/30 text-primary hover:bg-primary/10"
                data-ocid={`admin.save_button.${index + 1}`}
              >
                <DollarSign className="w-3 h-3 mr-1" /> Mark Paid
              </Button>
            )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const {
    data: allSubmissions,
    isLoading: loadingAll,
    refetch: refetchAll,
  } = useAdminGetAllSubmissions();
  const {
    data: unpaidSelected,
    isLoading: loadingUnpaid,
    refetch: refetchUnpaid,
  } = useGetUnpaidSelected();
  const { mutateAsync: updateStatus, isPending: updatingStatus } =
    useUpdateSubmissionStatus();
  const { mutateAsync: markPaid, isPending: markingPaid } =
    useMarkDesignAsPaid();

  const isUpdating = updatingStatus || markingPaid;

  const handleUpdateStatus = async (id: string, status: SubmissionStatus) => {
    try {
      await updateStatus({ id, status });
      toast.success(
        `Design ${
          status === SubmissionStatus.selected ? "selected" : "rejected"
        } successfully.`,
      );
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await markPaid(id);
      toast.success("Design marked as paid.");
    } catch {
      toast.error("Failed to mark as paid.");
    }
  };

  const submissions = allSubmissions || [];
  const totalCount = submissions.length;
  const selectedCount = submissions.filter(
    (s) => s.status === SubmissionStatus.selected,
  ).length;
  const pendingCount = submissions.filter(
    (s) => s.status === SubmissionStatus.pending,
  ).length;
  const unpaidCount = unpaidSelected?.length || 0;

  return (
    <section className="py-16 sm:py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase text-primary block mb-3">
            Dashboard
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground">
              Admin{" "}
              <span className="font-italic-accent font-normal">Panel</span>
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchAll();
                refetchUnpaid();
              }}
              className="rounded-none font-body text-xs tracking-widest uppercase"
              data-ocid="admin.secondary_button"
            >
              <RefreshCw className="w-3 h-3 mr-2" /> Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Submissions", value: totalCount, icon: Users },
            { label: "Selected", value: selectedCount, icon: CheckCircle2 },
            { label: "Pending Review", value: pendingCount, icon: Clock },
            { label: "Awaiting Payment", value: unpaidCount, icon: DollarSign },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="bg-card border-border rounded-none"
                data-ocid={`admin.card.${i + 1}`}
              >
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-body tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {loadingAll ? (
                    <Skeleton className="h-8 w-12 rounded-none" />
                  ) : (
                    <span className="text-3xl font-display font-bold text-foreground">
                      {stat.value}
                    </span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Submissions Table */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="bg-muted border border-border rounded-none mb-6"
            data-ocid="admin.tab"
          >
            <TabsTrigger
              value="all"
              className="text-xs font-body tracking-widest uppercase rounded-none"
              data-ocid="admin.tab"
            >
              All ({totalCount})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="text-xs font-body tracking-widest uppercase rounded-none"
              data-ocid="admin.tab"
            >
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger
              value="selected"
              className="text-xs font-body tracking-widest uppercase rounded-none"
              data-ocid="admin.tab"
            >
              Selected ({selectedCount})
            </TabsTrigger>
            <TabsTrigger
              value="unpaid"
              className="text-xs font-body tracking-widest uppercase rounded-none"
              data-ocid="admin.tab"
            >
              Unpaid ({unpaidCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <SubmissionsTable
              submissions={submissions}
              isLoading={loadingAll}
              onUpdateStatus={handleUpdateStatus}
              onMarkPaid={handleMarkPaid}
              isUpdating={isUpdating}
            />
          </TabsContent>

          <TabsContent value="pending">
            <SubmissionsTable
              submissions={submissions.filter(
                (s) => s.status === SubmissionStatus.pending,
              )}
              isLoading={loadingAll}
              onUpdateStatus={handleUpdateStatus}
              onMarkPaid={handleMarkPaid}
              isUpdating={isUpdating}
            />
          </TabsContent>

          <TabsContent value="selected">
            <SubmissionsTable
              submissions={submissions.filter(
                (s) => s.status === SubmissionStatus.selected,
              )}
              isLoading={loadingAll}
              onUpdateStatus={handleUpdateStatus}
              onMarkPaid={handleMarkPaid}
              isUpdating={isUpdating}
            />
          </TabsContent>

          <TabsContent value="unpaid">
            <SubmissionsTable
              submissions={unpaidSelected || []}
              isLoading={loadingUnpaid}
              onUpdateStatus={handleUpdateStatus}
              onMarkPaid={handleMarkPaid}
              isUpdating={isUpdating}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function SubmissionsTable({
  submissions,
  isLoading,
  onUpdateStatus,
  onMarkPaid,
  isUpdating,
}: {
  submissions: Array<FashionDesignSubmission & { _id?: string }>;
  isLoading: boolean;
  onUpdateStatus: (id: string, status: SubmissionStatus) => void;
  onMarkPaid: (id: string) => void;
  isUpdating: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.loading_state">
        {["r1", "r2", "r3", "r4"].map((id) => (
          <Skeleton key={id} className="h-16 w-full rounded-none" />
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 border border-dashed border-border text-center"
        data-ocid="admin.empty_state"
      >
        <FileImage className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-body text-muted-foreground">
          No submissions in this category.
        </p>
      </div>
    );
  }

  return (
    <div
      className="border border-border overflow-hidden"
      data-ocid="admin.table"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-xs font-body tracking-widest uppercase text-muted-foreground w-16">
                Image
              </TableHead>
              <TableHead className="text-xs font-body tracking-widest uppercase text-muted-foreground">
                Design / Artist
              </TableHead>
              <TableHead className="text-xs font-body tracking-widest uppercase text-muted-foreground">
                Description
              </TableHead>
              <TableHead className="text-xs font-body tracking-widest uppercase text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs font-body tracking-widest uppercase text-muted-foreground">
                Date
              </TableHead>
              <TableHead className="text-xs font-body tracking-widest uppercase text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub, i) => (
              <SubmissionRow
                key={(sub as any)._id || i}
                submission={sub}
                index={i}
                onUpdateStatus={onUpdateStatus}
                onMarkPaid={onMarkPaid}
                isUpdating={isUpdating}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
