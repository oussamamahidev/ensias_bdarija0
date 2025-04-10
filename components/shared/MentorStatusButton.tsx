// // components/shared/MentorStatusButton.tsx
// "use client";

// import { useUser } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function MentorStatusButton() {
//   const { user, isLoaded } = useUser();

//   if (!isLoaded) return null;

//   const isMentor = user?.publicMetadata?.isMentor === true;
//   const isMentorPending = user?.publicMetadata?.isMentorPending === true;

//   if (!user) {
//     return (
//       <Link href="/sign-in">
//         <Button>Sign in to become a mentor</Button>
//       </Link>
//     );
//   }

//   if (isMentor) {
//     return (
//       <Link href="/mentor-dashboard">
//         <Button>Go to Mentor Dashboard</Button>
//       </Link>
//     );
//   }

//   if (isMentorPending) {
//     return <Button disabled>Application Pending</Button>;
//   }

//   return (
//     <Link href="/mentors/apply">
//       <Button>Become a Mentor</Button>
//     </Link>
//   );
// }
