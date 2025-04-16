// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ArrowLeft, Clock, Code, Play, Tag, User } from "lucide-react"
// import Link from "next/link"
// import { formatDistanceToNow } from "date-fns"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"

// interface CodeChallengeDetailProps {
//   challenge: {
//     _id: string
//     title: string
//     description: string
//     difficulty: "beginner" | "intermediate" | "advanced" | "expert"
//     tags: string[]
//     starterCode: string
//     testCases: {
//       input: string
//       expectedOutput: string
//     }[]
//     submissions: string[]
//     published: boolean
//     createdAt: string
//     updatedAt: string
//     slug: string
//     author: {
//       name: string
//       picture?: string
//     }
//   }
//   currentUserId?: string
// }

// export default function CodeChallengeDetail({ challenge, currentUserId }: CodeChallengeDetailProps) {
//   const [userCode, setUserCode] = useState(challenge.starterCode)
//   const [isRunning, setIsRunning] = useState(false)
//   const [testResults, setTestResults] = useState<
//     { passed: boolean; input: string; expected: string; actual: string }[]
//   >([])
//   const [activeTab, setActiveTab] = useState("challenge")
//   const { toast } = useToast()

//   // Get difficulty badge color
//   const getDifficultyColor = (difficulty: string) => {
//     const colors: Record<string, string> = {
//       beginner: "bg-green-500 text-white",
//       intermediate: "bg-blue-500 text-white",
//       advanced: "bg-orange-500 text-white",
//       expert: "bg-red-500 text-white",
//     }

//     return colors[difficulty] || "bg-gray-500 text-white"
//   }

//   const runTests = () => {
//     setIsRunning(true)

//     // This is a simplified simulation of running tests
//     // In a real app, you would evaluate the code against test cases
//     setTimeout(() => {
//       try {
//         // Simulate test results
//         const results = challenge.testCases.map((testCase, index) => {
//           // Simulate some tests passing and some failing
//           const passed = index % 2 === 0
//           return {
//             passed,
//             input: testCase.input,
//             expected: testCase.expectedOutput,
//             actual: passed ? testCase.expectedOutput : "Different result",
//           }
//         })

//         setTestResults(results)

//         const passedCount = results.filter((r) => r.passed).length

//         toast({
//           title: `${passedCount}/${results.length} tests passed`,
//           description:
//             passedCount === results.length
//               ? "Congratulations! All tests passed."
//               : "Some tests failed. Check the results tab for details.",
//           variant: passedCount === results.length ? "default" : "destructive",
//         })

//         if (passedCount === results.length) {
//           setActiveTab("results")
//         }
//       } catch (error) {
//         toast({
//           title: "Error running tests",
//           description: "There was an error evaluating your code.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsRunning(false)
//       }
//     }, 1500)
//   }

//   const submitSolution = () => {
//     // Here you would implement the logic to submit the solution
//     toast({
//       title: "Solution submitted",
//       description: "Your solution has been submitted successfully.",
//     })
//   }

//   return (
//     <div className="container mx-auto py-8 max-w-6xl">
//       <div className="mb-8">
//         <Button variant="ghost" asChild className="mb-4">
//           <Link href="/code-challenges" className="flex items-center gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Back to Code Challenges
//           </Link>
//         </Button>

//         <div className="flex flex-wrap items-center gap-2 mb-4">
//           <Badge className={`border-none ${getDifficultyColor(challenge.difficulty)}`}>
//             {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
//           </Badge>

//           {challenge.tags.map((tag, index) => (
//             <Badge key={index} variant="secondary" className="flex items-center gap-1">
//               <Tag className="h-3 w-3" />
//               {tag}
//             </Badge>
//           ))}
//         </div>

//         <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>

