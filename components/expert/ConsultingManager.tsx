// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   CalendarDays,
//   Plus,
//   Pencil,
//   Trash2,
//   Clock,
//   Search,
//   DollarSign,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { updateExpertAvailability } from "@/lib/actions/expert.action";
// import ConsultingCalendar from "./ConsultingCalendar";
// import { useToast } from "../ui/use-toast";

// interface ExpertAvailability {
//   _id: string;
//   expert: string;
//   date: string;
//   timeSlots: string[];
//   rate: number;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ConsultingSession {
//   _id: string;
//   expert: string;
//   client: {
//     _id: string;
//     name: string;
//     picture: string;
//   };
//   date: string;
//   timeSlot: string;
//   duration: number;
//   rate: number;
//   status: "scheduled" | "completed" | "cancelled";
//   topic: string;
//   notes: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ConsultingManagerProps {
//   mongoUserId: string;
//   initialAvailability: ExpertAvailability[];
//   initialSessions: ConsultingSession[];
// }

// const ConsultingManager = ({
//   mongoUserId,
//   initialAvailability,
//   initialSessions,
// }: ConsultingManagerProps) => {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [availability, setAvailability] =
//     useState<ExpertAvailability[]>(initialAvailability);
//   const [sessions, setSessions] =
//     useState<ConsultingSession[]>(initialSessions);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("availability");
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentAvailability, setCurrentAvailability] =
//     useState<ExpertAvailability | null>(null);

//   // Filter sessions based on search query
//   const filteredSessions = sessions.filter((session) => {
//     return (
//       session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       session.client.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   // Filter availability based on search query
//   const filteredAvailability = availability.filter((avail) => {
//     const dateStr = format(new Date(avail.date), "MMM d, yyyy");
//     return dateStr.toLowerCase().includes(searchQuery.toLowerCase());
//   });

//   const handleDeleteAvailability = async (availabilityId: string) => {
//     try {
//       // In a real app, you would have a dedicated delete endpoint
//       // For now, we'll update with empty time slots which effectively removes it
//       await updateExpertAvailability({
//         expertId: mongoUserId,
//         date: new Date(
//           availability.find((a) => a._id === availabilityId)?.date || ""
//         ),
//         timeSlots: [],
//         rate: 0,
//         path: "/expert-dashboard",
//       });

//       // Update local state
//       setAvailability(availability.filter((a) => a._id !== availabilityId));

//       toast({
//         title: "Availability deleted",
//         description: "The availability has been successfully removed.",
//       });
//     } catch (error) {
//       console.error("Error deleting availability:", error);
//       toast({
//         title: "Error",
//         description: "Failed to delete the availability. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleEdit = (avail: ExpertAvailability) => {
//     setCurrentAvailability(avail);
//     setIsEditing(true);
//   };

//   const handleCancelEdit = () => {
//     setCurrentAvailability(null);
//     setIsEditing(false);
//   };

//   const handleUpdateSuccess = (updatedAvailability: ExpertAvailability) => {
//     // Update local state
//     setAvailability(
//       availability.map((avail) =>
//         avail._id === updatedAvailability._id ? updatedAvailability : avail
//       )
//     );

//     setIsEditing(false);
//     setCurrentAvailability(null);

//     toast({
//       title: "Availability updated",
//       description: "Your availability has been successfully updated.",
//     });
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       scheduled: "bg-blue-500 text-white",
//       completed: "bg-green-500 text-white",
//       cancelled: "bg-red-500 text-white",
//     };

//     return colors[status] || "bg-gray-500 text-white";
//   };

