import { Anchor, Box, Heading, Paragraph } from 'grommet'
import Link from 'next/link'

export default function HomePage() {
  return (
    <Box align="center" direction="column" pad="medium">
      <Heading>University BBN app</Heading>
      <Paragraph>
        {/* <Link href="/new" passHref>
        <Anchor>Enroll a new Course</Anchor> */}
        <Link href="/student" passHref>
        <Anchor>Enter student Details</Anchor>
        {/* <Anchor>Create a new note</Anchor> */}
        </Link>{' '}
        {/* </Link>{' '} */}
        to get started!
      </Paragraph>
    </Box>
  )
}



// export const function Homepage() {
//   return (
//     <Box align="center" direction="column" pad="medium">
//       <Heading>University BBN app</Heading>
//       <Paragraph>
//         {/* <Link href="/new" passHref>
//         <Anchor>Enroll a new Course</Anchor> */}
//         <Link href="/student" passHref>
//         <Anchor>Enter student Details</Anchor>
//         {/* <Anchor>Create a new note</Anchor> */}
//         </Link>{' '}
//         {/* </Link>{' '} */}
//         to get started!
//       </Paragraph>
//     </Box>
//   )
// }