//         <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
//               {challenge.author.picture ? (
//                 <img
//                   src={challenge.author.picture || "/placeholder.svg"}
//                   alt={challenge.author.name}
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//               ) : (
//                 <User className="h-5 w-5 text-primary-500" />
//               )}
//             </div>
//             <span>{challenge.author.name}</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <Clock className="h-4 w-4" />
//             <span>
//               {formatDistanceToNow(new Date(challenge.createdAt), {
//                 addSuffix: true,
//               })}
//             </span>
//           </div>

//           <div className="flex items-center gap-2">
//             <Code className="h-4 w-4" />
//             <span>{challenge.submissions?.length || 0} submissions</span>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Challenge Description</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="prose dark:prose-invert max-w-none">
//               <p>{challenge.description}</p>
//             </div>

//             <div className="mt-6">
//               <h3 className="font-semibold mb-2">Example Test Cases:</h3>
//               <div className="space-y-4">
//                 {challenge.testCases.slice(0, 2).map((testCase, index) => (
//                   <div key={index} className="bg-muted p-4 rounded-md">
//                     <div className="mb-2">
//                       <span className="font-semibold">Input:</span>
//                       <pre className="mt-1 bg-background p-2 rounded text-sm overflow-x-auto">{testCase.input}</pre>
//                     </div>
//                     <div>
//                       <span className="font-semibold">Expected Output:</span>
//                       <pre className="mt-1 bg-background p-2 rounded text-sm overflow-x-auto">
//                         {testCase.expectedOutput}
//                       </pre>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="space-y-4">
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="grid grid-cols-3">
//               <TabsTrigger value="challenge">Challenge</TabsTrigger>
//               <TabsTrigger value="solution">Solution</TabsTrigger>
//               <TabsTrigger value="results">Results</TabsTrigger>
//             </TabsList>

//             <TabsContent value="challenge" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Your Solution</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <Textarea
//                     className="font-mono min-h-[300px]"
//                     value={userCode}
//                     onChange={(e) => setUserCode(e.target.value)}
//                   />
//                 </CardContent>
//               </Card>

//               <div className="flex justify-end gap-2">
//                 <Button variant="outline" onClick={runTests} disabled={isRunning}>
//                   {isRunning ? (
//                     <>
//                       <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-current animate-spin mr-2"></div>
//                       Running Tests...
//                     </>
//                   ) : (
//                     <>
//                       <Play className="mr-2 h-4 w-4" />
//                       Run Tests
//                     </>
//                   )}
//                 </Button>
//                 <Button onClick={submitSolution}>Submit Solution</Button>
//               </div>
//             </TabsContent>

//             <TabsContent value="solution">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Solution</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="bg-muted p-4 rounded-md">
//                     <p className="text-center text-muted-foreground">
//                       Solutions are available after you successfully complete the challenge or after 3 attempts.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="results">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Test Results</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {testResults.length > 0 ? (
//                     <div className="space-y-4">
//                       {testResults.map((result, index) => (
//                         <div
//                           key={index}
//                           className={`p-4 rounded-md ${result.passed ? "bg-green-500/10" : "bg-red-500/10"}`}
//                         >
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="font-semibold">Test Case {index + 1}</span>
//                             <Badge variant={result.passed ? "default" : "destructive"}>
//                               {result.passed ? "Passed" : "Failed"}
//                             </Badge>
//                           </div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-sm font-medium mb-1">Input:</p>
//                               <pre className="bg-background p-2 rounded text-sm overflow-x-auto">{result.input}</pre>
//                             </div>
//                             <div>
//                               <p className="text-sm font-medium mb-1">Expected Output:</p>
//                               <pre className="bg-background p-2 rounded text-sm overflow-x-auto">{result.expected}</pre>

//                               {!result.passed && (
//                                 <>
//                                   <p className="text-sm font-medium mb-1 mt-2">Your Output:</p>
//                                   <pre className="bg-background p-2 rounded text-sm overflow-x-auto">
//                                     {result.actual}
//                                   </pre>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center text-muted-foreground py-8">
//                       <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>Run your code to see test results</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }
