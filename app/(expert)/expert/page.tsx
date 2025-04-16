import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Code, FileText, Lightbulb, Users } from "lucide-react";
import KnowledgeBaseEditor from "@/components/expert/KnowledgeBaseEditor";
import CodeChallengeCreator from "@/components/expert/CodeChallengeCreator";
import ConsultingCalendar from "@/components/expert/ConsultingCalendar";

export default function ExpertDashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Expert Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your expert dashboard. Create and manage expert-only
          content and services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-500" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              12 articles published
            </p>
            <p className="text-2xl font-bold mt-2">1,240</p>
            <p className="text-xs text-muted-foreground">
              Total views this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" />
              Code Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              8 challenges created
            </p>
            <p className="text-2xl font-bold mt-2">356</p>
            <p className="text-xs text-muted-foreground">Total submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-green-500" />
              Consulting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">5 upcoming sessions</p>
            <p className="text-2xl font-bold mt-2">$720</p>
            <p className="text-xs text-muted-foreground">Revenue this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Community Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Expert since Jan 2023
            </p>
            <p className="text-2xl font-bold mt-2">4.9/5</p>
            <p className="text-xs text-muted-foreground">
              Average rating (42 reviews)
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="knowledge-base" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto mb-8">
          <TabsTrigger
            value="knowledge-base"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Code Challenges
          </TabsTrigger>
          <TabsTrigger value="consulting" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Consulting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge-base">
          <KnowledgeBaseEditor />
        </TabsContent>

        <TabsContent value="challenges">
          <CodeChallengeCreator />
        </TabsContent>

        <TabsContent value="consulting">
          <ConsultingCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