//   if (isEditing && currentAvailability) {
//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold">Edit Availability</h2>
//           <Button variant="outline" onClick={handleCancelEdit}>
//             Cancel
//           </Button>
//         </div>
//         <ConsultingCalendar
//           mongoUserId={mongoUserId}
//           isEditing={true}
//           availabilityToEdit={currentAvailability}
//           onUpdateSuccess={handleUpdateSuccess}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold">Manage Consulting</h2>
//         <Button onClick={() => router.push("/expert-dashboard?tab=consulting")}>
//           <Plus className="mr-2 h-4 w-4" /> Add Availability
//         </Button>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4 items-center">
//         <div className="relative w-full md:max-w-md">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search..."
//             className="pl-10"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="w-full md:w-auto">
//             <TabsTrigger value="availability">Availability</TabsTrigger>
//             <TabsTrigger value="sessions">Sessions</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       {activeTab === "availability" && (
//         <>
//           {filteredAvailability.length === 0 ? (
//             <Card className="text-center p-8">
//               <CardContent>
//                 <div className="flex flex-col items-center justify-center py-8">
//                   <CalendarDays className="h-16 w-16 text-muted-foreground mb-4" />
//                   <h3 className="text-xl font-semibold mb-2">
//                     No availability found
//                   </h3>
//                   <p className="text-muted-foreground text-center max-w-md">
//                     {searchQuery
//                       ? "We couldn't find any availability matching your search criteria."
//                       : "You haven't set any availability yet."}
//                   </p>
//                   <Button
//                     className="mt-4"
//                     onClick={() =>
//                       router.push("/expert-dashboard?tab=consulting")
//                     }
//                   >
//                     <Plus className="mr-2 h-4 w-4" /> Add Availability
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid grid-cols-1 gap-4">
//               {filteredAvailability.map((avail) => (
//                 <Card key={avail._id} className="overflow-hidden">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-xl">
//                       {format(new Date(avail.date), "EEEE, MMMM d, yyyy")}
//                     </CardTitle>
//                     <CardDescription className="flex items-center gap-2 mt-2">
//                       <DollarSign className="h-4 w-4 text-green-500" />
//                       <span>${avail.rate}/hour</span>
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="pb-3">
//                     <div className="flex flex-wrap gap-2">
//                       {avail.timeSlots.map((slot, index) => (
//                         <Badge key={index} variant="secondary">
//                           {slot}
//                         </Badge>
//                       ))}
//                     </div>
//                     <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <Clock className="h-4 w-4" />
//                         <span>
//                           Added{" "}
//                           {formatDistanceToNow(new Date(avail.createdAt), {
//                             addSuffix: true,
//                           })}
//                         </span>
//                       </div>
//                     </div>
//                   </CardContent>
//                   <CardFooter className="flex justify-between pt-3 border-t">
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEdit(avail)}
//                       >
//                         <Pencil className="mr-2 h-4 w-4" /> Edit
//                       </Button>
//                     </div>
//                     <AlertDialog>
//                       <AlertDialogTrigger asChild>
//                         <Button variant="destructive" size="sm">
//                           <Trash2 className="mr-2 h-4 w-4" /> Delete
//                         </Button>
//                       </AlertDialogTrigger>
//                       <AlertDialogContent>
//                         <AlertDialogHeader>
//                           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                           <AlertDialogDescription>
//                             This action cannot be undone. This will permanently
//                             delete your availability for
//                             {format(new Date(avail.date), " MMMM d, yyyy")}.
//                           </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                           <AlertDialogCancel>Cancel</AlertDialogCancel>
//                           <AlertDialogAction
//                             onClick={() => handleDeleteAvailability(avail._id)}
//                           >
//                             Delete
//                           </AlertDialogAction>
//                         </AlertDialogFooter>
//                       </AlertDialogContent>
//                     </AlertDialog>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {activeTab === "sessions" && (
//         <>
//           {filteredSessions.length === 0 ? (
//             <Card className="text-center p-8">
//               <CardContent>
//                 <div className="flex flex-col items-center justify-center py-8">
//                   <CalendarDays className="h-16 w-16 text-muted-foreground mb-4" />
//                   <h3 className="text-xl font-semibold mb-2">
//                     No sessions found
//                   </h3>
//                   <p className="text-muted-foreground text-center max-w-md">
//                     {searchQuery
//                       ? "We couldn't find any sessions matching your search criteria."
//                       : "You don't have any consulting sessions yet."}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid grid-cols-1 gap-4">
//               {filteredSessions.map((session) => (
//                 <Card key={session._id} className="overflow-hidden">
//                   <CardHeader className="pb-3">
//                     <div className="flex justify-between items-start">
//                       <Badge
//                         className={`border-none ${getStatusColor(
//                           session.status
//                         )}`}
//                       >
//                         {session.status.charAt(0).toUpperCase() +
//                           session.status.slice(1)}
//                       </Badge>
//                       <Badge variant="outline">
//                         {format(new Date(session.date), "MMM d, yyyy")} at{" "}
//                         {session.timeSlot}
//                       </Badge>
//                     </div>
//                     <CardTitle className="text-xl mt-2">
//                       {session.topic}
//                     </CardTitle>
//                     <CardDescription className="flex items-center gap-2 mt-2">
//                       <div className="flex items-center gap-2">
//                         <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
//                           {session.client.picture ? (
//                             <img
//                               src={session.client.picture || "/placeholder.svg"}
//                               alt={session.client.name}
//                               className="w-6 h-6 rounded-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
//                               {session.client.name.charAt(0)}
//                             </div>
//                           )}
//                         </div>
//                         <span>{session.client.name}</span>
//                       </div>
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="pb-3">
//                     <div className="flex items-center gap-4 text-sm">
//                       <div className="flex items-center gap-1">
//                         <Clock className="h-4 w-4 text-muted-foreground" />
//                         <span>{session.duration} minutes</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <DollarSign className="h-4 w-4 text-green-500" />
//                         <span>${session.rate}/hour</span>
//                       </div>
//                     </div>
//                     {session.notes && (
//                       <div className="mt-4 p-3 bg-muted rounded-md">
//                         <p className="text-sm">{session.notes}</p>
//                       </div>
//                     )}
//                   </CardContent>
//                   <CardFooter className="flex justify-between pt-3 border-t">
//                     <div className="text-sm text-muted-foreground">
//                       Booked{" "}
//                       {formatDistanceToNow(new Date(session.createdAt), {
//                         addSuffix: true,
//                       })}
//                     </div>
//                     {session.status === "scheduled" && (
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm">
//                           <CalendarDays className="mr-2 h-4 w-4" /> Join Session
//                         </Button>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button variant="destructive" size="sm">
//                               <Trash2 className="mr-2 h-4 w-4" /> Cancel
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 This will cancel your scheduled session with{" "}
//                                 {session.client.name}. The client will be
//                                 notified of the cancellation.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Go Back</AlertDialogCancel>
//                               <AlertDialogAction>
//                                 Cancel Session
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     )}
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ConsultingManager;
