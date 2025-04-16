"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CalendarDays, Clock, DollarSign, Loader2, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { updateExpertAvailability } from "@/lib/actions/expert.action";
import { useToast } from "../ui/use-toast";

interface ConsultingCalendarProps {
  mongoUserId: string;
}

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const ConsultingCalendar = ({ mongoUserId }: ConsultingCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [rate, setRate] = useState("");
  const [expertise, setExpertise] = useState<string[]>([
    "React",
    "Next.js",
    "TypeScript",
  ]);
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const toggleTimeSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSave = async () => {
    if (!date || selectedSlots.length === 0 || !rate) {
      setError(
        "Please select a date, at least one time slot, and set your hourly rate."
      );
      return;
    }

    if (!mongoUserId) {
      setError(
        "User authentication error. Please try logging out and back in."
      );
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await updateExpertAvailability({
        expertId: mongoUserId,
        date: date,
        timeSlots: selectedSlots,
        rate: Number(rate),
        path: "/expert",
      });

      toast({
        title: "Availability updated!",
        description: "Your consulting calendar has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating availability:", error);
      setError("Failed to update availability. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="border-2 border-primary-500/20">
        <CardHeader className="bg-primary-500/5">
          <CardTitle className="text-2xl flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary-500" />
            Consulting Calendar
          </CardTitle>
          <CardDescription>
            Manage your availability for paid consulting sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-medium mb-2 block">
                  Select Available Dates
                </Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  disabled={(date) =>
                    date < new Date() ||
                    date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  }
                />
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">Your Expertise</Label>
                <div className="flex flex-wrap gap-2">
                  {expertise.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  Available Time Slots
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={
                        selectedSlots.includes(slot) ? "default" : "outline"
                      }
                      className="flex items-center gap-2"
                      onClick={() => toggleTimeSlot(slot)}
                    >
                      <Clock className="h-4 w-4" />
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate" className="text-lg font-medium">
                  Hourly Rate (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="rate"
                    type="number"
                    placeholder="100"
                    className="pl-10"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-medium">
                  Session Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what clients can expect from your consulting sessions..."
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {selectedSlots.length} time slots selected for{" "}
              {date?.toLocaleDateString()}
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Availability
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConsultingCalendar;
