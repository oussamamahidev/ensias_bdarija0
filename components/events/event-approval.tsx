/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Check,
  X,
  Calendar,
  MapPin,
  Globe,
  Users,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getPendingEvents,
  updateEventStatus,
} from "@/lib/actions/expert.action";

export default function EventApproval() {
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingEvent, setProcessingEvent] = useState<string | null>(null);
  const router = useRouter();

  // Fetch pending events
  const fetchPendingEvents = async () => {
    setLoading(true);
    try {
      const result = await getPendingEvents({});
      setPendingEvents(result.events);
    } catch (error) {
      console.error("Error fetching pending events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle event approval
  const handleApprove = async (eventId: string) => {
    setProcessingEvent(eventId);
    try {
      await updateEventStatus(eventId, "approved", "/expert/events");
      setPendingEvents(pendingEvents.filter((event) => event._id !== eventId));
      router.refresh();
    } catch (error) {
      console.error("Error approving event:", error);
    } finally {
      setProcessingEvent(null);
    }
  };

  // Handle event rejection
  const handleReject = async (eventId: string) => {
    setProcessingEvent(eventId);
    try {
      await updateEventStatus(eventId, "rejected", "/expert/events");
      setPendingEvents(pendingEvents.filter((event) => event._id !== eventId));
      router.refresh();
    } catch (error) {
      console.error("Error rejecting event:", error);
    } finally {
      setProcessingEvent(null);
    }
  };

  // Load pending events on component mount
  useState(() => {
    fetchPendingEvents();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pendingEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Approval</CardTitle>
          <CardDescription>Review and approve submitted events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">No pending events</h3>
            <p className="text-muted-foreground mt-2">
              All submitted events have been reviewed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Approval</CardTitle>
        <CardDescription>Review and approve submitted events</CardDescription>
      </CardHeader>

      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {pendingEvents.map((event) => (
            <AccordionItem key={event._id} value={event._id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start text-left">
                  <Badge className="mb-1">{event.eventType}</Badge>
                  <h3 className="text-lg font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Submitted by {event.submitter.name} on{" "}
                    {format(new Date(event.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(event.startDate), "MMMM d, yyyy")}
                        {event.endDate !== event.startDate &&
                          ` - ${format(
                            new Date(event.endDate),
                            "MMMM d, yyyy"
                          )}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {event.isVirtual ? (
                        <>
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>Virtual Event ({event.location})</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.location}, {event.country}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Organized by {event.organizer}</span>
                    </div>

                    {event.website && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={event.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {event.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>

                  {event.technologies.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-medium mb-2">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.technologies.map((tech: string) => (
                            <Badge key={tech} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Submitted by</h3>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={event.submitter.picture || "/placeholder.svg"}
                          alt={event.submitter.name}
                        />
                        <AvatarFallback>
                          {event.submitter.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{event.submitter.name}</p>
                        <p className="text-sm text-muted-foreground">
                          @{event.submitter.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-2">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleReject(event._id)}
                      disabled={processingEvent === event._id}
                    >
                      {processingEvent === event._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Reject
                    </Button>

                    <Button
                      className="flex items-center gap-2"
                      onClick={() => handleApprove(event._id)}
                      disabled={processingEvent === event._id}
                    >
                      {processingEvent === event._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
